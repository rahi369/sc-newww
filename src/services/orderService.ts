import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, OrderStatus, RewardProfile, Voucher } from '../types';

const ORDERS_COLLECTION = 'orders';
const REWARD_PROFILES_COL = 'rewardProfiles';
const VOUCHERS_COL = 'vouchers';
const LOCAL_ORDERS_KEY = 'samias_closet_orders_v1';
const LOCAL_PROFILES_KEY = 'samias_closet_reward_profiles_v1';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]): void {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save local orders:', e);
  }
}

export const orderService = {
  // Create an order with Firestore + persistent local store
  async createOrder(
    orderPayload: Omit<Order, 'id' | 'orderId' | 'status' | 'createdAt' | 'updatedAt'> & {
      appliedVoucherIds?: string[];
    }
  ): Promise<string> {
    const timestamp = Date.now();
    const cleanRandom = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `SC-${timestamp.toString().slice(-6)}-${cleanRandom}`;
    const docId = `order-${timestamp}-${cleanRandom}`;

    const newOrder: Order = {
      ...orderPayload,
      id: docId,
      orderId: generatedOrderId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Always save to local backup immediately
    const existingLocal = getLocalOrders();
    saveLocalOrders([newOrder, ...existingLocal]);

    // 2. Update local reward profile / streak
    try {
      const rawProfiles = localStorage.getItem(LOCAL_PROFILES_KEY);
      const profilesMap: Record<string, RewardProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};
      const current = profilesMap[orderPayload.customerId] || {
        customerId: orderPayload.customerId,
        streak: 0,
        totalPurchases: 0,
        isGiftEligible: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const nextStreak = (current.streak || 0) + 1;
      const nextPurchases = (current.totalPurchases || 0) + 1;
      const updatedProfile: RewardProfile = {
        ...current,
        streak: nextStreak,
        totalPurchases: nextPurchases,
        lastPurchaseDate: new Date().toISOString(),
        isGiftEligible: nextStreak >= 20 && nextPurchases >= 1,
        updatedAt: new Date().toISOString()
      };
      profilesMap[orderPayload.customerId] = updatedProfile;
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profilesMap));
    } catch (e) {
      console.warn('Local reward profile update notice:', e);
    }

    // 3. Attempt Firestore persistence
    try {
      await setDoc(doc(db, ORDERS_COLLECTION, docId), newOrder);

      // Process applied vouchers
      if (orderPayload.appliedVoucherIds && orderPayload.appliedVoucherIds.length > 0) {
        for (const voucherId of orderPayload.appliedVoucherIds) {
          try {
            const vRef = doc(db, VOUCHERS_COL, voucherId);
            const vSnap = await getDoc(vRef);
            if (vSnap.exists()) {
              const vData = vSnap.data() as Voucher;
              const nextCount = (vData.usageCount || 0) + 1;
              const isNowUsed = nextCount >= vData.maxUsage;
              await updateDoc(vRef, {
                usageCount: nextCount,
                status: isNowUsed ? 'used' : 'active'
              });
            }
          } catch {}
        }
      }

      // Firestore Reward Profile sync
      try {
        const profileRef = doc(db, REWARD_PROFILES_COL, orderPayload.customerId);
        const profileSnap = await getDoc(profileRef);
        let currentStreak = 0;
        let totalPurchases = 0;

        if (profileSnap.exists()) {
          const prof = profileSnap.data() as RewardProfile;
          totalPurchases = (prof.totalPurchases || 0) + 1;
          currentStreak = (prof.streak || 0) + 1;
        } else {
          totalPurchases = 1;
          currentStreak = 1;
        }

        await setDoc(
          profileRef,
          {
            customerId: orderPayload.customerId,
            streak: currentStreak,
            totalPurchases,
            lastPurchaseDate: new Date().toISOString(),
            isGiftEligible: currentStreak >= 20 && totalPurchases >= 1,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch {}
    } catch (error) {
      console.warn('Firestore cloud write warning (order preserved locally):', error);
    }

    return generatedOrderId;
  },

  // Customer real-time orders listener
  subscribeToCustomerOrders(
    customerId: string,
    callback: (orders: Order[]) => void
  ): () => void {
    const localFiltered = getLocalOrders().filter((o) => o.customerId === customerId);

    // Initial callback with local orders immediately
    callback(localFiltered);

    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const firestoreOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            firestoreOrders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
          });

          // Merge by ID avoiding duplicates
          const mergedMap = new Map<string, Order>();
          localFiltered.forEach((o) => mergedMap.set(o.orderId, o));
          firestoreOrders.forEach((o) => mergedMap.set(o.orderId, o));

          const merged = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          callback(merged);
        },
        (error) => {
          console.warn('Firestore orders subscription notice:', error);
          callback(localFiltered);
        }
      );

      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  // Admin real-time orders listener
  subscribeToAllOrders(callback: (orders: Order[]) => void): () => void {
    const allLocal = getLocalOrders();
    callback(allLocal);

    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const firestoreOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            firestoreOrders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
          });

          const mergedMap = new Map<string, Order>();
          allLocal.forEach((o) => mergedMap.set(o.orderId, o));
          firestoreOrders.forEach((o) => mergedMap.set(o.orderId, o));

          const merged = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          callback(merged);
        },
        (error) => {
          console.warn('Admin orders subscription notice:', error);
          callback(allLocal);
        }
      );

      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  // Admin update order status
  async updateOrderStatus(orderDocId: string, newStatus: OrderStatus): Promise<void> {
    // 1. Update local storage
    const local = getLocalOrders();
    const updatedLocal = local.map((o) =>
      o.id === orderDocId || o.orderId === orderDocId
        ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
        : o
    );
    saveLocalOrders(updatedLocal);

    // 2. Attempt Firestore update
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderDocId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore update status notice:', e);
    }
  }
};

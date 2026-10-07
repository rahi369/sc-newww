import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';
const LOCAL_PRODUCTS_KEY = 'samias_closet_custom_products_v1';

function getLocalCustomProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
}

export const productService = {
  subscribeToProducts(callback: (products: Product[]) => void): () => void {
    const customLocal = getLocalCustomProducts();
    const fallbackList = [...customLocal, ...INITIAL_PRODUCTS];

    callback(fallbackList);

    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(colRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            this.seedInitialProducts().catch(() => {});
            callback(fallbackList);
            return;
          }

          const cloudProds: Product[] = [];
          snapshot.forEach((docSnap) => {
            cloudProds.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
          });

          // Merge custom local with cloud
          const map = new Map<string, Product>();
          fallbackList.forEach((p) => map.set(p.id, p));
          cloudProds.forEach((p) => map.set(p.id, p));

          callback(Array.from(map.values()));
        },
        (error) => {
          console.warn('Firestore products subscription notice:', error);
          callback(fallbackList);
        }
      );

      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async seedInitialProducts(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      if (!snap.empty) return;

      for (const prod of INITIAL_PRODUCTS) {
        const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        await setDoc(docRef, prod);
      }
    } catch {}
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally
    const local = getLocalCustomProducts();
    saveLocalCustomProducts([newProduct, ...local]);

    // Attempt Firestore
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await setDoc(docRef, newProduct);
    } catch (e) {
      console.warn('Firestore addProduct notice:', e);
    }

    return id;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const local = getLocalCustomProducts();
    const updated = local.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveLocalCustomProducts(updated);

    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore updateProduct notice:', e);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const local = getLocalCustomProducts();
    saveLocalCustomProducts(local.filter((p) => p.id !== id));

    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Firestore deleteProduct notice:', e);
    }
  }
};

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Save
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { rewardsService } from '../services/rewardsService';
import { Product, Order, OrderStatus, QuizQuestion, RewardProfile } from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, openAuthModal } = useAuth();

  // Navigation tab inside admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'quiz'>('dashboard');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    active: true
  });
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);

  // Customers / Reward Profiles
  const [customerProfiles, setCustomerProfiles] = useState<RewardProfile[]>([]);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Subscriptions & Data Loading
  useEffect(() => {
    if (!isAdmin) return;

    const unsubProducts = productService.subscribeToProducts(setProducts);
    const unsubOrders = orderService.subscribeToAllOrders(setOrders);

    async function loadAdminExtras() {
      const questions = await rewardsService.getAllQuizQuestions();
      setQuizQuestions(questions);

      const profiles = await rewardsService.getAllCustomerRewardProfiles();
      setCustomerProfiles(profiles);
    }

    loadAdminExtras();

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, [isAdmin]);

  // If not authorized
  if (!user || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="font-brand text-2xl font-bold text-gray-900">
            Admin Management Protected
          </h2>
          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            This control center is strictly reserved for the authorized business owner (<strong>{ADMIN_EMAIL}</strong>).
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-6 py-3 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Owner Sign In ({ADMIN_EMAIL})
          </button>
        </div>
      </div>
    );
  }

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.id) {
        // Update
        await productService.updateProduct(editingProduct.id, editingProduct);
        showToast('Product updated successfully!');
      } else {
        // Create
        await productService.addProduct({
          name: editingProduct.name || 'Untitled Garment',
          category: editingProduct.category || 'Women',
          price: Number(editingProduct.price) || 0,
          image: editingProduct.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          description: editingProduct.description || '',
          stock: Number(editingProduct.stock) || 1,
          sizes: editingProduct.sizes || ['M', 'L', 'XL'],
          colors: editingProduct.colors || ['Standard'],
          status: (Number(editingProduct.stock) || 0) > 0 ? 'in_stock' : 'out_of_stock',
          visibility: editingProduct.visibility ?? true
        });
        showToast('New product added to Firestore catalog!');
      }
      setEditingProduct(null);
      setIsNewProductModalOpen(false);
    } catch (err: any) {
      showError(err.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      showToast('Product deleted from Firestore.');
    } catch (err: any) {
      showError(err.message || 'Failed to delete product.');
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      await productService.updateProduct(product.id, { visibility: !product.visibility });
      showToast(`Product ${!product.visibility ? 'made visible' : 'hidden from catalog'}.`);
    } catch (err: any) {
      showError(err.message || 'Failed to toggle visibility.');
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderDocId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderDocId, status);
      showToast(`Order status updated to ${status}!`);
    } catch (err: any) {
      showError(err.message || 'Failed to update order status.');
    }
  };

  // --- QUIZ ACTIONS ---
  const handleSaveQuizQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question?.trim()) return;

    try {
      await rewardsService.saveQuizQuestion({
        question: newQuestion.question.trim(),
        options: newQuestion.options || [],
        correctAnswer: Number(newQuestion.correctAnswer) || 0,
        explanation: newQuestion.explanation || '',
        active: newQuestion.active ?? true
      });
      const updatedList = await rewardsService.getAllQuizQuestions();
      setQuizQuestions(updatedList);
      setIsNewQuestionModalOpen(false);
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', active: true });
      showToast('New quiz question saved to Firestore!');
    } catch (err: any) {
      showError(err.message || 'Failed to save quiz question.');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-[#1C1917] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FDE047]">
              Authorized Store Owner
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              ● Live Sync
            </span>
          </div>
          <h1 className="font-brand text-2xl sm:text-3xl font-bold tracking-wide">
            SAMIA’S CLOSET Control Center
          </h1>
          <p className="text-xs text-stone-300">
            Welcome, <strong>Md. Humaun Husen Rahi</strong> ({user.email})
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-[#0E7490] text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-[#0E7490] text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <span>Orders ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-[#0E7490] text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customers' ? 'bg-[#0E7490] text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Customers &amp; Streaks
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-[#0E7490] text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Quiz Management
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-2 text-xs text-rose-800 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</span>
              <p className="text-3xl font-extrabold text-[#0E7490] mt-1">৳{totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-gray-500 mt-1">Excludes cancelled orders</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Orders</span>
              <p className="text-3xl font-extrabold text-amber-600 mt-1">{pendingOrders}</p>
              <p className="text-[11px] text-gray-500 mt-1">Requires dispatch confirmation</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Delivered Orders</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{deliveredOrders}</p>
              <p className="text-[11px] text-gray-500 mt-1">Successfully fulfilled</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Catalog</span>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">{products.length}</p>
              <p className="text-[11px] text-gray-500 mt-1">Women &amp; Boys/Men</p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-brand text-lg font-bold text-gray-900">
              Quick Administrative Tasks
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'Women',
                    price: 2000,
                    image: '',
                    description: '',
                    stock: 10,
                    sizes: ['M', 'L', 'XL'],
                    colors: ['Standard'],
                    visibility: true
                  });
                  setIsNewProductModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#0891B2]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Garment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNewQuestionModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] border border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:border-[#0E7490]"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Add Quiz Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h2 className="font-brand text-xl font-bold text-gray-900">
              Customer Orders Manager ({orders.length})
            </h2>
            <span className="text-xs text-gray-500">
              Updating order status here instantly updates the customer's view.
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-xs text-gray-500">
              No orders have been received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0E7490]">{order.orderId}</span>
                        <span className="text-xs text-gray-500">&bull; {new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-0.5">
                        Customer: <strong className="text-gray-900">{order.customerName}</strong> ({order.phone})
                        &bull; Code: <span className="font-mono text-gray-500">{order.customerCode}</span>
                      </p>
                    </div>

                    {/* Status updater dropdown */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-gray-600">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e: any) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Items and Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Ordered Items:</h4>
                      <ul className="space-y-1">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="text-gray-600">
                            &bull; <strong>{it.name}</strong> ({it.size}, {it.color}) &times; {it.quantity} = ৳{(it.price * it.quantity).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 text-gray-600">
                      <p><strong>Shipping Address:</strong> {order.address}</p>
                      <p><strong>Region:</strong> {order.area} (Charge: ৳{order.deliveryCharge})</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod} {order.transactionId && `(TrxID: ${order.transactionId})`}</p>
                      <p className="text-sm font-bold text-[#0E7490] pt-1">
                        Grand Total: ৳{order.total.toLocaleString()} {order.discount > 0 && `(Voucher discount: ৳${order.discount})`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h2 className="font-brand text-xl font-bold text-gray-900">
              Product Catalog Inventory ({products.length})
            </h2>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'Women',
                  price: 2500,
                  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                  description: '',
                  stock: 10,
                  sizes: ['M', 'L', 'XL'],
                  colors: ['Standard'],
                  visibility: true
                });
                setIsNewProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-20 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-[#0E7490] block">
                      {prod.category}
                    </span>
                    <h4 className="font-brand text-sm font-bold text-gray-900 truncate">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">
                      ৳{prod.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Stock: {prod.stock} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => handleToggleVisibility(prod)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    title="Toggle public visibility"
                  >
                    {prod.visibility ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    <span>{prod.visibility ? 'Public' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsNewProductModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CUSTOMERS & STREAKS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h2 className="font-brand text-xl font-bold text-gray-900">
              Customer Reward Profiles &amp; Streaks
            </h2>
            <span className="text-xs text-gray-500">
              Tracks customer loyalty, orders, and 20-streak physical gift qualifications.
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Customer UID</th>
                    <th className="p-3.5">Current Streak</th>
                    <th className="p-3.5">Total Orders</th>
                    <th className="p-3.5">Last Purchase</th>
                    <th className="p-3.5">Gift Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customerProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">
                        No customer loyalty profiles recorded yet.
                      </td>
                    </tr>
                  ) : (
                    customerProfiles.map((prof, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3.5 font-mono text-[11px] text-gray-900">{prof.customerId}</td>
                        <td className="p-3.5 font-bold text-[#0E7490]">{prof.streak} / 20</td>
                        <td className="p-3.5 font-semibold text-gray-800">{prof.totalPurchases}</td>
                        <td className="p-3.5 text-gray-500">
                          {prof.lastPurchaseDate ? new Date(prof.lastPurchaseDate).toLocaleDateString() : 'None'}
                        </td>
                        <td className="p-3.5">
                          {prof.isGiftEligible ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                              👑 Winner (20 Streak)
                            </span>
                          ) : (
                            <span className="text-gray-400">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. QUIZ MANAGEMENT */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h2 className="font-brand text-xl font-bold text-gray-900">
              Daily Quiz Questions Bank ({quizQuestions.length})
            </h2>
            <button
              onClick={() => setIsNewQuestionModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {quizQuestions.map((q) => (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-sm text-gray-900">{q.question}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    q.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {q.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border ${
                        idx === q.correctAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt} {idx === q.correctAnswer && '✅ (Correct Answer)'}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p className="text-[11px] text-gray-500 pt-1">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT EDIT / ADD MODAL */}
      {isNewProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 my-8 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-brand text-lg font-bold text-gray-900">
                {editingProduct.id ? 'Edit Garment' : 'Add New Garment to Catalog'}
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Pure Georgette Silk Party Suit"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'Women'}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Women">Women</option>
                    <option value="Boys/Men">Boys/Men</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    placeholder="2500"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Visibility</label>
                  <select
                    value={editingProduct.visibility ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, visibility: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="true">Public (Visible)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Fabric &amp; Design Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Details on fabric GSM, embroidery zari, sleeves, pairing..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7490] text-white font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUIZ QUESTION ADD MODAL */}
      {isNewQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 my-8 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-brand text-lg font-bold text-gray-900">
                Add Daily Quiz Question
              </h3>
              <button
                onClick={() => setIsNewQuestionModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuizQuestion} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="e.g. In garment manufacturing, what is the purpose of mercerization?"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-gray-700">4 Multiple Choice Options:</label>
                {newQuestion.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 font-bold text-gray-500">{String.fromCharCode(65 + idx)}:</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...(newQuestion.options || [])];
                        next[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: next });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Correct Option (0-3)</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value={0}>A (First Option)</option>
                  <option value={1}>B (Second Option)</option>
                  <option value={2}>C (Third Option)</option>
                  <option value={3}>D (Fourth Option)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Educational Explanation</label>
                <textarea
                  rows={2}
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  placeholder="Explain why this answer is correct..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E7490] text-white font-bold uppercase tracking-wider"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

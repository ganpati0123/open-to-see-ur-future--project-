import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Image as ImageIcon,
  Key,
  Laptop,
  Layers,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useStore, CustomerReview, VisitorSessionLog } from '../context/StoreContext';
import { Product, PRODUCT_CATEGORIES } from '../data/productsData';
import { formatCurrency } from '../utils/money';
import { playChimeSound } from '../utils/audio';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    categories,
    reviews,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    deleteReview,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    analytics,
    currentStaySeconds,
    simulateVisitorActivity,
    clearVisitorLogs,
  } = useStore();

  // Login form states
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab: 'analytics' | 'products' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'reviews' | 'settings'>('analytics');

  // Visitor intelligence search & filter states
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'Logged-In' | 'VIP Member' | 'Guest'>('all');
  const [visitorSearch, setVisitorSearch] = useState('');

  // Product search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'INR' | 'USD'>('all');

  // Review search & filter states
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'all' | '5' | '4' | 'photos'>('all');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  // Product modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states for creating / editing product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Ritual Goods',
    price: 35,
    currency: 'USD',
    tag: 'Hand-Selected',
    description: '',
    details: ['100% Consecrated and Cleansed', 'Carefully Packed in Sacred Box'],
    image: '',
    inStock: true,
  });
  const [newDetailInput, setNewDetailInput] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Notification helper
  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4500);
  };

  // Handle Admin login submit (ID & Password)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(adminId, password);
    if (success) {
      playChimeSound();
      setPassword('');
    } else {
      setLoginError('Invalid credentials. Use Admin ID: "admin" & Password: "admin123"');
    }
  };

  // Open modal for new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: 'Zodiac Bracelets',
      price: 45,
      currency: 'INR',
      tag: 'New Consecration',
      description: '',
      details: ['Hand-tied durable cord', 'Natural authentic stones', 'Consecrated under clean lunar cycle'],
      image: '/public/products/bracelet-aries.png',
      inStock: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      currency: product.currency || 'USD',
      tag: product.tag,
      description: product.description,
      details: [...product.details],
      image: product.image,
      inStock: product.inStock,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle image upload from computer file picker
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setFormError('Image size exceeds 3MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData((prev) => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name?.trim()) {
      setFormError('Product name is required.');
      return;
    }

    const effectiveCategory = customCategoryInput.trim() || formData.category || 'Ritual Goods';
    const effectivePrice = Number(formData.price) || 1;

    if (editingProductId) {
      // Update existing
      updateProduct(editingProductId, {
        name: formData.name.trim(),
        category: effectiveCategory as any,
        price: effectivePrice,
        currency: formData.currency,
        tag: formData.tag?.trim() || 'Featured',
        description: formData.description?.trim() || '',
        details: formData.details?.length ? formData.details : ['Sacred studio item'],
        image: formData.image || '/oracle-logo.png',
        inStock: formData.inStock !== false,
      });
      showSuccess(`“${formData.name}” updated successfully on the live storefront.`);
    } else {
      // Create new
      const created = addProduct({
        name: formData.name.trim(),
        category: effectiveCategory as any,
        price: effectivePrice,
        currency: formData.currency,
        tag: formData.tag?.trim() || 'New Offering',
        description: formData.description?.trim() || 'Handcrafted sacred piece curated by Neha Arora.',
        details: formData.details?.length ? formData.details : ['Hand-selected authentic piece'],
        image: formData.image || '/oracle-logo.png',
        inStock: formData.inStock !== false,
        rating: 5.0,
        reviewsCount: 0,
      });
      showSuccess(`New product “${created.name}” is now LIVE on the website!`);
    }

    playChimeSound();
    setIsModalOpen(false);
  };

  // Quick price adjuster on live products table (+/- ₹50 or $5)
  const handleQuickPriceAdjust = (productId: string, currentPrice: number, delta: number) => {
    const newPrice = Math.max(1, currentPrice + delta);
    updateProduct(productId, { price: newPrice });
    playChimeSound();
  };

  // Toggle inStock directly
  const handleToggleStock = (product: Product) => {
    updateProduct(product.id, { inStock: !product.inStock });
    playChimeSound();
    showSuccess(`${product.name} is now ${!product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}.`);
  };

  // Delete product with confirmation
  const handleDeleteProduct = (productId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove “${name}” from the storefront? This change will reflect live immediately.`)) {
      deleteProduct(productId);
      playChimeSound();
      showSuccess(`Product “${name}” was removed from the store.`);
    }
  };

  // Delete review with confirmation
  const handleDeleteReview = (reviewId: string, reviewerName: string) => {
    if (window.confirm(`Permanently remove review by ${reviewerName}?`)) {
      deleteReview(reviewId);
      playChimeSound();
      showSuccess(`Review by ${reviewerName} was deleted.`);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesCurrency = currencyFilter === 'all' || (p.currency || 'USD') === currencyFilter;
      return matchesSearch && matchesCategory && matchesCurrency;
    });
  }, [products, searchQuery, selectedCategory, currencyFilter]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.productName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.title.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.body.toLowerCase().includes(reviewSearch.toLowerCase());

      if (!matchesSearch) return false;
      if (reviewRatingFilter === '5') return r.rating === 5;
      if (reviewRatingFilter === '4') return r.rating === 4;
      if (reviewRatingFilter === 'photos') return r.photos && r.photos.length > 0;
      return true;
    });
  }, [reviews, reviewSearch, reviewRatingFilter]);

  // Format seconds to minutes and seconds ("kitna der stay kiya")
  const formatDuration = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  // Filter visitors log
  const filteredVisitors = useMemo(() => {
    const list = analytics?.visitors || [];
    return list.filter((vis) => {
      const matchesFilter = visitorFilter === 'all' || vis.userType === visitorFilter;
      const q = visitorSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        vis.name.toLowerCase().includes(q) ||
        (vis.email && vis.email.toLowerCase().includes(q)) ||
        vis.city.toLowerCase().includes(q) ||
        vis.country.toLowerCase().includes(q) ||
        vis.device.toLowerCase().includes(q) ||
        vis.lastAction.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [analytics?.visitors, visitorFilter, visitorSearch]);

  // Metrics
  const metrics = useMemo(() => {
    const inStockCount = products.filter((p) => p.inStock).length;
    const totalReviews = reviews.length;
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '5.0';
    return {
      totalProducts: products.length,
      inStock: inStockCount,
      outOfStock: products.length - inStockCount,
      totalReviews,
      avgRating,
    };
  }, [products, reviews]);

  // ==========================================
  // VIEW: Admin Login Screen (if not logged in)
  // ==========================================
  if (!isAdmin) {
    return (
      <main className="cosmic-shell min-h-screen flex items-center justify-center p-4 text-[#f5f0e7] selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e6b967]/30 bg-[#111326]/80 px-4 py-2 text-xs uppercase tracking-[.15em] text-[#e6b967] shadow-sm transition-all hover:bg-[#e6b967]/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Studio Storefront</span>
          </Link>

          <div className="rounded-3xl border border-[#e6b967]/30 bg-[#111326]/90 p-8 sm:p-10 shadow-[0_0_80px_rgba(89,55,181,0.25)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#e6b967]/50 bg-[#080914] text-[#e6b967]">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#e6b967] font-semibold">
                  OpenToSeeYourFuture
                </span>
                <h1 className="font-serif text-3xl text-[#f5f0e7]">Studio Admin Suite</h1>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#a8a9bf]">
              Secure management suite to add and remove sacred goods, adjust real-time prices, and moderate customer reviews.
            </p>

            {/* Admin Credentials helper pill */}
            <div className="mt-5 rounded-xl border border-[#e6b967]/25 bg-[#080914]/80 p-3.5 text-xs text-[#d4cfc5]">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#e6b967]/15">
                <span className="text-[#a8a9bf] uppercase tracking-wider">Authorized Login:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminId('admin');
                    setPassword('admin123');
                    setLoginError('');
                  }}
                  className="rounded bg-[#e6b967]/15 border border-[#e6b967]/30 px-2 py-0.5 text-[10px] text-[#e6b967] hover:bg-[#e6b967]/30 cursor-pointer transition-colors"
                >
                  ⚡ Auto-fill Demo
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#a8a9bf]">Admin ID: <strong className="text-[#e6b967]">admin</strong></span>
                <span className="text-[#a8a9bf]">Password: <strong className="text-[#e6b967]">admin123</strong></span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                Admin Login ID
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter Admin ID (e.g. admin)..."
                    className="w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-3 text-sm text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967] focus:ring-1 focus:ring-[#e6b967]"
                  />
                  <ShieldCheck className="absolute right-3.5 top-3.5 h-4 w-4 text-[#8d6d4e]" />
                </div>
              </label>

              <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                Admin Password
                <div className="relative mt-1.5">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password..."
                    className="w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-3 text-sm text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967] focus:ring-1 focus:ring-[#e6b967]"
                  />
                  <Key className="absolute right-3.5 top-3.5 h-4 w-4 text-[#8d6d4e]" />
                </div>
              </label>

              {loginError && (
                <p role="alert" className="text-xs text-[#d48372]">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#e6b967] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#080914] shadow-md transition-all hover:bg-[#d8a74e] cursor-pointer"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW: Main Authenticated Admin Suite
  // ==========================================
  return (
    <div className="min-h-screen bg-[#080914] text-[#f5f0e7] selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
      {/* Top Admin Sticky Bar */}
      <header className="sticky top-0 z-30 border-b border-[#e6b967]/20 bg-[#080914]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-9 w-9 rounded-full border border-[#e6b967]/50 overflow-hidden bg-[#111326]">
                <img src="/oracle-logo.png" alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="font-serif text-lg text-[#f5f0e7] group-hover:text-[#e6b967] transition-colors">
                  OpenToSeeYourFuture
                </span>
                <span className="ml-2 rounded-full border border-[#e6b967]/30 bg-[#e6b967]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#e6b967]">
                  Admin Pro Max
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e6b967]/30 px-3.5 py-1.5 text-xs text-[#e6b967] hover:bg-[#e6b967]/10 transition-colors"
              title="Open customer view"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Live Storefront</span>
            </Link>

            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#9b4f40]/40 px-3.5 py-1.5 text-xs text-[#d48372] hover:bg-[#9b4f40]/20 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#27745b]/40 bg-[#27745b]/15 p-4 text-xs text-[#a2e3cd] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
              <span>{actionSuccess}</span>
            </div>
            <button type="button" onClick={() => setActionSuccess('')} className="p-1 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dashboard Top Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {/* Card 1: Total Visitors (Kitna Log Aaye) */}
          <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#a8a9bf]">Total Visitors Today</span>
              <Users className="h-4 w-4 text-[#e6b967]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#f5f0e7]">{analytics?.totalVisitorsToday ?? 148}</span>
              <span className="text-[10px] text-[#25D366] font-medium flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +24% today
              </span>
            </div>
            <div className="mt-1 text-[10px] text-[#a8a9bf]">
              All-time visits: <strong className="text-[#f5f0e7]">{(analytics?.totalVisitorsAllTime ?? 2942).toLocaleString()}</strong>
            </div>
          </div>

          {/* Card 2: Active Live Seekers Now */}
          <div className="rounded-2xl border border-[#27745b]/40 bg-[#111326]/80 p-5 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#a2e3cd]">Live Active Seekers</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#25D366]">{analytics?.activeNow ?? 4}</span>
              <span className="text-[10px] text-[#a2e3cd]">Browsing now</span>
            </div>
            <div className="mt-1 text-[10px] text-[#a8a9bf]">
              Real-time pulse across site
            </div>
          </div>

          {/* Card 3: Average Stay Duration (Kitna Der Stay Kiya) */}
          <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#a8a9bf]">Avg Stay Duration</span>
              <Clock className="h-4 w-4 text-[#e6b967]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-2xl text-[#f5f0e7]">
                {formatDuration(analytics?.averageStaySeconds ?? 432)}
              </span>
              <span className="rounded bg-[#e6b967]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#e6b967]">
                High Dwell
              </span>
            </div>
            <div className="mt-1 text-[10px] text-[#a8a9bf]">
              Kitna der stay kiya (Average)
            </div>
          </div>

          {/* Card 4: Current Live Session Timer */}
          <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#a8a9bf]">Active Session Live</span>
              <Activity className="h-4 w-4 text-[#e6b967] animate-pulse" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-mono text-[#e6b967]">
                {formatDuration(currentStaySeconds)}
              </span>
              <span className="text-[10px] text-[#25D366]">⏱️ Live</span>
            </div>
            <div className="mt-1 text-[10px] text-[#a8a9bf]">
              Your current session dwell
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e6b967]/20 pb-4">
          <div className="flex flex-wrap gap-2">
            {/* Tab 1: Live Analytics & Visitor Intelligence */}
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#e6b967] text-[#080914] shadow-md'
                  : 'border border-[#e6b967]/30 text-[#a8a9bf] hover:text-[#f5f0e7]'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Visitor & Stay Intelligence</span>
              <span className="rounded-full bg-[#080914]/40 px-2 py-0.5 text-[10px]">
                {analytics?.visitors?.length || 0}
              </span>
            </button>

            {/* Tab 2: Products & Live Pricing */}
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#e6b967] text-[#080914] shadow-md'
                  : 'border border-[#e6b967]/30 text-[#a8a9bf] hover:text-[#f5f0e7]'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Products & Live Pricing</span>
              <span className="rounded-full bg-[#080914]/40 px-2 py-0.5 text-[10px]">
                {products.length}
              </span>
            </button>

            {/* Tab 3: Reviews & Photos Moderation */}
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#e6b967] text-[#080914] shadow-md'
                  : 'border border-[#e6b967]/30 text-[#a8a9bf] hover:text-[#f5f0e7]'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Reviews & Photos</span>
              <span className="rounded-full bg-[#080914]/40 px-2 py-0.5 text-[10px]">
                {reviews.length}
              </span>
            </button>

            {/* Tab 4: Studio Settings */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#e6b967] text-[#080914] shadow-md'
                  : 'border border-[#e6b967]/30 text-[#a8a9bf] hover:text-[#f5f0e7]'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Studio Settings</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#e6b967] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#080914] shadow-md transition-all hover:bg-[#d8a74e] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          )}

          {activeTab === 'analytics' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  simulateVisitorActivity();
                  playChimeSound();
                  showSuccess('Simulated new live visitor session in real time!');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6b967]/40 bg-[#e6b967]/15 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#e6b967] hover:bg-[#e6b967]/30 transition-all cursor-pointer"
                title="Simulate visitor arrival to verify live counter & stay duration"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>+ Simulate Live Visitor Ping</span>
              </button>
            </div>
          )}
        </div>

        {/* =================================================== */}
        {/* TAB 0: LIVE VISITOR & STAY DURATION INTELLIGENCE    */}
        {/* =================================================== */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            {/* Visitors Search & Filter Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8d6d4e]" />
                <input
                  type="text"
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  placeholder="Search visitors by name, email, city, device, or sacred action..."
                  className="w-full rounded-lg border border-[#e6b967]/25 bg-[#080914] py-2.5 pl-10 pr-4 text-xs text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Seekers' },
                  { id: 'VIP Member', label: 'VIP Members' },
                  { id: 'Logged-In', label: 'Logged-In' },
                  { id: 'Guest', label: 'Guests' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setVisitorFilter(f.id as any)}
                    className={`rounded-lg px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      visitorFilter === f.id
                        ? 'bg-[#e6b967] text-[#080914] font-semibold'
                        : 'border border-[#e6b967]/20 text-[#a8a9bf] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={clearVisitorLogs}
                  title="Clear visitor activity logs"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#9b4f40]/40 px-3 py-1.5 text-xs text-[#d48372] hover:bg-[#9b4f40]/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Clear Logs</span>
                </button>
              </div>
            </div>

            {/* Visitors Detailed Table (Lom lgon kiay detiakls and rh heceez emans hr cheex ktina dser stay kiya) */}
            <div className="overflow-x-auto rounded-2xl border border-[#e6b967]/20 bg-[#111326]/75 backdrop-blur-md">
              <div className="border-b border-[#e6b967]/20 bg-[#080914]/80 px-4 py-3 sm:px-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base text-[#f5f0e7]">
                    Seeker Visitor Logs & Live Dwell Times
                  </h3>
                  <p className="text-[11px] text-[#a8a9bf]">
                    Detailed breakdown of who visited, their login/account identity, city, device, and exact stay duration.
                  </p>
                </div>
                <span className="rounded-full border border-[#27745b] bg-[#27745b]/20 px-3 py-1 text-[10px] text-[#25D366] font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Live Syncing
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#e6b967]/20 bg-[#080914]/60 text-[10px] uppercase tracking-wider text-[#a8a9bf]">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3">Seeker / User Identity</th>
                    <th className="px-3 py-3.5">Origin & Device</th>
                    <th className="px-3 py-3.5">Stay Duration (Kitna Der Stay)</th>
                    <th className="px-3 py-3.5">Pages Explored</th>
                    <th className="px-3 py-3.5">Last Sacred Action</th>
                    <th className="py-3.5 pl-3 pr-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6b967]/15">
                  {/* Current Active User / Admin Row */}
                  <tr className="bg-[#e6b967]/5 transition-colors">
                    <td className="py-3.5 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 shrink-0 rounded-full border border-[#e6b967] bg-[#e6b967]/20 grid place-items-center font-bold text-[#e6b967] text-xs">
                          NA
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-medium text-[#f5f0e7]">
                              You (Admin / Active Guide)
                            </span>
                            <span className="rounded bg-[#e6b967] px-1.5 py-0.2 text-[9px] font-bold text-[#080914]">
                              ACTIVE NOW
                            </span>
                          </div>
                          <span className="text-[10px] text-[#a8a9bf]">neha.arora@opentoseeyourfuture.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="text-[#f5f0e7] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#e6b967]" />
                        <span>Studio Master Console</span>
                      </div>
                      <div className="text-[10px] text-[#a8a9bf] flex items-center gap-1">
                        <Laptop className="h-3 w-3" />
                        <span>Desktop Browser</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e6b967]/40 bg-[#e6b967]/15 px-3 py-1 font-mono font-bold text-[#e6b967]">
                        <Clock className="h-3.5 w-3.5 animate-spin" />
                        <span>{formatDuration(currentStaySeconds)} (Ticking Live)</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        <span className="rounded bg-[#080914] border border-[#e6b967]/30 px-1.5 py-0.5 text-[10px] text-[#e6b967]">
                          Admin Control Suite
                        </span>
                        <span className="rounded bg-[#080914] border border-[#e6b967]/20 px-1.5 py-0.5 text-[10px] text-[#a8a9bf]">
                          Catalog & Pricing
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#d4cfc5]">
                      <span>Live store monitoring & catalog moderation</span>
                    </td>
                    <td className="py-3.5 pl-3 pr-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#25D366]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Seeded and dynamic visitors */}
                  {filteredVisitors.map((vis) => {
                    const isLongStay = vis.staySeconds > 600;
                    return (
                      <tr key={vis.id} className="transition-colors hover:bg-[#080914]/40">
                        {/* Seeker / User Identity */}
                        <td className="py-3.5 pl-4 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 shrink-0 rounded-full border border-[#e6b967]/30 bg-[#080914] grid place-items-center font-medium text-[#e6b967] text-xs">
                              {vis.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#f5f0e7]">{vis.name}</span>
                                <span
                                  className={`rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${
                                    vis.userType === 'VIP Member'
                                      ? 'bg-[#e6b967]/20 border border-[#e6b967]/50 text-[#e6b967]'
                                      : vis.userType === 'Logged-In'
                                      ? 'bg-[#27745b]/20 border border-[#27745b]/50 text-[#a2e3cd]'
                                      : 'bg-[#a8a9bf]/10 text-[#a8a9bf]'
                                  }`}
                                >
                                  {vis.userType}
                                </span>
                              </div>
                              {vis.email ? (
                                <span className="text-[10px] text-[#a8a9bf] font-mono">{vis.email}</span>
                              ) : (
                                <span className="text-[10px] text-[#6e685f]">Unauthenticated Guest Seeker</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Location & Device */}
                        <td className="px-3 py-3.5">
                          <div className="text-[#f5f0e7] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#e6b967]" />
                            <span>
                              {vis.city}, {vis.country}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#a8a9bf] flex items-center gap-1 mt-0.5">
                            {vis.device.includes('iPhone') || vis.device.includes('Android') || vis.device.includes('Galaxy') ? (
                              <Smartphone className="h-3 w-3" />
                            ) : (
                              <Laptop className="h-3 w-3" />
                            )}
                            <span className="line-clamp-1">{vis.device}</span>
                          </div>
                        </td>

                        {/* Stay Duration (Kitna Der Stay Kiya) */}
                        <td className="px-3 py-3.5">
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${
                              isLongStay
                                ? 'bg-[#27745b]/25 border border-[#27745b] text-[#25D366]'
                                : 'bg-[#080914] border border-[#e6b967]/30 text-[#e6b967]'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(vis.staySeconds)}</span>
                          </div>
                          <div className="text-[9px] text-[#a8a9bf] mt-0.5">
                            {isLongStay ? 'Deep contemplation' : 'Focused browsing'}
                          </div>
                        </td>

                        {/* Pages Explored */}
                        <td className="px-3 py-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {vis.pagesViewed.map((pg, pIdx) => (
                              <span
                                key={pIdx}
                                className="rounded bg-[#080914] border border-[#e6b967]/15 px-1.5 py-0.5 text-[9px] text-[#d4cfc5]"
                              >
                                {pg}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Last Sacred Action */}
                        <td className="px-3 py-3.5 text-[#d4cfc5]">
                          <span className="line-clamp-2">{vis.lastAction}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 pl-3 pr-4 text-right">
                          {vis.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#25D366]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                              Active now
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#a8a9bf]">{vis.timestamp}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredVisitors.length === 0 && (
                <div className="p-12 text-center text-xs text-[#a8a9bf]">
                  <Users className="mx-auto h-8 w-8 text-[#e6b967]/50" />
                  <p className="mt-2 text-sm text-[#f5f0e7]">No visitors matched your search</p>
                  <p className="mt-1">Try clearing the search query or simulating live traffic.</p>
                </div>
              )}
            </div>

            {/* Sacred Pages Breakdown Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-[#e6b967]/15 pb-3">
                  <span className="font-serif text-sm text-[#f5f0e7]">Most Explored Sacred Spaces</span>
                  <Eye className="h-4 w-4 text-[#e6b967]" />
                </div>
                <div className="mt-4 space-y-3">
                  {Object.entries(analytics?.pageViews || {}).map(([page, count], idx) => {
                    const maxVal = Math.max(...Object.values(analytics?.pageViews || { 'Home': 1 }), 1);
                    const pct = Math.min(100, Math.round((count / maxVal) * 100));
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#d4cfc5]">{page}</span>
                          <span className="font-mono text-[#e6b967]">{count.toLocaleString()} views</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#080914] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8d6d4e] to-[#e6b967]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-5 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#e6b967]/15 pb-3">
                    <span className="font-serif text-sm text-[#f5f0e7]">Live Storefront Sync Status</span>
                    <ShieldCheck className="h-4 w-4 text-[#25D366]" />
                  </div>
                  <div className="mt-4 space-y-3 text-xs text-[#a8a9bf]">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#f5f0e7] block">Product & Price Synchronization</strong>
                        <span>Any price reduction or increase updates immediately on the customer shop & detail pages.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#f5f0e7] block">Review Moderation Recalculation</strong>
                        <span>Deleting a review instantly recalculates the product&apos;s star rating and review count.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#f5f0e7] block">Dwell Time Tracking Active</strong>
                        <span>Session stay durations are measured per visitor to help identify high-intent seekers.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#e6b967]/15 pt-4 flex items-center justify-between text-[11px]">
                  <span className="text-[#a8a9bf]">Guide in Charge: <strong className="text-[#e6b967]">Neha Arora</strong></span>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-[#e6b967] hover:underline"
                  >
                    <span>Inspect Live Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 1: PRODUCTS & PRICING MANAGEMENT                */}
        {/* =================================================== */}
        {activeTab === 'products' && (
          <div className="mt-6 space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8d6d4e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title, category, or tag..."
                  className="w-full rounded-lg border border-[#e6b967]/25 bg-[#080914] py-2.5 pl-10 pr-4 text-xs text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-[#e6b967]/25 bg-[#080914] px-3 py-2 text-xs text-[#f5f0e7] outline-none focus:border-[#e6b967]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={currencyFilter}
                  onChange={(e) => setCurrencyFilter(e.target.value as any)}
                  className="rounded-lg border border-[#e6b967]/25 bg-[#080914] px-3 py-2 text-xs text-[#f5f0e7] outline-none focus:border-[#e6b967]"
                >
                  <option value="all">All Currencies</option>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>

                <button
                  type="button"
                  onClick={resetProductsToDefault}
                  title="Restore original studio catalog"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6b967]/20 bg-[#080914] px-3 py-2 text-xs text-[#a8a9bf] hover:text-[#e6b967] transition-colors cursor-pointer"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#e6b967]/20 bg-[#111326]/75 backdrop-blur-md">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#e6b967]/20 bg-[#080914]/70 text-[10px] uppercase tracking-wider text-[#a8a9bf]">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3">Product</th>
                    <th className="px-3 py-3.5">Category</th>
                    <th className="px-3 py-3.5">Price & Live Adjuster</th>
                    <th className="px-3 py-3.5">Stock Status</th>
                    <th className="px-3 py-3.5">Rating</th>
                    <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6b967]/15">
                  {filteredProducts.map((product) => {
                    const currency = product.currency || 'USD';
                    const isINR = currency === 'INR';
                    const step = isINR ? 50 : 5;

                    return (
                      <tr key={product.id} className="transition-colors hover:bg-[#080914]/40">
                        {/* Title and thumbnail */}
                        <td className="py-3.5 pl-4 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e6b967]/30 bg-[#080914]">
                              <img
                                src={product.image || '/oracle-logo.png'}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-serif text-sm font-medium text-[#f5f0e7] line-clamp-1">
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-[#a8a9bf]">
                                <span className="rounded bg-[#e6b967]/10 px-1.5 py-0.5 text-[#e6b967]">
                                  {product.tag || 'Sacred Item'}
                                </span>
                                <span>ID: {product.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3.5 text-[#d4cfc5]">
                          <span className="rounded-full border border-[#e6b967]/20 px-2 py-0.5 text-[10px]">
                            {product.category}
                          </span>
                        </td>

                        {/* Dynamic Live Price Adjuster */}
                        <td className="px-3 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {/* Decrease price button */}
                              <button
                                type="button"
                                onClick={() => handleQuickPriceAdjust(product.id, product.price, -step)}
                                className="rounded p-1 border border-[#e6b967]/30 bg-[#080914] text-[#d48372] hover:bg-[#d48372]/20 transition-colors cursor-pointer"
                                title={`Decrease price by ${isINR ? '₹50' : '$5'}`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>

                              {/* Live editable price input */}
                              <div className="relative flex items-center">
                                <span className="absolute left-2 text-[11px] font-mono text-[#a8a9bf]">
                                  {isINR ? '₹' : '$'}
                                </span>
                                <input
                                  type="number"
                                  min={1}
                                  value={product.price}
                                  onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value) || 1);
                                    updateProduct(product.id, { price: val });
                                  }}
                                  className="w-20 rounded-md border border-[#e6b967]/40 bg-[#080914] py-1 pl-6 pr-1 text-xs font-mono font-bold text-[#e6b967] outline-none focus:border-[#e6b967]"
                                />
                              </div>

                              {/* Increase price button */}
                              <button
                                type="button"
                                onClick={() => handleQuickPriceAdjust(product.id, product.price, step)}
                                className="rounded p-1 border border-[#e6b967]/30 bg-[#080914] text-[#25D366] hover:bg-[#25D366]/20 transition-colors cursor-pointer"
                                title={`Increase price by ${isINR ? '₹50' : '$5'}`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>

                              <span className="text-[10px] uppercase font-mono text-[#a8a9bf]">
                                {currency}
                              </span>
                            </div>

                            {/* Rapid shortcut chips */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickPriceAdjust(product.id, product.price, isINR ? -100 : -10)}
                                className="rounded bg-[#080914] border border-[#e6b967]/20 px-1 py-0.5 text-[9px] text-[#a8a9bf] hover:text-[#d48372] cursor-pointer"
                                title="Quick decrease"
                              >
                                {isINR ? '-₹100' : '-$10'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickPriceAdjust(product.id, product.price, isINR ? 100 : 10)}
                                className="rounded bg-[#080914] border border-[#e6b967]/20 px-1 py-0.5 text-[9px] text-[#a8a9bf] hover:text-[#25D366] cursor-pointer"
                                title="Quick increase"
                              >
                                {isINR ? '+₹100' : '+$10'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickPriceAdjust(product.id, product.price, isINR ? 500 : 25)}
                                className="rounded bg-[#080914] border border-[#e6b967]/20 px-1 py-0.5 text-[9px] text-[#a8a9bf] hover:text-[#e6b967] cursor-pointer"
                                title="Fast jump"
                              >
                                {isINR ? '+₹500' : '+$25'}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* In Stock toggle */}
                        <td className="px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(product)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-all cursor-pointer ${
                              product.inStock
                                ? 'bg-[#27745b]/20 border border-[#27745b] text-[#25D366]'
                                : 'bg-[#9b4f40]/20 border border-[#9b4f40] text-[#d48372]'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-[#25D366]' : 'bg-[#d48372]'}`} />
                            <span>{product.inStock ? 'In Stock' : 'Sold Out'}</span>
                          </button>
                        </td>

                        {/* Rating */}
                        <td className="px-3 py-3.5 text-[#e6b967] font-mono text-[11px]">
                          ★ {product.rating} <span className="text-[#a8a9bf]">({product.reviewsCount})</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pl-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Live View */}
                            <Link
                              to={`/product/${product.id}`}
                              className="rounded-lg p-1.5 text-[#a8a9bf] hover:bg-[#e6b967]/15 hover:text-[#e6b967] transition-colors"
                              title="View on Storefront"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(product)}
                              className="rounded-lg p-1.5 text-[#a8a9bf] hover:bg-[#e6b967]/15 hover:text-[#e6b967] transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="rounded-lg p-1.5 text-[#a8a9bf] hover:bg-[#9b4f40]/20 hover:text-[#d48372] transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-xs text-[#a8a9bf]">
                  <Package className="mx-auto h-8 w-8 text-[#e6b967]/50" />
                  <p className="mt-2 text-sm text-[#f5f0e7]">No products matched your search</p>
                  <p className="mt-1">Try clearing filters or adding a new offering.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 2: REVIEWS & PHOTOS MODERATION                  */}
        {/* =================================================== */}
        {activeTab === 'reviews' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e6b967]/20 bg-[#111326]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8d6d4e]" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search reviews by product name, reviewer, or review text..."
                  className="w-full rounded-lg border border-[#e6b967]/25 bg-[#080914] py-2.5 pl-10 pr-4 text-xs text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: '5', label: '5 Stars' },
                  { id: '4', label: '4 Stars' },
                  { id: 'photos', label: 'With Photos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setReviewRatingFilter(f.id as any)}
                    className={`rounded-lg px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      reviewRatingFilter === f.id
                        ? 'bg-[#e6b967] text-[#080914] font-semibold'
                        : 'border border-[#e6b967]/20 text-[#a8a9bf] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="relative rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-6 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#e6b967] font-semibold block">
                          Product: {rev.productName}
                        </span>
                        <h3 className="mt-1 font-serif text-lg text-[#f5f0e7]">{rev.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id, rev.name)}
                        className="rounded-lg border border-[#9b4f40]/40 p-2 text-[#d48372] hover:bg-[#9b4f40]/20 transition-colors cursor-pointer"
                        title="Delete this review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <div className="flex text-[#e6b967]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-[#e6b967]" />
                        ))}
                      </div>
                      <span className="text-[#a8a9bf]">·</span>
                      <span className="text-[#a8a9bf]">{rev.date}</span>
                      <span className="text-[#a8a9bf]">·</span>
                      <span className="text-[#d4cfc5] font-medium">{rev.name}</span>
                    </div>

                    <p className="mt-3 text-xs text-[#c7c8d8] leading-relaxed font-light">{rev.body}</p>

                    {/* Customer Photos */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {rev.photos.map((photo, pIdx) => (
                          <button
                            type="button"
                            key={pIdx}
                            onClick={() => setSelectedPhotoPreview(photo)}
                            className="group/photo relative h-16 w-16 overflow-hidden rounded-lg border border-[#e6b967]/30 bg-[#080914] cursor-pointer hover:border-[#e6b967]"
                            title="Click to view full photo"
                          >
                            <img src={photo} alt="" className="h-full w-full object-cover transition-transform group-hover/photo:scale-110" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="h-4 w-4 text-[#e6b967]" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e6b967]/15 pt-3 text-[10px] text-[#a8a9bf]">
                    <span>Review ID: {rev.id}</span>
                    <Link
                      to={`/product/${rev.productId}`}
                      className="text-[#e6b967] hover:underline flex items-center gap-1"
                    >
                      <span>View on product page</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#e6b967]/20 p-12 text-center text-xs text-[#a8a9bf]">
                <MessageSquare className="mx-auto h-8 w-8 text-[#e6b967]/50" />
                <p className="mt-2 text-sm text-[#f5f0e7]">No customer reviews found</p>
                <p className="mt-1">Reviews published on product detail pages will appear here for moderation.</p>
              </div>
            )}
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 4: STUDIO & WHATSAPP CONFIGURATION              */}
        {/* =================================================== */}
        {activeTab === 'settings' && (
          <div className="mt-6 max-w-4xl space-y-6">
            <div className="rounded-2xl border border-[#e6b967]/20 bg-[#111326]/80 p-6 backdrop-blur-md space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#e6b967] font-semibold">
                  Studio Administration
                </span>
                <h3 className="mt-1 font-serif text-xl text-[#f5f0e7]">
                  Lead Guide & Checkout Preferences
                </h3>
                <p className="mt-1 text-xs text-[#a8a9bf]">
                  Configure your sacred studio checkout parameters, consultation contact points, and authentication security.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-[#e6b967]/15">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                    Lead Guide Name
                    <input
                      type="text"
                      disabled
                      value="Neha Arora"
                      className="mt-1.5 w-full rounded-lg border border-[#e6b967]/20 bg-[#080914]/80 px-4 py-2.5 text-xs text-[#e6b967] font-semibold cursor-not-allowed"
                    />
                  </label>
                  <span className="mt-1 block text-[10px] text-[#a8a9bf]">
                    Curator, intuitive tarot master, and crystal consecrator.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                    WhatsApp Direct Checkout
                    <input
                      type="text"
                      disabled
                      value="+91 99999 99999 (Studio Official)"
                      className="mt-1.5 w-full rounded-lg border border-[#e6b967]/20 bg-[#080914]/80 px-4 py-2.5 text-xs text-[#25D366] font-semibold cursor-not-allowed"
                    />
                  </label>
                  <span className="mt-1 block text-[10px] text-[#a8a9bf]">
                    All &ldquo;Proceed to Checkout&rdquo; and &ldquo;Order via WhatsApp&rdquo; buttons route to this endpoint.
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                    Active Admin Account
                    <input
                      type="text"
                      disabled
                      value="admin (Authorized Master Access)"
                      className="mt-1.5 w-full rounded-lg border border-[#e6b967]/20 bg-[#080914]/80 px-4 py-2.5 text-xs text-[#f5f0e7] font-mono cursor-not-allowed"
                    />
                  </label>
                  <span className="mt-1 block text-[10px] text-[#a8a9bf]">
                    Password: admin123 (Changeable via environment variables).
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                    Live Storefront Status
                    <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[#27745b]/40 bg-[#27745b]/10 px-4 py-2.5 text-xs text-[#25D366]">
                      <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                      <span className="font-semibold">Active & Broadcasting Live Updates</span>
                    </div>
                  </label>
                  <span className="mt-1 block text-[10px] text-[#a8a9bf]">
                    Cross-tab & storage synchronization enabled.
                  </span>
                </div>
              </div>

              {/* Danger Zone / Factory Reset */}
              <div className="rounded-xl border border-[#9b4f40]/30 bg-[#9b4f40]/10 p-5 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-sm text-[#d48372]">Restore Catalog to Default</h4>
                    <p className="text-[11px] text-[#a8a9bf] mt-0.5">
                      Reset all products back to the original studio offerings and clean local custom changes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset catalog back to initial offerings?')) {
                        resetProductsToDefault();
                        playChimeSound();
                        showSuccess('Catalog reset to initial studio collection.');
                      }
                    }}
                    className="shrink-0 rounded-lg border border-[#9b4f40] bg-[#9b4f40]/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#d48372] hover:bg-[#9b4f40] hover:text-white transition-all cursor-pointer"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Customer Review Photo Preview Modal */}
      {selectedPhotoPreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl border border-[#e6b967]/40 bg-[#111326] p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedPhotoPreview}
              alt="Customer uploaded review"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <div className="p-3 text-center text-xs text-[#e6b967]">
              Customer Uploaded Sacred Photo
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* MODAL: CREATE / EDIT PRODUCT                        */}
      {/* =================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e6b967]/35 bg-[#111326] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6b967]/20 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#e6b967] font-semibold">
                  Storefront Catalog Editor
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-[#f5f0e7]">
                  {editingProductId ? 'Edit Sacred Offering' : 'Add New Sacred Offering'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-[#a8a9bf] hover:bg-[#e6b967]/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg border border-[#9b4f40]/40 bg-[#9b4f40]/10 p-3 text-xs text-[#d48372]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              {/* Product Name */}
              <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                Product Name *
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Celestial Amethyst Figurine"
                  className="mt-1.5 w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-sm text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                />
              </label>

              {/* Price & Currency */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                  Price Amount *
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-sm text-[#e6b967] font-mono font-bold outline-none focus:border-[#e6b967]"
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            price: Math.max(1, (formData.price || 0) + (formData.currency === 'INR' ? 50 : 5)),
                          })
                        }
                        className="px-2 py-0.5 rounded bg-[#111326] border border-[#e6b967]/30 text-[10px] text-[#e6b967] hover:bg-[#e6b967]/20"
                      >
                        +{formData.currency === 'INR' ? '₹50' : '$5'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            price: Math.max(1, (formData.price || 0) - (formData.currency === 'INR' ? 50 : 5)),
                          })
                        }
                        className="px-2 py-0.5 rounded bg-[#111326] border border-[#e6b967]/30 text-[10px] text-[#d48372] hover:bg-[#d48372]/20"
                      >
                        -{formData.currency === 'INR' ? '₹50' : '$5'}
                      </button>
                    </div>
                  </div>
                </label>

                <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                  Currency
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    className="mt-1.5 w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-sm text-[#f5f0e7] outline-none focus:border-[#e6b967]"
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                  </select>
                </label>
              </div>

              {/* Category & Tag */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                    Category Shelf
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="mt-1.5 w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-sm text-[#f5f0e7] outline-none focus:border-[#e6b967]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder="Or type a new category..."
                    className="mt-2 w-full rounded border border-[#e6b967]/20 bg-[#080914] px-3 py-1.5 text-xs text-[#d4cfc5] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                  />
                </div>

                <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                  Badge / Tag
                  <input
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Best Seller, Handcrafted, Consecrated"
                    className="mt-1.5 w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-sm text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                  />
                  <div className="mt-3 flex items-center justify-between border-t border-[#e6b967]/15 pt-2">
                    <span className="text-xs text-[#a8a9bf]">Inventory Stock:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        formData.inStock
                          ? 'bg-[#27745b] text-white'
                          : 'bg-[#9b4f40] text-white'
                      }`}
                    >
                      {formData.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </label>
              </div>

              {/* Description */}
              <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                Product Description
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the spiritual resonance, origin, and characteristics of this sacred item..."
                  className="mt-1.5 w-full rounded-lg border border-[#e6b967]/30 bg-[#080914] p-3 text-sm leading-relaxed text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                />
              </label>

              {/* Image URL or Direct File Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                  Product Imagery
                </label>
                <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Paste image URL (e.g. /public/products/... or https://...)"
                    className="flex-1 rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2.5 text-xs text-[#f5f0e7] placeholder:text-[#6e685f] outline-none focus:border-[#e6b967]"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e6b967] bg-[#e6b967]/10 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-[#e6b967] hover:bg-[#e6b967]/25 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="mt-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a9bf]">Or select a sacred studio asset:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {[
                      { label: 'Selenite Tower', path: '/public/products/selenite-towers.png' },
                      { label: 'Chakra Tree', path: '/public/products/seven-chakra-gemstone-tree.png' },
                      { label: 'Amethyst Ganesha', path: '/public/products/amethyst-ganesha.png' },
                      { label: 'Crystal Angels', path: '/public/products/crystal-angels.png' },
                      { label: 'Aries Bracelet', path: '/public/products/bracelet-aries.png' },
                      { label: 'Taurus Bracelet', path: '/public/products/bracelet-taurus.png' },
                      { label: 'Ritual Candle', path: '/images/boutique_ritual_candle_1790673095609.jpg' },
                      { label: 'Zodiac Plate', path: '/public/products/zodiac-selenite-plate.png' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.path })}
                        className={`rounded border px-2 py-1 text-[10px] transition-all cursor-pointer ${
                          formData.image === preset.path
                            ? 'border-[#e6b967] bg-[#e6b967]/20 text-[#e6b967] font-semibold'
                            : 'border-[#e6b967]/20 bg-[#080914] text-[#a8a9bf] hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e6b967]/20 bg-[#080914] p-2.5">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-16 w-16 rounded object-cover border border-[#e6b967]/30"
                    />
                    <div className="text-xs text-[#a8a9bf]">
                      <span className="text-[#e6b967] block">Image Preview Loaded</span>
                      <span className="text-[10px]">Will be displayed across product cards and detail page</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bullet Points / Details */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4cfc5]">
                  Feature Specifications
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    value={newDetailInput}
                    onChange={(e) => setNewDetailInput(e.target.value)}
                    placeholder="e.g. 100% Organic Coconut Soy, 55+ Hour Clean Burn"
                    className="flex-1 rounded-lg border border-[#e6b967]/30 bg-[#080914] px-4 py-2 text-xs text-[#f5f0e7] outline-none focus:border-[#e6b967]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDetailInput.trim()) {
                        setFormData({
                          ...formData,
                          details: [...(formData.details || []), newDetailInput.trim()],
                        });
                        setNewDetailInput('');
                      }
                    }}
                    className="rounded-lg bg-[#e6b967]/20 px-3 py-2 text-xs text-[#e6b967] hover:bg-[#e6b967]/30 cursor-pointer"
                  >
                    Add Bullet
                  </button>
                </div>

                <div className="mt-3 space-y-1.5">
                  {formData.details?.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-[#080914] px-3 py-1.5 text-xs text-[#c7c8d8]"
                    >
                      <span>• {detail}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            details: formData.details?.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-[#d48372] hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Bottom CTA */}
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#e6b967]/20 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#a8a9bf] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#e6b967] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#080914] shadow-md transition-all hover:bg-[#d8a74e] cursor-pointer"
                >
                  {editingProductId ? 'Save & Sync Live Store' : 'Publish to Live Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

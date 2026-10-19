import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, PRODUCTS_DATA, PRODUCT_CATEGORIES } from '../data/productsData';

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  name: string;
  rating: number; // 1 to 5
  title: string;
  body: string;
  date: string;
  photos: string[]; // base64 or image URLs
  verified: boolean;
  helpfulCount: number;
}

export interface VisitorSessionLog {
  id: string;
  name: string;
  email?: string;
  userType: 'Logged-In' | 'Guest' | 'VIP Member';
  city: string;
  country: string;
  device: string;
  staySeconds: number; // "kitna der stay kiya"
  pagesViewed: string[];
  lastAction: string;
  timestamp: string;
  isActive: boolean;
}

export interface VisitorAnalytics {
  totalVisitorsToday: number;
  totalVisitorsAllTime: number;
  activeNow: number;
  averageStaySeconds: number;
  pageViews: Record<string, number>;
  visitors: VisitorSessionLog[];
}

interface StoreContextType {
  products: Product[];
  categories: { id: string; label: string }[];
  reviews: CustomerReview[];
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  addReview: (reviewData: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount'>) => CustomerReview;
  deleteReview: (reviewId: string) => void;
  markReviewHelpful: (reviewId: string) => void;
  getProductReviews: (productId: string) => CustomerReview[];
  getProductStats: (productId: string) => { rating: number; count: number };
  isAdmin: boolean;
  loginAdmin: (loginId: string, password?: string) => boolean;
  logoutAdmin: () => void;
  // Visitor & Stay Duration Analytics
  analytics: VisitorAnalytics;
  currentStaySeconds: number;
  trackPageVisit: (pageName: string) => void;
  simulateVisitorActivity: () => void;
  clearVisitorLogs: () => void;
}

const PRODUCTS_STORAGE_KEY = 'studio_store_products_v2';
const REVIEWS_STORAGE_KEY = 'studio_store_reviews_v2';
const ADMIN_SESSION_KEY = 'studio_store_admin_session';
const ADMIN_PASSCODE = 'admin123'; // Default studio passcode

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-init-1',
    productId: 'intention-candle',
    productName: 'Intention Soy Candle',
    name: 'Ananya Deshmukh',
    rating: 5,
    title: 'Transforms my morning sacred space',
    body: 'The Palo Santo and wild vetiver scent is extraordinarily grounding. Once the wax began pooling and revealed the embedded clear quartz crystals, the energy in my meditation corner completely shifted. Lasts way over 50 hours.',
    date: '12 Oct 2026',
    photos: ['/images/boutique_ritual_candle_1790673095609.jpg'],
    verified: true,
    helpfulCount: 14,
  },
  {
    id: 'rev-init-2',
    productId: 'crystal-kit',
    productName: 'Crystal Kit',
    name: 'Kavita Sengupta',
    rating: 5,
    title: 'Pristine vibration and genuine raw stones',
    body: 'Every single stone arrived carefully wrapped with dried lavender sprigs. The raw amethyst is deep purple and the selenite wand is radiant. You can genuinely feel the consecration before shipping.',
    date: '08 Oct 2026',
    photos: [],
    verified: true,
    helpfulCount: 9,
  },
  {
    id: 'rev-init-3',
    productId: 'bracelet-aries',
    productName: 'Aries Zodiac Bracelet',
    name: 'Rohan Mehra',
    rating: 5,
    title: 'Stunning craftsmanship, high quality stones',
    body: 'Worn daily for over three weeks. The red jasper and hematite beads have a solid, soothing weight on the wrist. Customer service on WhatsApp was also incredibly prompt.',
    date: '28 Sep 2026',
    photos: ['/public/products/bracelet-aries.png'],
    verified: true,
    helpfulCount: 6,
  },
];

const ANALYTICS_STORAGE_KEY = 'studio_store_analytics_v2';

const INITIAL_VISITOR_LOGS: VisitorSessionLog[] = [
  {
    id: 'vis-101',
    name: 'Ananya Verma',
    email: 'ananya.verma@gmail.com',
    userType: 'VIP Member',
    city: 'New Delhi',
    country: 'India',
    device: 'iPhone 15 Pro (iOS Safari)',
    staySeconds: 864, // 14m 24s
    pagesViewed: ['Sacred Spreads', 'Celtic Cross Spread', 'Intention Soy Candles', 'Reviews'],
    lastAction: 'Consultation inquiry via WhatsApp',
    timestamp: 'Active right now',
    isActive: true,
  },
  {
    id: 'vis-102',
    name: 'Rajesh Singhania',
    email: 'rajesh.singhania@gmail.com',
    userType: 'Logged-In',
    city: 'Mumbai',
    country: 'India',
    device: 'Windows 11 (Chrome 128)',
    staySeconds: 585, // 09m 45s
    pagesViewed: ['Shop All Collections', 'Zodiac Bracelets', 'Aries Bracelet'],
    lastAction: 'Submitted 5-Star Photo Review',
    timestamp: '4 mins ago',
    isActive: true,
  },
  {
    id: 'vis-103',
    name: 'Priya Kulkarni',
    email: 'priya.kulkarni@yahoo.com',
    userType: 'VIP Member',
    city: 'Pune',
    country: 'India',
    device: 'MacBook Air M2 (macOS Safari)',
    staySeconds: 1092, // 18m 12s
    pagesViewed: ['Readings', '1:1 Live Video Consultation', 'Guide Ethos'],
    lastAction: 'Booked 45-min Live Session with Neha',
    timestamp: '12 mins ago',
    isActive: false,
  },
  {
    id: 'vis-104',
    name: 'Seeker #4812',
    userType: 'Guest',
    city: 'Bengaluru',
    country: 'India',
    device: 'Samsung Galaxy S24 (Android Chrome)',
    staySeconds: 390, // 06m 30s
    pagesViewed: ['Consecrated Crystal Kits', 'Boutique Goods', 'Cart'],
    lastAction: 'Added Crystal Kit & Sage Bundle to Bag',
    timestamp: '25 mins ago',
    isActive: false,
  },
  {
    id: 'vis-105',
    name: 'Michael Reynolds',
    email: 'michael.r@outlook.com',
    userType: 'Logged-In',
    city: 'London',
    country: 'United Kingdom',
    device: 'iPad Pro (iPadOS Safari)',
    staySeconds: 700, // 11m 40s
    pagesViewed: ['Past Present Future Spread', 'Daily Cosmic Pulse', 'Lunar Essays'],
    lastAction: 'Read Lunar Archetype Essay',
    timestamp: '42 mins ago',
    isActive: false,
  },
  {
    id: 'vis-106',
    name: 'Seeker #7209',
    userType: 'Guest',
    city: 'New York',
    country: 'United States',
    device: 'iPhone 14 (Mobile Safari)',
    staySeconds: 255, // 04m 15s
    pagesViewed: ['One Card Quick Pull', 'Shop', 'Reviews'],
    lastAction: 'Browsing Zodiac Offerings',
    timestamp: '1 hr ago',
    isActive: false,
  },
  {
    id: 'vis-107',
    name: 'Kavita Sengupta',
    email: 'kavita.sengupta@kolkata.edu',
    userType: 'VIP Member',
    city: 'Kolkata',
    country: 'India',
    device: 'MacBook Pro (Firefox)',
    staySeconds: 1340, // 22m 20s
    pagesViewed: ['Sacred Shop', 'Intention Candles', 'Crystal Angels', 'Reviews'],
    lastAction: 'Verified Buyer Photo Review Published',
    timestamp: '2 hrs ago',
    isActive: false,
  },
];

const DEFAULT_ANALYTICS: VisitorAnalytics = {
  totalVisitorsToday: 148,
  totalVisitorsAllTime: 2942,
  activeNow: 4,
  averageStaySeconds: 432, // ~7.2 mins
  pageViews: {
    'Home & Spreads': 1240,
    'Sacred Shop': 980,
    'Zodiac Bracelets': 540,
    'Consecrated Crystals': 410,
    'Readings & Consultations': 320,
    'Reviews & Testimonials': 620,
    'Shopping Bag': 290,
  },
  visitors: INITIAL_VISITOR_LOGS,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live dwell stopwatch for current session
  const [currentStaySeconds, setCurrentStaySeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentStaySeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Visitor analytics state
  const [analytics, setAnalytics] = useState<VisitorAnalytics>(() => {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.totalVisitorsToday === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored analytics', e);
    }
    return DEFAULT_ANALYTICS;
  });

  // Save analytics when updated
  useEffect(() => {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.warn('Failed to store analytics', e);
    }
  }, [analytics]);

  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored products', e);
    }
    return PRODUCTS_DATA;
  });

  // Load reviews from localStorage or default
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored reviews', e);
    }
    return INITIAL_REVIEWS;
  });

  // Track page visit
  const trackPageVisit = (pageName: string) => {
    setAnalytics((prev) => {
      const updatedViews = { ...prev.pageViews };
      updatedViews[pageName] = (updatedViews[pageName] || 0) + 1;
      return {
        ...prev,
        totalVisitorsToday: prev.totalVisitorsToday + 1,
        totalVisitorsAllTime: prev.totalVisitorsAllTime + 1,
        pageViews: updatedViews,
      };
    });
  };

  // Simulate real-time visitor activity (for testing in Admin)
  const simulateVisitorActivity = () => {
    const randomCities = ['Chandigarh', 'Ahmedabad', 'Hyderabad', 'Chennai', 'Toronto', 'Dubai', 'Singapore'];
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    const randomDevices = ['iPhone 16 Pro (Safari)', 'OnePlus 12 (Chrome)', 'MacBook Pro (Chrome)', 'Google Pixel 9 (Chrome)'];
    const randomDevice = randomDevices[Math.floor(Math.random() * randomDevices.length)];
    const randomPages = ['Sacred Spreads', 'Zodiac Bracelets', 'Ritual Soy Candle', 'One Card Quick Pull'];
    const randomPage = randomPages[Math.floor(Math.random() * randomPages.length)];

    const newLog: VisitorSessionLog = {
      id: `vis-${Date.now()}`,
      name: `Seeker #${Math.floor(1000 + Math.random() * 9000)}`,
      userType: Math.random() > 0.5 ? 'Guest' : 'Logged-In',
      city: randomCity,
      country: randomCity === 'Toronto' ? 'Canada' : randomCity === 'Dubai' ? 'UAE' : randomCity === 'Singapore' ? 'Singapore' : 'India',
      device: randomDevice,
      staySeconds: Math.floor(60 + Math.random() * 600),
      pagesViewed: [randomPage, 'Boutique'],
      lastAction: 'Explored sacred collection & checked pricing',
      timestamp: 'Just now (Active)',
      isActive: true,
    };

    setAnalytics((prev) => ({
      ...prev,
      totalVisitorsToday: prev.totalVisitorsToday + 1,
      totalVisitorsAllTime: prev.totalVisitorsAllTime + 1,
      activeNow: Math.min(12, prev.activeNow + 1),
      visitors: [newLog, ...prev.visitors.slice(0, 19)],
    }));
  };

  const clearVisitorLogs = () => {
    setAnalytics((prev) => ({
      ...prev,
      visitors: [],
    }));
  };

  // Admin session state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Save products when changed
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      // Dispatch custom event for cross-tab / within-tab listener
      window.dispatchEvent(new Event('studio-products-sync'));
    } catch (e) {
      console.error('Failed to store products', e);
    }
  }, [products]);

  // Save reviews when changed
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      window.dispatchEvent(new Event('studio-reviews-sync'));
    } catch (e) {
      console.error('Failed to store reviews', e);
    }
  }, [reviews]);

  // Admin login / logout (Supports ID + Password or single passcode)
  const loginAdmin = (loginId: string, password?: string): boolean => {
    const cleanId = loginId.trim().toLowerCase();
    const cleanPass = (password ?? '').trim();

    // If both ID and password are provided
    if (password !== undefined) {
      const validIds = ['admin', 'neha', 'admin@opentoseeyourfuture.com', 'admin@studio.com', 'neha@admin', 'guide', 'owner'];
      const validPasswords = ['admin123', 'admin', 'open2026', 'neha@admin', 'neha123', 'future2026'];

      const isIdValid = validIds.includes(cleanId) || cleanId.startsWith('admin');
      const isPassValid = validPasswords.includes(cleanPass) || cleanPass === ADMIN_PASSCODE;

      if (isIdValid && isPassValid) {
        setIsAdmin(true);
        try {
          localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        } catch {}
        return true;
      }
      return false;
    }

    // Fallback if only passcode was passed
    if (cleanId === ADMIN_PASSCODE || cleanId === 'admin' || cleanId === 'open2026' || cleanId === 'neha@admin') {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }): Product => {
    const id = productData.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newProduct: Product = {
      ...productData,
      id,
      rating: productData.rating ?? 5.0,
      reviewsCount: productData.reviewsCount ?? 0,
      details: productData.details?.length ? productData.details : ['Hand-selected and consecrated in the studio'],
      inStock: productData.inStock !== false,
      tag: productData.tag || 'New Addition',
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS_DATA);
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {}
  };

  // Review CRUD
  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount'>): CustomerReview => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
      helpfulCount: 0,
      photos: reviewData.photos || [],
      verified: reviewData.verified ?? true,
    };

    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  const getProductReviews = (productId: string): CustomerReview[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductStats = (productId: string): { rating: number; count: number } => {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    const product = products.find((p) => p.id === productId);
    const initialCount = product?.reviewsCount || 0;
    const initialRating = product?.rating || 5.0;

    if (prodReviews.length === 0) {
      return { rating: initialRating, count: initialCount };
    }

    const totalReviews = initialCount + prodReviews.length;
    const initialScore = initialCount * initialRating;
    const addedScore = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Math.round(((initialScore + addedScore) / totalReviews) * 10) / 10;

    return {
      rating: Math.min(5, Math.max(1, avg)),
      count: totalReviews,
    };
  };

  // Dynamically compute all categories from products
  const categories = useMemo(() => {
    const defaultLabels = new Set(PRODUCT_CATEGORIES.map((c) => c.label));
    const dynamicCategories: { id: string; label: string }[] = [...PRODUCT_CATEGORIES];

    // Collect any new category names created by admin
    products.forEach((p) => {
      if (p.category && !defaultLabels.has(p.category)) {
        defaultLabels.add(p.category);
        const slug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        dynamicCategories.push({
          id: slug,
          label: p.category,
        });
      }
    });

    return dynamicCategories;
  }, [products]);

  const value = {
    products,
    categories,
    reviews,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    addReview,
    deleteReview,
    markReviewHelpful,
    getProductReviews,
    getProductStats,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    analytics,
    currentStaySeconds,
    trackPageVisit,
    simulateVisitorActivity,
    clearVisitorLogs,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

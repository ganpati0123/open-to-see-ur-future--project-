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
  recordUserSession: (user: { name?: string | null; email?: string | null }) => void;
  deleteVisitorLog: (logId: string) => void;
  simulateVisitorActivity: () => void;
  clearVisitorLogs: () => void;
}

const PRODUCTS_STORAGE_KEY = 'studio_store_products_v3';
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

const ANALYTICS_STORAGE_KEY = 'studio_store_analytics_v4';

// Real clean list: No fake / dummy members. Only real registered and logged-in visitors.
const INITIAL_VISITOR_LOGS: VisitorSessionLog[] = [];

const MOCK_MEMBER_NAMES = new Set([
  'Ananya Verma',
  'Rajesh Singhania',
  'Priya Kulkarni',
  'Seeker #4812',
  'Michael Reynolds',
  'Seeker #7209',
  'Kavita Sengupta',
]);

const DEFAULT_ANALYTICS: VisitorAnalytics = {
  totalVisitorsToday: 24,
  totalVisitorsAllTime: 180,
  activeNow: 1,
  averageStaySeconds: 320,
  pageViews: {
    'Home & Spreads': 140,
    'Sacred Shop': 120,
    'Zodiac Bracelets': 95,
    'Consecrated Crystals': 75,
    'Readings & Consultations': 50,
    'Reviews & Testimonials': 65,
    'Shopping Bag': 40,
  },
  visitors: INITIAL_VISITOR_LOGS,
};

const sanitizeVisitors = (list: any[]): VisitorSessionLog[] => {
  if (!Array.isArray(list)) return [];
  return list.filter((vis) => {
    if (!vis || typeof vis !== 'object') return false;
    if (vis.id && String(vis.id).startsWith('vis-10')) return false;
    if (vis.name && MOCK_MEMBER_NAMES.has(vis.name)) return false;
    return true;
  });
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
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY) || localStorage.getItem('studio_store_analytics_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.totalVisitorsToday === 'number') {
          return {
            ...parsed,
            visitors: sanitizeVisitors(parsed.visitors),
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored analytics', e);
    }
    return DEFAULT_ANALYTICS;
  });

  const recordUserSession = (user: { name?: string | null; email?: string | null }) => {
    if (!user || (!user.email && !user.name)) return;
    const email = user.email ? user.email.trim() : undefined;
    const displayName = user.name?.trim() || (email ? email.split('@')[0] : 'Logged-In Seeker');

    setAnalytics((prev) => {
      const cleanVisitors = sanitizeVisitors(prev.visitors);
      const existing = cleanVisitors.find(
        (v) => v.email && email && v.email.toLowerCase() === email.toLowerCase()
      );

      if (existing) {
        return {
          ...prev,
          visitors: cleanVisitors.map((v) =>
            v.id === existing.id
              ? {
                  ...v,
                  isActive: true,
                  staySeconds: v.staySeconds + 15,
                  timestamp: 'Active right now',
                  lastAction: 'Active on storefront session',
                }
              : v
          ),
        };
      }

      const newLog: VisitorSessionLog = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: displayName,
        email,
        userType: 'Logged-In',
        city: 'Verified Location',
        country: 'India',
        device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser') : 'Web Browser',
        staySeconds: 40,
        pagesViewed: ['Storefront', 'Dashboard'],
        lastAction: 'Signed in & explored boutique',
        timestamp: 'Active right now',
        isActive: true,
      };

      return {
        ...prev,
        totalVisitorsToday: prev.totalVisitorsToday + 1,
        totalVisitorsAllTime: prev.totalVisitorsAllTime + 1,
        activeNow: Math.max(1, prev.activeNow + 1),
        visitors: [newLog, ...cleanVisitors],
      };
    });
  };

  const deleteVisitorLog = (logId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      visitors: prev.visitors.filter((v) => v.id !== logId),
    }));
  };

  // Save analytics when updated
  useEffect(() => {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (e) {
      console.warn('Failed to store analytics', e);
    }
  }, [analytics]);

  // Load products from localStorage or default, ensuring latest zodiac bracelets and images are synced
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY) || localStorage.getItem('studio_store_products_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, Product>();
          parsed.forEach((p: Product) => {
            if (p && p.id) map.set(p.id, p);
          });
          // Ensure all updated zodiac bracelets and defaults are injected or upgraded
          PRODUCTS_DATA.forEach((def) => {
            const existing = map.get(def.id);
            if (!existing) {
              map.set(def.id, def);
            } else if (def.id.startsWith('bracelet-')) {
              // Update with clean image and description without selenite plate
              map.set(def.id, {
                ...existing,
                name: def.name,
                image: def.image,
                description: def.description,
                details: def.details,
              });
            }
          });
          return Array.from(map.values());
        }
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

  // Real-time cross-tab synchronization so admin changes reflect immediately everywhere
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PRODUCTS_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      }
      if (event.key === REVIEWS_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) setReviews(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
    recordUserSession,
    deleteVisitorLog,
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

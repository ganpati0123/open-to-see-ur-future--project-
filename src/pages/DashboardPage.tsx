import { useMemo, useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Archive,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATEGORIES, Product } from '../data/productsData';
import { formatCurrency } from '../utils/money';
import { useStore } from '../context/StoreContext';

interface DashboardPageProps {
  products?: Product[];
  onProductsChange?: (products: Product[]) => void;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  price: 1200,
  currency: 'INR',
  category: 'Zodiac Bracelets',
  tag: 'New Consecration',
  rating: 5,
  reviewsCount: 0,
  description: '',
  details: ['Handcrafted natural crystal beads', 'Smooth polished finish', 'Sacred studio consecration'],
  image: '/products/zodiac-bracelets/taurus-zodiac-bracelet.jpeg',
  inStock: true,
};

const IMAGE_PRESETS = [
  { label: 'Taurus Bracelet', path: '/products/zodiac-bracelets/taurus-zodiac-bracelet.jpeg' },
  { label: 'Pisces Bracelet', path: '/products/zodiac-bracelets/pisces-zodiac-bracelet.jpeg' },
  { label: 'Libra Bracelet', path: '/products/zodiac-bracelets/libra-zodiac-bracelet.jpeg' },
  { label: 'Cancer Bracelet', path: '/products/zodiac-bracelets/cancer-zodiac-bracelet.jpeg' },
  { label: 'Aquarius Bracelet', path: '/products/zodiac-bracelets/aquarius-zodiac-bracelet.jpeg' },
  { label: 'Scorpio Bracelet', path: '/products/zodiac-bracelets/scorpio-zodiac-bracelet.jpeg' },
  { label: 'Aries Bracelet', path: '/products/bracelet-aries.png' },
  { label: 'Selenite Tower', path: '/products/selenite-towers.png' },
  { label: 'Chakra Tree', path: '/products/seven-chakra-gemstone-tree.png' },
  { label: 'Amethyst Ganesha', path: '/products/amethyst-ganesha.png' },
  { label: 'Ritual Candle', path: '/images/boutique_ritual_candle_1790673095609.jpg' },
];

export const DashboardPage = ({ products: propProducts, onProductsChange }: DashboardPageProps = {}) => {
  const store = useStore();
  const products = propProducts ?? store.products;
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeView, setActiveView] = useState<'overview' | 'products'>('overview');
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [notice, setNotice] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category} ${product.tag || ''}`.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const averageRating = products.length
    ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
    : '0.0';

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyProduct);
    setUploadError('');
    setEditorOpen(true);
    setNotice('');
  };

  const openEdit = (product: Product) => {
    const { id, ...rest } = product;
    setEditingId(id);
    setDraft({
      ...rest,
      currency: rest.currency || 'INR',
      details: rest.details?.length ? rest.details : ['Hand-selected authentic piece'],
    });
    setUploadError('');
    setEditorOpen(true);
    setNotice('');
  };

  // Compress and handle image file upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      setUploadError('Image size exceeds 12MB. Please select a smaller photo.');
      return;
    }

    setUploadError('');
    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setIsCompressing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 960;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setDraft((prev) => ({ ...prev, image: compressed }));
        } else {
          setDraft((prev) => ({ ...prev, image: dataUrl }));
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setUploadError('Unable to process the image file.');
        setIsCompressing(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized: Omit<Product, 'id'> = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      details: draft.details.filter(Boolean),
      image: draft.image || '/products/selenite-towers.png',
      currency: draft.currency || 'INR',
      tag: draft.tag?.trim() || 'Featured',
    };

    if (!normalized.name || normalized.price <= 0) return;

    if (editingId) {
      if (onProductsChange) {
        onProductsChange(products.map((product) => (product.id === editingId ? { ...normalized, id: editingId } : product)));
      } else {
        store.updateProduct(editingId, normalized);
      }
    } else {
      const newId = `${normalized.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
      if (onProductsChange) {
        onProductsChange([{ ...normalized, id: newId }, ...products]);
      } else {
        store.addProduct({ ...normalized, id: newId });
      }
    }

    setEditorOpen(false);
    setNotice(editingId ? `“${normalized.name}” updated and LIVE on the storefront!` : `“${normalized.name}” added and LIVE on the storefront!`);
  };

  const removeProduct = (id: string, name: string) => {
    if (window.confirm(`Remove “${name}” from the live storefront? This will reflect for all visitors immediately.`)) {
      if (onProductsChange) {
        onProductsChange(products.filter((product) => product.id !== id));
      } else {
        store.deleteProduct(id);
      }
      setNotice(`“${name}” removed from the live shop.`);
    }
  };

  // Export catalog as JSON file for git commits / backup
  const handleExportCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalog-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotice('Catalog JSON exported successfully.');
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#080914] text-[#f5f0e7]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0b0c1c] px-5 py-7 lg:flex lg:flex-col">
        <button onClick={() => navigate('/')} className="text-left cursor-pointer">
          <span className="text-[10px] uppercase tracking-[.28em] text-[#e6b967]">Open to see</span>
          <span className="mt-1 block font-serif text-2xl">your future</span>
        </button>
        <div className="mt-12 flex flex-col gap-2 text-sm">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors cursor-pointer ${
              activeView === 'overview' ? 'bg-[#e6b967] text-[#080914] font-semibold' : 'text-[#a8a9bf] hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          <button
            onClick={() => setActiveView('products')}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors cursor-pointer ${
              activeView === 'products' ? 'bg-[#e6b967] text-[#080914] font-semibold' : 'text-[#a8a9bf] hover:bg-white/5'
            }`}
          >
            <Package className="h-4 w-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[#a8a9bf] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="h-4 w-4" /> View storefront
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[#e6b967]/80 hover:bg-[#e6b967]/10 hover:text-[#e6b967] transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4" /> Master Admin Suite
          </button>
        </div>
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-[#a8a9bf] hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-[#e6b967]">Studio control room</p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
              Good evening{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[#27745b]/40 bg-[#27745b]/10 px-3 py-1.5 text-xs text-[#25D366] sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
              Live Sync Active
            </span>
            <span className="hidden rounded-full border border-[#e6b967]/30 px-3 py-2 text-xs text-[#a8a9bf] sm:inline-flex">
              <ShieldCheck className="mr-2 h-4 w-4 text-[#e6b967]" /> Admin access
            </span>
            <button
              onClick={logout}
              aria-label="Sign out"
              className="rounded-full border border-white/10 p-2 text-[#a8a9bf] hover:text-white cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="px-5 py-8 sm:px-10 sm:py-10">
          {notice && (
            <div role="status" className="mb-6 flex items-center justify-between rounded-xl border border-[#27745b]/50 bg-[#27745b]/15 px-4 py-3 text-sm text-[#c8e0bf]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" /> {notice}
              </span>
              <button onClick={() => setNotice('')} className="text-xs text-[#a8a9bf] hover:text-white">✕</button>
            </div>
          )}

          {activeView === 'overview' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Live products" value={products.length.toString()} icon={<Package />} />
                <Metric label="Average rating" value={averageRating} icon={<Star />} />
                <Metric label="In stock" value={products.filter((p) => p.inStock).length.toString()} icon={<Archive />} />
                <Metric label="Live broadcast" value="Active" icon={<ShieldCheck />} />
              </div>

              <section className="mt-8 rounded-2xl border border-white/10 bg-[#111326] p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">Quick management</p>
                    <h2 className="mt-2 font-serif text-3xl">Your catalog, in real-time control.</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#a8a9bf]">
                      Add products, upload images directly from device, update pricing, and manage inventory. Every edit broadcasts live to visitors.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportCatalog}
                      title="Download JSON of all live products"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e6b967]/30 bg-white/5 px-3 py-3 text-xs uppercase tracking-wider text-[#e6b967] hover:bg-white/10 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Export JSON
                    </button>
                    <button
                      onClick={openCreate}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#e6b967] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#080914] hover:bg-[#f2cc84] cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add product
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => setActiveView('products')}
                    className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-left hover:border-[#e6b967]/40 transition-colors cursor-pointer"
                  >
                    <Package className="h-5 w-5 text-[#e6b967]" />
                    <strong className="mt-3 block text-sm">Manage products ({products.length})</strong>
                    <span className="mt-1 block text-xs text-[#a8a9bf]">Edit pricing, upload images, stock status</span>
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-left hover:border-[#e6b967]/40 transition-colors cursor-pointer"
                  >
                    <Eye className="h-5 w-5 text-[#e6b967]" />
                    <strong className="mt-3 block text-sm">Preview storefront</strong>
                    <span className="mt-1 block text-xs text-[#a8a9bf]">See the customer view with live changes</span>
                  </button>
                  <button
                    onClick={() => navigate('/admin')}
                    className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-left hover:border-[#e6b967]/40 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-5 w-5 text-[#e6b967]" />
                    <strong className="mt-3 block text-sm">Visitor Analytics & Reviews</strong>
                    <span className="mt-1 block text-xs text-[#a8a9bf]">Track stay duration & moderate reviews</span>
                  </button>
                </div>
              </section>
            </>
          ) : (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">Catalog</p>
                  <h2 className="mt-2 font-serif text-4xl">Products ({filteredProducts.length})</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCatalog}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs uppercase tracking-wider text-[#a8a9bf] hover:text-white cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Export
                  </button>
                  <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#e6b967] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#080914] hover:bg-[#f2cc84] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add product
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111326] px-4">
                <Search className="h-4 w-4 text-[#a8a9bf]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products by name, category, or zodiac sign..."
                  className="min-h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6d7188]"
                />
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#111326]">
                <div className="hidden grid-cols-[1.6fr_1fr_.7fr_.7fr_110px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-wider text-[#6d7188] md:grid">
                  <span>Product</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Status</span>
                  <span />
                </div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1.6fr_1fr_.7fr_.7fr_110px] md:items-center md:gap-4 hover:bg-white/[.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-14 rounded-lg bg-white/5 object-cover border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/products/selenite-towers.png';
                        }}
                      />
                      <div>
                        <strong className="block text-sm text-[#f5f0e7]">{product.name}</strong>
                        <span className="text-xs text-[#a8a9bf]">
                          {product.tag ? `${product.tag} · ` : ''}
                          {product.rating > 0 ? `${product.rating} ★ (${product.reviewsCount})` : 'New arrival'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#a8a9bf]">{product.category}</span>
                    <span className="font-mono text-sm font-semibold text-[#e6b967]">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                    <span className={`text-xs font-semibold ${product.inStock ? 'text-[#b8d3ad]' : 'text-[#e39b8f]'}`}>
                      {product.inStock ? '● Live in shop' : '○ Out of stock'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        aria-label={`Edit ${product.name}`}
                        className="rounded-lg border border-white/10 p-2 text-[#a8a9bf] hover:text-white hover:border-[#e6b967]/50 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id, product.name)}
                        aria-label={`Remove ${product.name}`}
                        className="rounded-lg border border-white/10 p-2 text-[#a8a9bf] hover:text-[#e39b8f] hover:border-[#e39b8f]/50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Product Add / Edit Modal with Device Image Upload */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-6 backdrop-blur-sm animate-in fade-in">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#111326] p-5 sm:rounded-2xl sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">
                  {editingId ? 'Edit listing' : 'New listing'}
                </p>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl">
                  {editingId ? 'Refine product' : 'Add to the collection'}
                </h2>
              </div>
              <button
                onClick={() => setEditorOpen(false)}
                aria-label="Close editor"
                className="rounded-full border border-white/10 p-2 text-[#a8a9bf] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Product name"
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
                placeholder="e.g. Pisces Zodiac Bracelet"
                required
              />

              {/* Price & Currency */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Field
                    label="Price"
                    type="number"
                    value={String(draft.price || '')}
                    onChange={(value) => setDraft({ ...draft, price: Number(value) })}
                    required
                  />
                </div>
                <label className="flex w-28 flex-col gap-2 text-xs text-[#a8a9bf]">
                  Currency
                  <select
                    value={draft.currency || 'INR'}
                    onChange={(event) => setDraft({ ...draft, currency: event.target.value as 'INR' | 'USD' })}
                    className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none focus:border-[#e6b967]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </label>
              </div>

              {/* Category */}
              <label className="flex flex-col gap-2 text-xs text-[#a8a9bf]">
                Category
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value as Product['category'] })}
                  className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none focus:border-[#e6b967]"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.label} value={category.label}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Tag / Badge"
                value={draft.tag}
                onChange={(value) => setDraft({ ...draft, tag: value })}
                placeholder="e.g. Pisces, Best Seller, New Consecration"
              />

              {/* ========================================================= */}
              {/* ADVANCED PRODUCT IMAGE UPLOAD (FILE PICKER + URL + PRESETS) */}
              {/* ========================================================= */}
              <div className="sm:col-span-2 rounded-xl border border-white/10 bg-[#0b0c1c] p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#e6b967] flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" /> Product Image & Upload
                  </label>
                  {isCompressing && (
                    <span className="text-[10px] text-[#e6b967] flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Optimizing image...
                    </span>
                  )}
                </div>

                {uploadError && (
                  <p className="mt-2 text-xs text-[#e39b8f]">{uploadError}</p>
                )}

                {/* Upload Buttons */}
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="dashboard-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#e6b967] bg-[#e6b967]/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#e6b967] hover:bg-[#e6b967]/20 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload from Phone / Computer</span>
                  </button>
                </div>

                {/* Direct Image URL input */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={draft.image}
                    onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                    placeholder="Or paste image URL (e.g. /products/zodiac-bracelets/... or https://...)"
                    className="min-h-10 w-full rounded-lg border border-white/10 bg-[#111326] px-3 text-xs text-white outline-none focus:border-[#e6b967] placeholder:text-[#6d7188]"
                  />
                </div>

                {/* Quick Presets for Zodiac Bracelets & Sacred Items */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a9bf]">Quick studio presets:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setDraft({ ...draft, image: preset.path })}
                        className={`rounded border px-2 py-1 text-[10px] transition-all cursor-pointer ${
                          draft.image === preset.path
                            ? 'border-[#e6b967] bg-[#e6b967]/20 text-[#e6b967] font-semibold'
                            : 'border-white/10 bg-white/5 text-[#a8a9bf] hover:text-white hover:border-white/20'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Thumbnail Preview */}
                {draft.image && (
                  <div className="mt-3.5 flex items-center gap-3 rounded-lg border border-white/10 bg-[#111326] p-2.5">
                    <img
                      src={draft.image}
                      alt="Product preview"
                      className="size-16 rounded-md object-cover border border-[#e6b967]/40 bg-black/40"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-[#e6b967] flex items-center gap-1">
                        <Check className="h-3 w-3" /> Image Ready & Synced
                      </span>
                      <p className="truncate text-[10px] text-[#a8a9bf] font-mono mt-0.5">{draft.image.slice(0, 50)}...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability */}
              <label className="sm:col-span-2 flex flex-col gap-2 text-xs text-[#a8a9bf]">
                Availability
                <select
                  value={draft.inStock ? 'live' : 'hidden'}
                  onChange={(event) => setDraft({ ...draft, inStock: event.target.value === 'live' })}
                  className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none focus:border-[#e6b967]"
                >
                  <option value="live">Live in shop (Visible to all customers)</option>
                  <option value="hidden">Hidden / Out of stock</option>
                </select>
              </label>

              {/* Description */}
              <label className="sm:col-span-2 flex flex-col gap-2 text-xs text-[#a8a9bf]">
                Description *
                <textarea
                  required
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="Detail the spiritual properties, crystals, and qualities of this product..."
                  rows={4}
                  className="rounded-lg border border-white/10 bg-[#0b0c1c] p-3 text-sm text-white outline-none focus:border-[#e6b967]"
                />
              </label>

              <button
                type="submit"
                className="sm:col-span-2 mt-2 min-h-12 rounded-lg bg-[#e6b967] text-xs font-semibold uppercase tracking-wider text-[#080914] hover:bg-[#f2cc84] transition-colors cursor-pointer"
              >
                {editingId ? 'Save Changes & Update Live Shop' : 'Publish Product to Live Shop'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-[#111326] p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#a8a9bf]">{label}</span>
      <span className="text-[#e6b967]">{icon}</span>
    </div>
    <strong className="mt-4 block font-serif text-3xl">{value}</strong>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-2 text-xs text-[#a8a9bf]">
    {label}
    <input
      required={required}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none focus:border-[#e6b967] placeholder:text-[#6d7188]"
    />
  </label>
);


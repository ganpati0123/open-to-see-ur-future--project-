import { useMemo, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Archive, Eye, LayoutDashboard, LogOut, Package, Pencil, Plus, Search, ShieldCheck, Star, Trash2, X } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATEGORIES, Product } from '../data/productsData';
import { formatCurrency } from '../utils/money';

interface DashboardPageProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '', price: 0, currency: 'INR', category: 'Ritual Goods', tag: 'New arrival', rating: 0, reviewsCount: 0,
  description: '', details: [], image: '/products/selenite-towers.png', inStock: true,
};

export const DashboardPage = ({ products, onProductsChange }: DashboardPageProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'products'>('overview');
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyProduct);
  const [notice, setNotice] = useState('');

  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const averageRating = products.length ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1) : '0.0';

  const openCreate = () => { setEditingId(null); setDraft(emptyProduct); setEditorOpen(true); setNotice(''); };
  const openEdit = (product: Product) => { const { id, ...rest } = product; setEditingId(id); setDraft(rest); setEditorOpen(true); setNotice(''); };
  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = { ...draft, name: draft.name.trim(), description: draft.description.trim(), details: draft.details.filter(Boolean) };
    if (!normalized.name || normalized.price <= 0) return;
    if (editingId) onProductsChange(products.map((product) => product.id === editingId ? { ...normalized, id: editingId } : product));
    else onProductsChange([{ ...normalized, id: `${normalized.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}` }, ...products]);
    setEditorOpen(false); setNotice(editingId ? 'Product updated and live in the shop.' : 'Product added and live in the shop.');
  };
  const removeProduct = (id: string) => { if (window.confirm('Remove this product from the live shop?')) { onProductsChange(products.filter((product) => product.id !== id)); setNotice('Product removed from the live shop.'); } };
  const logout = async () => { await signOut(auth); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-[#080914] text-[#f5f0e7]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0b0c1c] px-5 py-7 lg:flex lg:flex-col">
        <button onClick={() => navigate('/')} className="text-left"><span className="text-[10px] uppercase tracking-[.28em] text-[#e6b967]">Open to see</span><span className="mt-1 block font-serif text-2xl">your future</span></button>
        <div className="mt-12 flex flex-col gap-2 text-sm">
          <button onClick={() => setActiveView('overview')} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left ${activeView === 'overview' ? 'bg-[#e6b967] text-[#080914]' : 'text-[#a8a9bf] hover:bg-white/5'}`}><LayoutDashboard data-icon="inline-start" /> Overview</button>
          <button onClick={() => setActiveView('products')} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left ${activeView === 'products' ? 'bg-[#e6b967] text-[#080914]' : 'text-[#a8a9bf] hover:bg-white/5'}`}><Package data-icon="inline-start" /> Products</button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[#a8a9bf] hover:bg-white/5"><Eye data-icon="inline-start" /> View storefront</button>
        </div>
        <button onClick={logout} className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-[#a8a9bf] hover:text-white"><LogOut data-icon="inline-start" /> Sign out</button>
      </aside>
      <main className="lg:ml-64">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10"><div><p className="text-[10px] uppercase tracking-[.25em] text-[#e6b967]">Studio control room</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Good evening{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}.</h1></div><div className="flex items-center gap-3"><span className="hidden rounded-full border border-[#e6b967]/30 px-3 py-2 text-xs text-[#a8a9bf] sm:inline-flex"><ShieldCheck className="mr-2 h-4 w-4 text-[#e6b967]" /> Admin access</span><button onClick={logout} aria-label="Sign out" className="rounded-full border border-white/10 p-2 text-[#a8a9bf] hover:text-white"><LogOut className="h-4 w-4" /></button></div></header>
        <div className="px-5 py-8 sm:px-10 sm:py-10">
          {notice && <div role="status" className="mb-6 rounded-xl border border-[#6c8066]/40 bg-[#6c8066]/10 px-4 py-3 text-sm text-[#c8e0bf]">{notice}</div>}
          {activeView === 'overview' ? <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Live products" value={products.length.toString()} icon={<Package />} /><Metric label="Average rating" value={averageRating} icon={<Star />} /><Metric label="In stock" value={products.filter((product) => product.inStock).length.toString()} icon={<Archive />} /><Metric label="Catalog status" value="Live" icon={<ShieldCheck />} /></div>
            <section className="mt-8 rounded-2xl border border-white/10 bg-[#111326] p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">Quick management</p><h2 className="mt-2 font-serif text-3xl">Your catalog, in control.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#a8a9bf]">Add, edit, remove, and update stock status. Changes are reflected immediately in the storefront preview.</p></div><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#e6b967] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#080914] hover:bg-[#f2cc84]"><Plus className="h-4 w-4" /> Add product</button></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><button onClick={() => setActiveView('products')} className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-left hover:border-[#e6b967]/40"><Package className="h-5 w-5 text-[#e6b967]" /><strong className="mt-3 block text-sm">Manage products</strong><span className="mt-1 block text-xs text-[#a8a9bf]">Edit pricing, imagery, stock</span></button><button onClick={() => navigate('/')} className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-left hover:border-[#e6b967]/40"><Eye className="h-5 w-5 text-[#e6b967]" /><strong className="mt-3 block text-sm">Preview storefront</strong><span className="mt-1 block text-xs text-[#a8a9bf]">See the live customer experience</span></button><div className="rounded-xl border border-white/10 bg-white/[.03] p-4"><Star className="h-5 w-5 text-[#e6b967]" /><strong className="mt-3 block text-sm">Reviews ready</strong><span className="mt-1 block text-xs text-[#a8a9bf]">Moderate from product pages</span></div></div></section>
          </> : <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">Catalog</p><h2 className="mt-2 font-serif text-4xl">Products</h2></div><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#e6b967] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#080914]"><Plus className="h-4 w-4" /> Add product</button></div><div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111326] px-4"><Search className="h-4 w-4 text-[#a8a9bf]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or categories" className="min-h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6d7188]" /></div><div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#111326]"><div className="hidden grid-cols-[1.6fr_1fr_.7fr_.7fr_110px] gap-4 border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-wider text-[#6d7188] md:grid"><span>Product</span><span>Category</span><span>Price</span><span>Status</span><span /></div>{filteredProducts.map((product) => <div key={product.id} className="grid gap-3 border-b border-white/10 px-5 py-4 md:grid-cols-[1.6fr_1fr_.7fr_.7fr_110px] md:items-center md:gap-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="size-12 rounded-lg bg-white/5 object-cover" /><div><strong className="block text-sm">{product.name}</strong><span className="text-xs text-[#a8a9bf]">{product.rating > 0 ? `${product.rating} rating · ${product.reviewsCount} reviews` : 'No reviews yet'}</span></div></div><span className="text-xs text-[#a8a9bf]">{product.category}</span><span className="font-mono text-sm">{formatCurrency(product.price, product.currency)}</span><span className={`text-xs ${product.inStock ? 'text-[#b8d3ad]' : 'text-[#e39b8f]'}`}>{product.inStock ? 'Live' : 'Hidden'}</span><div className="flex gap-2"><button onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`} className="rounded-lg border border-white/10 p-2 text-[#a8a9bf] hover:text-white"><Pencil className="h-4 w-4" /></button><button onClick={() => removeProduct(product.id)} aria-label={`Remove ${product.name}`} className="rounded-lg border border-white/10 p-2 text-[#a8a9bf] hover:text-[#e39b8f]"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>}
        </div>
      </main>
      {editorOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#111326] p-5 sm:rounded-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.24em] text-[#e6b967]">{editingId ? 'Edit listing' : 'New listing'}</p><h2 className="mt-2 font-serif text-3xl">{editingId ? 'Refine product' : 'Add to the collection'}</h2></div><button onClick={() => setEditorOpen(false)} aria-label="Close editor" className="rounded-full border border-white/10 p-2 text-[#a8a9bf]"><X className="h-4 w-4" /></button></div><form onSubmit={saveProduct} className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Product name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} required /><Field label="Price" type="number" value={String(draft.price || '')} onChange={(value) => setDraft({ ...draft, price: Number(value) })} required /><label className="flex flex-col gap-2 text-xs text-[#a8a9bf]">Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Product['category'] })} className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none">{PRODUCT_CATEGORIES.map((category) => <option key={category.label} value={category.label}>{category.label}</option>)}</select></label><Field label="Tag" value={draft.tag} onChange={(value) => setDraft({ ...draft, tag: value })} /><Field label="Image URL" value={draft.image} onChange={(value) => setDraft({ ...draft, image: value })} /><label className="flex flex-col gap-2 text-xs text-[#a8a9bf]">Availability<select value={draft.inStock ? 'live' : 'hidden'} onChange={(event) => setDraft({ ...draft, inStock: event.target.value === 'live' })} className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none"><option value="live">Live in shop</option><option value="hidden">Hidden / out of stock</option></select></label><label className="sm:col-span-2 flex flex-col gap-2 text-xs text-[#a8a9bf]">Description<textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} className="rounded-lg border border-white/10 bg-[#0b0c1c] p-3 text-sm text-white outline-none" /></label><button className="sm:col-span-2 mt-2 min-h-12 rounded-lg bg-[#e6b967] text-xs font-semibold uppercase tracking-wider text-[#080914] hover:bg-[#f2cc84]">{editingId ? 'Save changes' : 'Publish product'}</button></form></div></div>}
    </div>
  );
};

const Metric = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => <div className="rounded-2xl border border-white/10 bg-[#111326] p-5"><div className="flex items-center justify-between"><span className="text-xs text-[#a8a9bf]">{label}</span><span className="text-[#e6b967]">{icon}</span></div><strong className="mt-4 block font-serif text-3xl">{value}</strong></div>;
const Field = ({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) => <label className="flex flex-col gap-2 text-xs text-[#a8a9bf]">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border border-white/10 bg-[#0b0c1c] px-3 text-sm text-white outline-none focus:border-[#e6b967]" /></label>;

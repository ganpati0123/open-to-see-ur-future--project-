import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Eye, MessageCircle, ShoppingBag, Star, X } from 'lucide-react';
import { Product } from '../data/productsData';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/money';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { playChimeSound } from '../utils/audio';

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
  onOpenProduct: (productId: string) => void;
  categoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  onAddToCart,
  onOpenProduct,
  categoryId = null,
  onSelectCategory,
}) => {
  const { products, categories, getProductStats } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const categoryProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory.label)
    : products;
  const categoriesWithProducts = categories
    .map((category) => ({
      ...category,
      products: products.filter((product) => product.category === category.label),
    }))
    .filter((category) => category.products.length > 0);

  useEffect(() => {
    if (!quickViewProduct) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQuickViewProduct(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [quickViewProduct]);

  const handleAdd = (product: Product) => {
    playChimeSound();
    onAddToCart(product);
    setAddedIds((previous) => new Set(previous).add(product.id));
    window.setTimeout(() => {
      setAddedIds((previous) => {
        const next = new Set(previous);
        next.delete(product.id);
        return next;
      });
    }, 1400);
  };

  const title = selectedCategory?.label ?? 'The Studio Boutique';

  return (
    <section id="shop" className="shop-shell scroll-mt-20">
      <div className="shop-intro">
        <div className="shop-intro-inner mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20">
          {selectedCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b9a58a]/60 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#625b50] shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-[#28251f] cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to all collections</span>
            </button>
          )}
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="shop-kicker mb-5 flex items-center gap-3">
                <span>Open to see your future</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#b69570]" />
                <span>{selectedCategory ? 'The collection' : 'Objects for your practice'}</span>
              </div>
              <h1 className="shop-title">
                {selectedCategory ? (
                  <>{selectedCategory.label}</>
                ) : (
                  <>Find a little <em>meaning</em> in the everyday.</>
                )}
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#5f594f] sm:text-base">
                {selectedCategory
                  ? `A considered selection of ${selectedCategory.label.toLowerCase()}, chosen to bring a thoughtful pause to your space and practice.`
                  : 'Intuitive readings, considered crystals, and small ritual objects chosen to make room for clarity, steadiness, and wonder.'}
              </p>
            </div>
            <div className="hidden border-l border-[#b9a58a]/50 pl-6 pb-1 lg:block">
              <span className="shop-kicker">A note from the studio</span>
              <p className="mt-3 font-serif text-2xl leading-tight text-[#494239]">
                “Keep close what helps you listen.”
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[.18em] text-[#817766]">Neha Arora · Curator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        {!selectedCategory && (
          <div className="mb-16 sm:mb-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="shop-kicker">Browse by feeling</span>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Explore the collections</h2>
              </div>
              <span className="text-xs text-[#777064]">{categoriesWithProducts.length} collections</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {categoriesWithProducts.map((category) => {
                const firstProduct = category.products[0];
                return (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className="shop-category-tile group cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8d6d4e]"
                    aria-label={`Browse ${category.label}`}
                  >
                    <div className="absolute inset-0 bg-[#ddd4c5]" aria-hidden="true">
                      <span className="absolute inset-0 flex items-center justify-center px-3 text-center font-serif text-xl text-[#8d7355]/70">
                        {category.label}
                      </span>
                      <img
                        src={firstProduct.image}
                        alt=""
                        loading="lazy"
                        className="shop-category-image absolute inset-0 h-full w-full object-cover"
                        onError={(event) => { event.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-[#fffaf1] sm:p-4">
                      <span className="mb-1 block text-[9px] uppercase tracking-[.18em] text-white/75">
                        {category.products.length} {category.products.length === 1 ? 'piece' : 'pieces'}
                      </span>
                      <span className="flex items-end justify-between gap-2 font-serif text-lg leading-tight sm:text-xl">
                        <span>{category.label}</span>
                        <ChevronRight className="mb-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#ded5c8] pb-5">
          <div>
            <span className="shop-kicker">{selectedCategory ? 'Selected for you' : 'From the studio'}</span>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl">{selectedCategory ? title : 'Shop all'}</h2>
          </div>
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className="text-xs uppercase tracking-[.13em] text-[#777064] underline decoration-[#b69570] underline-offset-4 transition-colors hover:text-[#28251f]"
              >
                All collections
              </button>
            )}
            <span className="text-xs tabular-nums text-[#777064]">{categoryProducts.length} items</span>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => {
              const isRecentlyAdded = addedIds.has(product.id);
              const stats = getProductStats(product.id);
              const displayRating = stats.count > 0 ? stats.rating : product.rating;
              const displayCount = stats.count > 0 ? stats.count : product.reviewsCount;

              return (
                <article key={product.id} className="shop-product-card group flex min-w-0 flex-col">
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-[#e7dfd2]">
                    <div className="absolute inset-0 flex items-center justify-center p-5 text-center font-serif text-xl text-[#8d7355]/70" aria-hidden="true">
                      {product.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenProduct(product.id)}
                      aria-label={`Open details and customer reviews for ${product.name}`}
                      className="absolute inset-0 z-10 w-full text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#8d6d4e]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="shop-product-image relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        onError={(event) => { event.currentTarget.style.display = 'none'; }}
                      />
                    </button>
                    <span className="absolute left-3 top-3 z-20 border border-white/60 bg-[#fbf8f1]/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[.14em] text-[#494239] backdrop-blur-sm">
                      {product.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-[#fbf8f1]/95 text-[#28251f] opacity-100 shadow-sm transition hover:bg-[#28251f] hover:text-[#fbf8f1] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 cursor-pointer"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-2 flex min-h-4 items-center justify-between gap-3">
                      <span className="text-[9px] uppercase tracking-[.15em] text-[#8a806f]">{product.category}</span>
                      {displayCount > 0 && (
                        <button
                          type="button"
                          onClick={() => onOpenProduct(product.id)}
                          className="flex shrink-0 items-center gap-1 text-[10px] text-[#6e665a] hover:text-[#bd8e48] cursor-pointer"
                          aria-label={`${displayRating} out of 5, ${displayCount} reviews`}
                        >
                          <Star className="h-3 w-3 fill-[#b69570] text-[#b69570]" />
                          <span>{displayRating}</span>
                          <span className="text-[#999080]">({displayCount})</span>
                        </button>
                      )}
                    </div>
                    <h3 className="font-serif text-[1.55rem] leading-[1.06] text-[#28251f] transition-colors group-hover:text-[#8d6d4e]">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product.id)}
                        className="text-left font-serif transition-colors hover:text-[#8d6d4e] cursor-pointer"
                      >
                        {product.name}
                      </button>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-[#746d61]">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product.id)}
                        className="text-[#8d6d4e] hover:underline uppercase text-[9px] tracking-wider font-medium"
                      >
                        View Details & Reviews →
                      </button>
                    </div>
                    <div className="mt-5 border-t border-[#ded5c8]/80 pt-4">
                      <span className="font-mono text-sm tabular-nums text-[#28251f]">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          disabled={!product.inStock}
                          className={`inline-flex min-h-10 items-center justify-center gap-1.5 px-2 text-[9px] font-medium uppercase tracking-[.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            isRecentlyAdded
                              ? 'bg-[#65705b] text-[#fffaf1]'
                              : 'bg-[#302d27] text-[#f7f1e7] hover:bg-[#8d6d4e]'
                          }`}
                        >
                          {isRecentlyAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                          <span>{isRecentlyAdded ? 'Added' : product.inStock ? 'Add to bag' : 'Sold out'}</span>
                        </button>
                        <a
                          href={getProductWhatsAppUrl(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${product.name} on WhatsApp`}
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 bg-[#27745b] px-2 text-[9px] font-medium uppercase tracking-[.08em] text-white transition-colors hover:bg-[#1f604b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27745b]"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-[#cfc4b4] bg-[#fbf8f1]/60 px-6 py-16 text-center">
            <p className="font-serif text-3xl">A quiet shelf, for now.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777064]">
              There are no pieces in this collection at the moment.
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="mt-6 border-b border-[#987858] pb-1 text-xs uppercase tracking-[.15em] text-[#6e5942] cursor-pointer"
            >
              Return to all collections
            </button>
          </div>
        )}

        {selectedCategory && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="inline-flex items-center gap-2 rounded-sm bg-[#302d27] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f7f1e7] transition-colors hover:bg-[#8d6d4e] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Collections</span>
            </button>
          </div>
        )}

        <div className="mt-16 border-t border-[#ded5c8] pt-7 text-center sm:mt-20">
          <p className="font-serif text-2xl text-[#514a3f]">Selected with care. Sent with intention.</p>
          <p className="mt-2 text-xs text-[#827969]">Thoughtful objects for a practice that is entirely your own.</p>
        </div>
      </div>

      {quickViewProduct && (
        <div
          className="shop-quick-view-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-[#211f1b]/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setQuickViewProduct(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            className="shop-quick-view-panel relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto border border-[#c7b79f] bg-[#f7f2e9] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f2e9]/90 text-[#28251f] transition hover:bg-[#28251f] hover:text-white"
              aria-label="Close product details"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid sm:grid-cols-2">
              <div className="relative min-h-64 bg-[#e7dfd2] sm:min-h-[470px]">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-serif text-2xl text-[#8d7355]/70" aria-hidden="true">
                  {quickViewProduct.name}
                </div>
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="relative h-full min-h-64 w-full object-cover sm:min-h-[470px]"
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <span className="shop-kicker">{quickViewProduct.category} · {quickViewProduct.tag}</span>
                <h2 id="quick-view-title" className="mt-4 font-serif text-4xl leading-[.98] sm:text-5xl">{quickViewProduct.name}</h2>
                <p className="mt-4 font-mono text-base tabular-nums">{formatCurrency(quickViewProduct.price, quickViewProduct.currency)}</p>
                <p className="mt-5 text-sm leading-6 text-[#6f685c]">{quickViewProduct.description}</p>
                {quickViewProduct.details.length > 0 && (
                  <div className="mt-6 border-t border-[#ded5c8] pt-5">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#827969]">Details</h3>
                    <ul className="mt-3 space-y-2">
                      {quickViewProduct.details.map((detail) => (
                        <li key={detail} className="flex gap-2 text-xs leading-5 text-[#5e584e]">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#987858]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onOpenProduct(quickViewProduct.id);
                    setQuickViewProduct(null);
                  }}
                  className="mt-7 flex min-h-11 w-full items-center justify-center border border-[#b9a58a] px-4 text-xs uppercase tracking-[.14em] text-[#514a3f] transition-colors hover:bg-[#eee7dc]"
                >
                  Full product details
                </button>
                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={!quickViewProduct.inStock}
                    onClick={() => {
                      handleAdd(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex min-h-12 items-center justify-center gap-2 bg-[#302d27] px-4 text-[10px] uppercase tracking-[.1em] text-[#f7f1e7] transition hover:bg-[#8d6d4e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {quickViewProduct.inStock ? `Add to bag · ${formatCurrency(quickViewProduct.price, quickViewProduct.currency)}` : 'Sold out'}
                  </button>
                  <a
                    href={getProductWhatsAppUrl(quickViewProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ask about ${quickViewProduct.name} on WhatsApp`}
                    className="flex min-h-12 items-center justify-center gap-2 bg-[#27745b] px-4 text-[10px] uppercase tracking-[.1em] text-white transition hover:bg-[#1f604b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27745b]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp to order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

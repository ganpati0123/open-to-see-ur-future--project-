import React, { useState } from 'react';
import type { ProductReview } from './ProductReviews';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCTS_DATA, Product } from '../data/productsData';
import { PRODUCT_DETAIL_CONTENT } from '../data/productDetailContent';
import { formatCurrency } from '../utils/money';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { ProductReviews } from './ProductReviews';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenProduct: (productId: string) => void;
  onNavigate: (sectionId: string) => void;
  reviews: ProductReview[];
  onReviewsChange: (reviews: ProductReview[]) => void;
}

const productTabs = [
  { id: 'product-overview', label: 'Overview' },
  { id: 'product-specifications', label: 'Specifications' },
  { id: 'product-use', label: 'Use & care' },
  { id: 'product-reviews', label: 'Ratings & reviews' },
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onOpenProduct,
  onNavigate,
  reviews,
  onReviewsChange,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('product-overview');
  const content = PRODUCT_DETAIL_CONTENT[product.id];
  const gallery = content?.gallery ?? [{
    src: product.image,
    alt: product.name,
    label: 'Product',
    kind: 'product' as const,
  }];
  const activeImage = gallery[selectedImageIndex] ?? gallery[0];
  const category = PRODUCT_CATEGORIES.find((item) => item.label === product.category);
  const relatedProducts = PRODUCTS_DATA
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);
  const specifications = content?.specifications ?? product.details.map((detail, index) => ({
    label: index === 0 ? 'Product detail' : `Detail ${index + 1}`,
    value: detail,
  }));

  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    document.getElementById(tabId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="shop-shell min-h-[70vh] bg-[#f3eee5] pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 rounded-full border border-[#ded5c8] bg-white px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] text-[#625b50] shadow-xs transition-all hover:border-[#8d6d4e] hover:text-[#28251f] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to shop</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex items-center gap-1.5 text-xs text-[#817766] hover:text-[#28251f] transition-colors cursor-pointer"
          >
            Back to studio home →
          </button>
        </div>

        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.13em] text-[#817766] sm:mb-7">
          <button type="button" onClick={() => onNavigate('shop')} className="transition-colors hover:text-[#8d6d4e]">
            The shop
          </button>
          <span aria-hidden="true">/</span>
          {category && (
            <>
              <button type="button" onClick={() => onNavigate(category.id)} className="transition-colors hover:text-[#8d6d4e]">
                {category.label}
              </button>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page" className="text-[#514a3f]">{product.name}</span>
        </nav>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(350px,.9fr)] lg:gap-12">
          <section aria-label={`${product.name} image gallery`} className="min-w-0">
            <figure className="relative overflow-hidden border border-[#ded5c8] bg-[#e7dfd2]">
              <img
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                fetchPriority={selectedImageIndex === 0 ? 'high' : 'auto'}
                className={`aspect-square w-full ${activeImage.kind === 'product' ? 'object-contain' : 'bg-white object-contain p-2 sm:p-4'}`}
              />
              <figcaption className="absolute bottom-3 left-3 border border-white/60 bg-[#fbf8f1]/95 px-3 py-2 text-[9px] uppercase tracking-[.14em] text-[#514a3f] backdrop-blur-sm sm:bottom-4 sm:left-4">
                {activeImage.label}
              </figcaption>
            </figure>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3" aria-label="Choose a product image">
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Show ${image.label}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`overflow-hidden border bg-[#fbf8f1] text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d6d4e] ${
                      selectedImageIndex === index ? 'border-[#8d6d4e] ring-1 ring-[#8d6d4e]' : 'border-[#ded5c8] hover:border-[#b69570]'
                    }`}
                  >
                    <img src={image.src} alt="" loading="lazy" className="aspect-square w-full object-contain" />
                    <span className="block truncate px-1.5 py-2 text-center text-[8px] uppercase tracking-[.08em] text-[#625b50] sm:text-[9px]">
                      {image.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 text-[10px] text-[#918877]">
              {content ? 'Product photo and the supplied product information images.' : 'Product image.'}
            </p>
          </section>

          <div className="lg:sticky lg:top-24">
            <div className="border border-[#ded5c8] bg-[#fbf8f1] p-5 sm:p-7 lg:p-8">
              <span className="shop-kicker">{product.category} · {product.tag}</span>
              <h1 className="mt-3 font-serif text-4xl leading-[.98] text-[#28251f] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {product.reviewsCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => scrollToTab('product-reviews')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#514a3f] underline decoration-[#b69570] underline-offset-4"
                    aria-label={`${product.rating} out of 5 stars, based on ${product.reviewsCount} ratings. View reviews.`}
                  >
                    <Star className="h-4 w-4 fill-[#bd8e48] text-[#bd8e48]" aria-hidden="true" />
                    <span>{product.rating}</span>
                    <span className="text-[#817766]">({product.reviewsCount.toLocaleString()} ratings)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => scrollToTab('product-reviews')}
                    className="text-xs text-[#817766] underline decoration-[#b69570] underline-offset-4"
                  >
                    Be the first to review
                  </button>
                )}
                <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[.12em] ${product.inStock ? 'text-[#65705b]' : 'text-[#9b4f40]'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-[#65705b]' : 'bg-[#9b4f40]'}`} aria-hidden="true" />
                  {product.inStock ? 'In stock' : 'Currently unavailable'}
                </span>
              </div>

              <p className="mt-5 font-mono text-2xl tabular-nums text-[#28251f]">
                {formatCurrency(product.price, product.currency)}
              </p>
              <p className="mt-1 text-[11px] text-[#817766]">Price shown for one item. Shipping is calculated at checkout.</p>
              <p className="mt-5 text-sm leading-7 text-[#625b50]">
                {content?.description ?? product.description}
              </p>

              {content?.materials && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {content.materials.map((material) => (
                    <div key={material.name} className="border border-[#ded5c8] bg-white/70 p-3">
                      <span className="block text-[9px] uppercase tracking-[.12em] text-[#8d6d4e]">Stone</span>
                      <span className="mt-1 block font-serif text-lg text-[#28251f]">{material.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {content?.specifications.slice(0, 3).map((specification) => (
                <div key={specification.label} className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#625b50]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8d6d4e]" aria-hidden="true" />
                  <span><strong className="font-medium text-[#514a3f]">{specification.label}:</strong> {specification.value}</span>
                </div>
              ))}

              <div className="mt-6 border-y border-[#ded5c8] py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-12 items-center border border-[#cfc4b4] bg-white" aria-label="Choose quantity">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      disabled={quantity <= 1}
                      className="flex h-full w-11 items-center justify-center text-[#514a3f] transition-colors hover:bg-[#eee7dc] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-9 text-center font-mono text-sm tabular-nums" aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="flex h-full w-11 items-center justify-center text-[#514a3f] transition-colors hover:bg-[#eee7dc]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-[#817766]">Qty</span>
                  <div className="grid flex-1 gap-2 sm:min-w-48 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, quantity)}
                      disabled={!product.inStock}
                      className="flex min-h-12 items-center justify-center gap-2 bg-[#302d27] px-3 text-[9px] font-semibold uppercase tracking-[.09em] text-[#f7f1e7] transition-colors hover:bg-[#8d6d4e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {product.inStock
                        ? `Add to bag · ${formatCurrency(product.price * quantity, product.currency)}`
                        : 'Unavailable'}
                    </button>
                    <a
                      href={getProductWhatsAppUrl(product, quantity)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ask about ${product.name} on WhatsApp`}
                      className="flex min-h-12 items-center justify-center gap-2 bg-[#27745b] px-3 text-[9px] font-semibold uppercase tracking-[.09em] text-white transition-colors hover:bg-[#1f604b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27745b]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-[#817766]">
                  All prices are shown in Indian rupees (₹). Checkout securely sends your order details to our WhatsApp team for confirmation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(category?.id ?? 'shop')}
                className="mt-5 inline-flex items-center gap-2 border-b border-[#b69570] pb-1 text-[9px] uppercase tracking-[.14em] text-[#6e5942] transition-colors hover:text-[#28251f]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to {category?.label ?? 'all collections'}
              </button>
            </div>
            <p className="px-1 pt-3 text-[10px] leading-5 text-[#918877]">
              Details and images are supplied by the studio. Check the specifications below before ordering.
            </p>
          </div>
        </div>

        <nav aria-label="Product details sections" className="sticky top-[60px] z-20 -mx-4 mt-10 overflow-x-auto border-y border-[#d7cdbf] bg-[#f3eee5]/95 px-4 backdrop-blur sm:top-[72px] sm:mx-0 sm:mt-14 sm:px-0">
          <div className="flex min-w-max gap-6 sm:gap-9">
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToTab(tab.id)}
                aria-current={activeTab === tab.id ? 'location' : undefined}
                className={`min-h-12 border-b-2 text-[9px] font-medium uppercase tracking-[.12em] transition-colors sm:text-[10px] ${
                  activeTab === tab.id ? 'border-[#8d6d4e] text-[#28251f]' : 'border-transparent text-[#817766] hover:text-[#514a3f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <section id="product-overview" className="scroll-mt-32 border-b border-[#ded5c8] py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <span className="shop-kicker">A closer look</span>
              <h2 className="mt-2 font-serif text-3xl text-[#28251f] sm:text-4xl">Product overview</h2>
            </div>
            <div>
              <p className="text-sm leading-7 text-[#625b50]">{content?.description ?? product.description}</p>
              {content?.materials && (
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {content.materials.map((material) => (
                    <article key={material.name} className="border border-[#ded5c8] bg-[#fbf8f1] p-5">
                      <span className="shop-kicker">Materials</span>
                      <h3 className="mt-2 font-serif text-2xl text-[#28251f]">{material.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-[#777064]">{material.note}</p>
                    </article>
                  ))}
                </div>
              )}
              {content?.benefits && (
                <div className="mt-7">
                  <h3 className="font-serif text-2xl text-[#28251f]">Crystal notes</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {content.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 border border-[#ded5c8] bg-[#fbf8f1]/75 p-4 text-xs leading-5 text-[#625b50]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8d6d4e]" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[10px] leading-5 text-[#918877]">{content.traditionNote}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="product-specifications" className="scroll-mt-32 border-b border-[#ded5c8] py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <span className="shop-kicker">The details</span>
              <h2 className="mt-2 font-serif text-3xl text-[#28251f] sm:text-4xl">Specifications</h2>
            </div>
            <dl className="divide-y divide-[#ded5c8] border-y border-[#ded5c8] bg-[#fbf8f1]/55">
              {specifications.length > 0 ? specifications.map((specification) => (
                <div key={specification.label} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[minmax(120px,.75fr)_1.25fr] sm:gap-6 sm:px-5">
                  <dt className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#817766]">{specification.label}</dt>
                  <dd className="text-xs leading-5 text-[#514a3f]">{specification.value}</dd>
                </div>
              )) : (
                <div className="px-4 py-5 text-sm text-[#777064]">No additional specifications have been provided.</div>
              )}
            </dl>
          </div>
        </section>

        <section id="product-use" className="scroll-mt-32 border-b border-[#ded5c8] py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <span className="shop-kicker">Helpful before you order</span>
              <h2 className="mt-2 font-serif text-3xl text-[#28251f] sm:text-4xl">
                {content ? 'How to wear' : 'Use & care'}
              </h2>
            </div>
            <div>
              {content ? (
                <>
                  <ul className="space-y-3">
                    {content.wearGuide.map((instruction) => (
                      <li key={instruction} className="flex gap-3 text-sm leading-6 text-[#625b50]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#8d6d4e]" aria-hidden="true" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 border-l-2 border-[#b69570] bg-[#fbf8f1] px-5 py-4">
                    <span className="shop-kicker">Best day to wear</span>
                    <p className="mt-2 text-sm leading-6 text-[#514a3f]">{content.bestDays}</p>
                  </div>
                </>
              ) : (
                <div className="border border-[#ded5c8] bg-[#fbf8f1] p-5">
                  <p className="text-sm leading-7 text-[#625b50]">{product.description}</p>
                  {product.details.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {product.details.map((detail) => (
                        <li key={detail} className="flex gap-3 text-xs leading-5 text-[#625b50]">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8d6d4e]" aria-hidden="true" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <ProductReviews
          productId={product.id}
          initialRating={product.rating}
          initialReviewCount={product.reviewsCount}
          reviews={reviews}
          onReviewsChange={onReviewsChange}
        />

        {relatedProducts.length > 0 && (
          <section className="mt-14 border-t border-[#ded5c8] pt-9 sm:mt-20" aria-labelledby="related-products-title">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="shop-kicker">From the same collection</span>
                <h2 id="related-products-title" className="mt-2 font-serif text-3xl text-[#28251f]">You may also like</h2>
              </div>
              {category && (
                <button
                  type="button"
                  onClick={() => onNavigate(category.id)}
                  className="hidden items-center gap-2 text-[10px] uppercase tracking-[.12em] text-[#6e5942] transition-colors hover:text-[#28251f] sm:inline-flex"
                >
                  View collection <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={getProductWhatsAppUrl(relatedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ask about ${relatedProduct.name} on WhatsApp`}
                  className="group min-w-0 text-left"
                >
                  <div className="relative aspect-square overflow-hidden border border-[#ded5c8] bg-[#e7dfd2]">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                  <span className="mt-3 block font-serif text-lg leading-tight text-[#28251f] transition-colors group-hover:text-[#8d6d4e]">
                    {relatedProduct.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs tabular-nums text-[#625b50]">
                    {formatCurrency(relatedProduct.price, relatedProduct.currency)}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Back Actions */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 border-t border-[#ded5c8] pt-8">
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 rounded-sm bg-[#302d27] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#f7f1e7] transition-colors hover:bg-[#8d6d4e] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Collections</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex items-center gap-2 rounded-sm border border-[#ded5c8] bg-white px-6 py-3 text-xs uppercase tracking-[0.16em] text-[#514a3f] transition-colors hover:bg-[#f2ece2] cursor-pointer"
          >
            <span>Back to Studio Home</span>
          </button>
        </div>
      </div>
    </main>
  );
};

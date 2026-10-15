import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCTS_DATA, Product } from '../data/productsData';
import { formatCurrency } from '../utils/money';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenProduct: (productId: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onOpenProduct,
  onNavigate,
}) => {
  const [quantity, setQuantity] = useState(1);
  const category = PRODUCT_CATEGORIES.find((item) => item.label === product.category);
  const relatedProducts = PRODUCTS_DATA
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <main className="shop-shell min-h-[70vh] bg-[#f3eee5] pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 sm:pt-10 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.15em] text-[#817766]">
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="transition-colors hover:text-[#8d6d4e]"
          >
            The shop
          </button>
          <span aria-hidden="true">/</span>
          {category && (
            <>
              <button
                type="button"
                onClick={() => onNavigate(category.id)}
                className="transition-colors hover:text-[#8d6d4e]"
              >
                {category.label}
              </button>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page" className="text-[#514a3f]">{product.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:gap-16">
          <figure className="relative overflow-hidden border border-[#ded5c8] bg-[#e7dfd2]">
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center font-serif text-2xl text-[#8d7355]/70" aria-hidden="true">
              {product.name}
            </div>
            <img
              src={product.image}
              alt={product.name}
              fetchPriority="high"
              className="relative aspect-square w-full object-cover"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
            <figcaption className="absolute bottom-4 left-4 border border-white/60 bg-[#fbf8f1]/90 px-3 py-2 text-[9px] uppercase tracking-[.16em] text-[#514a3f] backdrop-blur-sm">
              {product.tag}
            </figcaption>
          </figure>

          <div className="lg:sticky lg:top-28">
            <span className="shop-kicker">{product.category} · Studio selection</span>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[.98] text-[#28251f] sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-mono text-lg tabular-nums text-[#28251f]">
                {formatCurrency(product.price, product.currency)}
              </p>
              <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[.12em] ${product.inStock ? 'text-[#65705b]' : 'text-[#9b4f40]'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-[#65705b]' : 'bg-[#9b4f40]'}`} aria-hidden="true" />
                {product.inStock ? 'Available' : 'Currently unavailable'}
              </span>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#625b50] sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 border-y border-[#ded5c8] py-5 sm:flex-row sm:items-center">
              <div className="inline-flex h-12 w-fit items-center border border-[#cfc4b4] bg-[#fbf8f1]" aria-label="Choose quantity">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className="flex h-full w-12 items-center justify-center text-[#514a3f] transition-colors hover:bg-[#eee7dc] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center font-mono text-sm tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-full w-12 items-center justify-center text-[#514a3f] transition-colors hover:bg-[#eee7dc]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(product, quantity)}
                disabled={!product.inStock}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#302d27] px-5 text-xs font-medium uppercase tracking-[.14em] text-[#f7f1e7] transition-colors hover:bg-[#8d6d4e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.inStock
                  ? `Add to bag · ${formatCurrency(product.price * quantity, product.currency)}`
                  : 'Unavailable'}
              </button>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-[#817766]">
              Add this piece to your bag to review your order and shipping details.
            </p>

            {product.details.length > 0 && (
              <div className="mt-9 border-t border-[#ded5c8] pt-6">
                <h2 className="font-serif text-2xl text-[#28251f]">Product details</h2>
                <ul className="mt-4 space-y-3">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm leading-6 text-[#625b50]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#8d6d4e]" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate(category?.id ?? 'shop')}
              className="mt-8 inline-flex items-center gap-2 border-b border-[#b69570] pb-1 text-[10px] uppercase tracking-[.15em] text-[#6e5942] transition-colors hover:text-[#28251f]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to {category?.label ?? 'all collections'}
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#ded5c8] pt-9 sm:mt-24" aria-labelledby="related-products-title">
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
                <button
                  key={relatedProduct.id}
                  type="button"
                  onClick={() => onOpenProduct(relatedProduct.id)}
                  className="group min-w-0 text-left"
                >
                  <div className="relative aspect-square overflow-hidden border border-[#ded5c8] bg-[#e7dfd2]">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <span className="mt-3 block font-serif text-lg leading-tight text-[#28251f] transition-colors group-hover:text-[#8d6d4e]">
                    {relatedProduct.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs tabular-nums text-[#625b50]">
                    {formatCurrency(relatedProduct.price, relatedProduct.currency)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

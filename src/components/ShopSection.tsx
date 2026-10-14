import React, { useState } from 'react';
import { PRODUCTS_DATA, Product } from '../data/productsData';
import { ShoppingBag, Star, Sparkles, Check, Eye, X } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Ritual Goods', 'Digital Readings', 'Sessions'];

  const filteredProducts = selectedCategory === 'All'
    ? PRODUCTS_DATA
    : PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  const handleAdd = (product: Product) => {
    playChimeSound();
    onAddToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <section id="shop" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E6E0D6]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8E8271] mb-2">
            <span>Apothecary & Sacred Tools</span>
            <span>·</span>
            <span className="text-[#A98765]">Hand-Crafted Intention</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight">
            The Studio Boutique
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 font-light mt-1 max-w-xl">
            Consecrated talismans, ritual goods, and private digital consultations curated by Neha Arora to ground your energetic field.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-lg border border-[#E6E0D6]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F5F1EB] shadow-xs'
                  : 'text-[#8E8271] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 8 Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {filteredProducts.map((product) => {
          const isRecentlyAdded = addedIds.has(product.id);

          return (
            <div
              key={product.id}
              className="group rounded-xl bg-[#FCFAF7] border border-[#E6E0D6] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              {/* Product Image Box */}
              <div className="relative aspect-4/3 w-full bg-[#F5F1EB] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder container if network image fails
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-[#FAF7F2] text-[#A98765] p-4 text-center">
                          <span class="text-2xl font-serif">✦</span>
                          <span class="text-xs uppercase tracking-widest mt-2">${product.name}</span>
                        </div>
                      `;
                    }
                  }}
                />

                {/* Tag overlay */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] tracking-wider uppercase font-medium bg-[#FCFAF7]/90 backdrop-blur-xs text-[#1A1A1A] px-2.5 py-1 rounded-sm border border-[#E6E0D6]/60">
                    {product.tag}
                  </span>
                </div>

                {/* Quick View Button on Hover */}
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-3 right-3 p-2 bg-[#FCFAF7]/95 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F1EB] rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Quick View Details"
                  aria-label="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Content */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8E8271] mb-1">
                    <span className="text-[10px] uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#C4A484] text-[#C4A484]" />
                      <span className="tabular-nums font-mono text-[11px] text-[#1A1A1A]">{product.rating}</span>
                      <span className="text-[10px]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#A98765] transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mt-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-[#E6E0D6]/60 flex items-center justify-between">
                  <span className="font-mono text-base font-medium text-[#1A1A1A] tabular-nums">
                    ${product.price}
                  </span>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isRecentlyAdded
                        ? 'bg-[#A98765] text-[#FFFFFF]'
                        : 'bg-[#1A1A1A] text-[#F5F1EB] hover:bg-[#A98765]'
                    }`}
                  >
                    {isRecentlyAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xl border border-[#C4A484]/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-lg overflow-hidden bg-[#F5F1EB] border border-[#E6E0D6]">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] tracking-widest uppercase text-[#A98765] font-medium block">
                  {quickViewProduct.category} · {quickViewProduct.tag}
                </span>
                <h3 className="font-serif text-3xl text-[#1A1A1A]">{quickViewProduct.name}</h3>
                <p className="font-mono text-xl text-[#1A1A1A] tabular-nums">${quickViewProduct.price}</p>
                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-light">{quickViewProduct.description}</p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8271] font-medium block">
                    Product Details:
                  </span>
                  {quickViewProduct.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#1A1A1A]/80">
                      <span className="text-[#C4A484]">✦</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleAdd(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag (${quickViewProduct.price})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

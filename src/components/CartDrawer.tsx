import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/productsData';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playChimeSound();
    setOrderComplete(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckingOut(false);
      setOrderComplete(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#FAF7F2] border-l border-[#E6E0D6] shadow-2xl h-full flex flex-col justify-between z-10 p-6 sm:p-8 overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#E6E0D6] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl text-[#1A1A1A]">Your Sacred Bag</span>
                  <span className="text-xs text-[#8E8271] font-mono tabular-nums">({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/40 rounded-full cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress bar */}
              <div className="p-3 bg-[#FCFAF7] rounded-lg border border-[#E6E0D6] mb-6">
                <div className="flex items-center justify-between text-[11px] text-[#8E8271] mb-1.5">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-[#A98765] font-medium">✦ Complimentary Studio Shipping Unlocked!</span>
                  ) : (
                    <span>Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for complimentary shipping</span>
                  )}
                  <span className="font-mono tabular-nums">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A98765] transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Itemized List */}
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="font-serif text-3xl text-[#C4A484] block">✦</span>
                  <p className="font-serif text-xl text-[#1A1A1A]">Your shopping bag is quiet.</p>
                  <p className="text-xs text-[#8E8271] font-light max-w-xs mx-auto">
                    Explore our boutique intention candles, crystals, or personalized digital readings.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-colors rounded-sm cursor-pointer"
                  >
                    Explore Offerings
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[46vh] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-[#FCFAF7] rounded-lg border border-[#E6E0D6] flex gap-3 items-center justify-between"
                    >
                      <div className="w-14 h-14 rounded overflow-hidden bg-[#F5F1EB] shrink-0 border border-[#E6E0D6]">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-[#1A1A1A] truncate">{item.product.name}</h4>
                        <span className="text-xs font-mono text-[#8E8271] tabular-nums">${item.product.price} each</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-0.5 text-[#8E8271] hover:text-[#1A1A1A] border border-[#E6E0D6] rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs tabular-nums px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-0.5 text-[#8E8271] hover:text-[#1A1A1A] border border-[#E6E0D6] rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-medium text-[#1A1A1A] tabular-nums">
                          ${item.product.price * item.quantity}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="block text-[10px] text-[#8E8271] hover:text-rose-600 mt-2 ml-auto cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions & Checkout */}
            {items.length > 0 && (
              <div className="pt-6 border-t border-[#E6E0D6] space-y-4">
                <div className="space-y-1.5 text-xs text-[#8E8271]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-sm text-[#1A1A1A] font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Studio Shipping</span>
                    <span>{subtotal >= freeShippingThreshold ? 'Complimentary' : '$6.50'}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-3.5 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A98765] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#C4A484]" />
                  </button>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
                    <div className="p-3 bg-[#FCFAF7] rounded border border-[#C4A484]/40 space-y-2 text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-[#A98765] font-semibold block">
                        Quick Express Checkout
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Recipient Name"
                        defaultValue="Neha's Seeker"
                        className="w-full p-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded text-xs text-[#1A1A1A]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Shipping Address / Country"
                        defaultValue="742 Evergreen Terrace, Brooklyn NY"
                        className="w-full p-2 bg-[#FAF7F2] border border-[#E6E0D6] rounded text-xs text-[#1A1A1A]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={orderComplete}
                      className="w-full py-3 bg-[#A98765] text-[#FFFFFF] text-xs uppercase tracking-widest font-medium hover:bg-[#1A1A1A] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {orderComplete ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Order Confirmed!</span>
                        </>
                      ) : (
                        <span>Place Sacred Order (${(subtotal + (subtotal >= freeShippingThreshold ? 0 : 6.5)).toFixed(2)})</span>
                      )}
                    </button>
                  </form>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E8271]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A98765]" />
                  <span>Encrypted 256-Bit SSL · Consecrated Packaging</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

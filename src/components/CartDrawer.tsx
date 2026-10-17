import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/productsData';
import { X, Trash2, Plus, Minus, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { playChimeSound } from '../utils/audio';
import { formatCurrency } from '../utils/money';
import { getCartWhatsAppUrl, getCheckoutWhatsAppUrl, WhatsAppCustomerDetails } from '../utils/whatsapp';

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
  const [checkoutWhatsAppUrl, setCheckoutWhatsAppUrl] = useState('');
  const [customer, setCustomer] = useState<WhatsAppCustomerDetails>({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const totalsByCurrency = items.reduce<Record<'USD' | 'INR', number>>(
    (totals, item) => {
      const currency = item.product.currency ?? 'USD';
      totals[currency] += item.product.price * item.quantity;
      return totals;
    },
    { USD: 0, INR: 0 },
  );
  const usdShippingThreshold = 75;
  const usdShipping = totalsByCurrency.USD >= usdShippingThreshold ? 0 : 6.5;
  const usdShippingProgress = Math.min(100, (totalsByCurrency.USD / usdShippingThreshold) * 100);
  const orderTotals = (['INR', 'USD'] as const)
    .filter((currency) => totalsByCurrency[currency] > 0)
    .map((currency) => ({
      currency,
      subtotal: totalsByCurrency[currency],
      total: totalsByCurrency[currency] + (currency === 'USD' ? usdShipping : 0),
    }));
  const orderTotalLabel = orderTotals
    .map(({ currency, total }) => formatCurrency(total, currency))
    .join(' · ');

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullAddress = [
      String(formData.get('address') ?? customer.address),
      String(formData.get('city') ?? customer.city),
      String(formData.get('pincode') ?? customer.pincode),
    ].filter(Boolean).join(', ');
    const whatsappUrl = getCheckoutWhatsAppUrl(items, {
      name: String(formData.get('name') ?? customer.name),
      phone: String(formData.get('phone') ?? customer.phone),
      address: fullAddress,
    });
    setCheckoutWhatsAppUrl(whatsappUrl);

    playChimeSound();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setOrderComplete(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckingOut(false);
      setOrderComplete(false);
      setCheckoutWhatsAppUrl('');
      setCustomer({ name: '', phone: '', address: '', city: '', pincode: '' });
      onClose();
    }, 1800);
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

              {totalsByCurrency.USD > 0 && (
                <div className="p-3 bg-[#FCFAF7] rounded-lg border border-[#E6E0D6] mb-6">
                  <div className="flex items-center justify-between text-[11px] text-[#8E8271] mb-1.5">
                    {totalsByCurrency.USD >= usdShippingThreshold ? (
                      <span className="text-[#A98765] font-medium">Complimentary shipping unlocked</span>
                    ) : (
                      <span>Add {formatCurrency(usdShippingThreshold - totalsByCurrency.USD, 'USD')} more for complimentary shipping</span>
                    )}
                    <span className="font-mono tabular-nums">{Math.round(usdShippingProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#A98765] transition-all duration-300"
                      style={{ width: `${usdShippingProgress}%` }}
                    />
                  </div>
                  {totalsByCurrency.INR > 0 && (
                    <p className="mt-2 text-[10px] text-[#8E8271]">Shipping for INR orders is calculated at checkout.</p>
                  )}
                </div>
              )}

              {totalsByCurrency.USD === 0 && totalsByCurrency.INR > 0 && (
                <p className="mb-6 rounded-lg border border-[#E6E0D6] bg-[#FCFAF7] p-3 text-[11px] text-[#8E8271]">
                  Shipping for INR orders is calculated at checkout.
                </p>
              )}

              {/* Itemized List */}
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="font-serif text-3xl text-[#C4A484] block">✦</span>
                  <p className="font-serif text-xl text-[#1A1A1A]">Your shopping bag is quiet.</p>
                  <p className="text-xs text-[#8E8271] font-light max-w-xs mx-auto">
                    Explore zodiac bracelets, crystal pieces, and personalized digital readings.
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
                        <span className="text-xs font-mono text-[#8E8271] tabular-nums">
                          {formatCurrency(item.product.price, item.product.currency)} each
                        </span>
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
                          {formatCurrency(item.product.price * item.quantity, item.product.currency)}
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
                <div className="space-y-2 text-xs text-[#8E8271]">
                  {orderTotals.map(({ currency, subtotal, total }) => (
                    <div key={currency} className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal · INR</span>
                        <span className="font-mono text-sm text-[#1A1A1A] font-medium tabular-nums">
                          {formatCurrency(subtotal, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Studio shipping</span>
                        <span>
                          {currency === 'INR'
                            ? 'Calculated at checkout'
                            : usdShipping === 0
                              ? 'Complimentary'
                              : formatCurrency(usdShipping, 'USD')}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-[#E6E0D6] pt-1.5">
                        <span>Total · INR</span>
                        <span className="font-mono text-sm text-[#1A1A1A] font-medium tabular-nums">
                          {formatCurrency(total, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
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
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2" aria-label="WhatsApp checkout form">
                    <div className="rounded-xl border border-[#C4A484]/45 bg-gradient-to-br from-[#FCFAF7] to-[#F5EEE4] p-4 shadow-[0_12px_35px_rgba(107,78,45,0.08)]">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A98765]">
                            Secure WhatsApp checkout
                          </span>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#8E8271]">
                            Share your delivery details and we&apos;ll confirm your order personally.
                          </p>
                        </div>
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#27745b]" aria-hidden="true" />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {([
                          ['name', 'Recipient name', 'name'],
                          ['phone', 'WhatsApp phone number', 'tel'],
                          ['address', 'Full shipping address', 'text'],
                          ['city', 'City', 'address-level2'],
                          ['pincode', 'Pincode', 'postal-code'],
                        ] as const).map(([field, placeholder, autocomplete]) => (
                          <label key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
                            <span className="sr-only">{placeholder}</span>
                            <input
                              type={field === 'phone' || field === 'pincode' ? 'tel' : 'text'}
                              inputMode={field === 'phone' || field === 'pincode' ? 'numeric' : undefined}
                              autoComplete={autocomplete}
                              required
                              minLength={field === 'phone' ? 8 : field === 'pincode' ? 4 : 2}
                              value={customer[field]}
                              onChange={(event) => setCustomer((current) => ({ ...current, [field]: event.target.value }))}
                              placeholder={placeholder}
                              aria-label={placeholder}
                              className="w-full rounded-lg border border-[#E6E0D6] bg-[#FAF7F2] px-3 py-2.5 text-xs text-[#1A1A1A] outline-none transition-all placeholder:text-[#8E8271] focus:border-[#A98765] focus:ring-2 focus:ring-[#C4A484]/25"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={orderComplete}
                      className="group w-full rounded-lg bg-[#27745b] py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-white shadow-[0_10px_25px_rgba(39,116,91,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#1f604b] hover:shadow-[0_14px_30px_rgba(39,116,91,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Continue to WhatsApp · {orderTotalLabel}</span>
                    </button>
                    {checkoutWhatsAppUrl && (
                      <div className="rounded border border-[#27745b]/30 bg-[#27745b]/5 p-3 text-xs leading-relaxed text-[#514d45]" role="status">
                        WhatsApp has your order draft. Tap Send in WhatsApp to confirm your order.
                        <a
                          href={checkoutWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block font-medium text-[#27745b] underline underline-offset-2"
                        >
                          Open WhatsApp order message
                        </a>
                      </div>
                    )}
                  </form>
                )}

                <a
                  href={getCartWhatsAppUrl(items)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Send your shopping bag to WhatsApp"
                  className="w-full py-3.5 bg-[#27745b] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#1f604b] transition-colors rounded-sm flex items-center justify-center gap-2 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27745b]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Bag on WhatsApp</span>
                </a>

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

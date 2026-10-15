import React, { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';

interface ProductReview {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number;
  date: string;
}

interface ProductReviewsProps {
  productId: string;
  initialRating: number;
  initialReviewCount: number;
}

const storageKey = (productId: string) => `studio-product-reviews:${productId}`;

const readReviews = (productId: string): ProductReview[] => {
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((review): review is ProductReview =>
      Boolean(
        review &&
        typeof review.id === 'string' &&
        typeof review.name === 'string' &&
        typeof review.title === 'string' &&
        typeof review.body === 'string' &&
        Number.isInteger(review.rating) &&
        review.rating >= 1 &&
        review.rating <= 5 &&
        typeof review.date === 'string',
      ),
    );
  } catch {
    return [];
  }
};

const Stars = ({ value, label }: { value: number; label: string }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={label}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        aria-hidden="true"
        className={`h-4 w-4 ${star <= Math.round(value) ? 'fill-[#bd8e48] text-[#bd8e48]' : 'text-[#c8c0b4]'}`}
      />
    ))}
  </span>
);

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  initialRating,
  initialReviewCount,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [selectedRating, setSelectedRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setReviews(readReviews(productId));
    setFormOpen(false);
    setMessage('');

    const syncReviews = (event: StorageEvent) => {
      if (event.key === storageKey(productId) || event.key === null) {
        setReviews(readReviews(productId));
      }
    };
    window.addEventListener('storage', syncReviews);
    return () => window.removeEventListener('storage', syncReviews);
  }, [productId]);

  const reviewCount = initialReviewCount + reviews.length;
  const averageRating = useMemo(() => {
    if (reviewCount === 0) return 0;
    const importedTotal = initialReviewCount > 0 ? initialRating * initialReviewCount : 0;
    const customerTotal = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round(((importedTotal + customerTotal) / reviewCount) * 10) / 10;
  }, [initialRating, initialReviewCount, reviewCount, reviews]);

  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextReview: ProductReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      title: title.trim(),
      body: body.trim(),
      rating: selectedRating,
      date: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date()),
    };
    const nextReviews = [nextReview, ...reviews];

    try {
      window.localStorage.setItem(storageKey(productId), JSON.stringify(nextReviews));
      setReviews(nextReviews);
      setName('');
      setTitle('');
      setBody('');
      setSelectedRating(5);
      setFormOpen(false);
      setMessage('Your review has been saved in this browser.');
    } catch {
      setMessage('This browser could not save your review. It has not been added.');
    }
  };

  return (
    <section id="product-reviews" className="scroll-mt-28 border-t border-[#ded5c8] pt-10 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <span className="shop-kicker">Customer notes</span>
          <h2 className="mt-2 font-serif text-3xl text-[#28251f] sm:text-4xl">Ratings & reviews</h2>
          {reviewCount > 0 ? (
            <div className="mt-5 border border-[#ded5c8] bg-[#fbf8f1] p-5">
              <div className="flex items-center gap-3">
                <strong className="font-serif text-4xl font-normal tabular-nums text-[#28251f]">{averageRating.toFixed(1)}</strong>
                <div>
                  <Stars value={averageRating} label={`${averageRating} out of 5 stars`} />
                  <p className="mt-1 text-xs text-[#777064]">From {reviewCount.toLocaleString()} ratings</p>
                </div>
              </div>
              {initialReviewCount > 0 && (
                <p className="mt-4 text-[11px] leading-5 text-[#777064]">
                  The imported listing includes a rating summary; individual reviews from that source were not provided.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#777064]">
              No ratings yet. If you have tried this piece, share an honest note with the next customer.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setMessage('');
            }}
            className="mt-5 min-h-11 border border-[#302d27] px-5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#302d27] transition-colors hover:bg-[#302d27] hover:text-[#fbf8f1]"
          >
            {formOpen ? 'Close review form' : 'Write a review'}
          </button>
          {message && <p role="status" className="mt-3 text-xs leading-5 text-[#65705b]">{message}</p>}
          <p className="mt-3 text-[10px] leading-5 text-[#918877]">Reviews you add are stored only in this browser.</p>
        </div>

        <div>
          {formOpen && (
            <form onSubmit={submitReview} className="mb-7 border border-[#ded5c8] bg-[#fbf8f1] p-5 sm:p-7">
              <h3 className="font-serif text-2xl text-[#28251f]">Share your experience</h3>
              <label className="mt-5 block text-xs font-medium text-[#514a3f]">
                Your rating
                <span className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Choose a star rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={selectedRating === rating}
                      aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
                      onClick={() => setSelectedRating(rating)}
                      className="rounded-sm p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d6d4e]"
                    >
                      <Star className={`h-5 w-5 ${rating <= selectedRating ? 'fill-[#bd8e48] text-[#bd8e48]' : 'text-[#c8c0b4]'}`} />
                    </button>
                  ))}
                </span>
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium text-[#514a3f]">
                  Name
                  <input
                    required
                    maxLength={60}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm font-normal outline-none focus:border-[#8d6d4e]"
                    placeholder="Your name"
                  />
                </label>
                <label className="text-xs font-medium text-[#514a3f]">
                  Review title
                  <input
                    required
                    maxLength={100}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 min-h-11 w-full border border-[#cfc4b4] bg-white px-3 text-sm font-normal outline-none focus:border-[#8d6d4e]"
                    placeholder="Sum it up"
                  />
                </label>
              </div>
              <label className="mt-4 block text-xs font-medium text-[#514a3f]">
                Your review
                <textarea
                  required
                  minLength={10}
                  maxLength={1200}
                  rows={4}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="mt-2 w-full resize-y border border-[#cfc4b4] bg-white p-3 text-sm font-normal leading-6 outline-none focus:border-[#8d6d4e]"
                  placeholder="What should another shopper know?"
                />
              </label>
              <button
                type="submit"
                className="mt-5 min-h-11 bg-[#302d27] px-6 text-[10px] font-semibold uppercase tracking-[.15em] text-[#fbf8f1] transition-colors hover:bg-[#8d6d4e]"
              >
                Publish review
              </button>
            </form>
          )}

          {reviews.length > 0 ? (
            <div className="divide-y divide-[#ded5c8] border-y border-[#ded5c8]">
              {reviews.map((review) => (
                <article key={review.id} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Stars value={review.rating} label={`${review.rating} out of 5 stars`} />
                    <time className="text-[10px] text-[#918877]">{review.date}</time>
                  </div>
                  <h3 className="mt-3 font-serif text-xl text-[#28251f]">{review.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#625b50]">{review.body}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[.12em] text-[#918877]">By {review.name}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="border-y border-[#ded5c8] py-8">
              <p className="font-serif text-xl text-[#514a3f]">No written reviews yet</p>
              <p className="mt-2 text-xs leading-5 text-[#777064]">
                Be the first to share a useful, honest review of this product.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

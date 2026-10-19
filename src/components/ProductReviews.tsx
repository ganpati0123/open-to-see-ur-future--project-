import React, { useState, useMemo } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import { useStore, CustomerReview } from '../context/StoreContext';
import { playChimeSound } from '../utils/audio';

interface ProductReviewsProps {
  productId: string;
  productName?: string;
  initialRating?: number;
  initialReviewCount?: number;
}

const StarRow = ({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={`${sizeClasses} ${
            star <= Math.round(value)
              ? 'fill-[#e6b967] text-[#e6b967]'
              : 'fill-transparent text-[#6e685f]'
          }`}
        />
      ))}
    </div>
  );
};

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName = 'Sacred Offering',
}) => {
  const { getProductReviews, getProductStats, addReview, markReviewHelpful } = useStore();

  const reviews = getProductReviews(productId);
  const stats = getProductStats(productId);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'photos'>('all');

  // Handle image upload from file input
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 4) {
      setUploadError('You can upload up to 4 photos per review.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 2.5 * 1024 * 1024) {
        setUploadError('Please select images under 2.5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setPhotos((prev) => [...prev, base64].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !body.trim()) return;

    addReview({
      productId,
      productName,
      name: name.trim(),
      rating: selectedRating,
      title: title.trim(),
      body: body.trim(),
      photos,
      verified: true,
    });

    playChimeSound();
    setName('');
    setTitle('');
    setBody('');
    setPhotos([]);
    setSelectedRating(5);
    setFormOpen(false);
    setSuccessMessage('Thank you. Your sacred review and photo have been published to this listing.');

    setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedFilter === '5') return r.rating === 5;
      if (selectedFilter === '4') return r.rating === 4;
      if (selectedFilter === 'photos') return r.photos && r.photos.length > 0;
      return true;
    });
  }, [reviews, selectedFilter]);

  // Star breakdown calculation
  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  return (
    <section id="product-reviews" className="scroll-mt-28 border-t border-[#ded5c8] pt-12 sm:pt-16">
      {/* Lightbox Modal for Customer Photo */}
      {activePhotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl border border-[#e6b967]/30 bg-[#111326] p-2 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={activePhotoModal}
              alt="Customer product photo"
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Header and Rating Overview */}
      <div className="grid gap-8 lg:grid-cols-[minmax(280px,.8fr)_minmax(0,1.2fr)] lg:gap-14">
        {/* Left: Overall score & action */}
        <div>
          <span className="shop-kicker flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[#bd8e48]" />
            Seeker Experiences
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#28251f]">
            Ratings & Customer Notes
          </h2>

          <div className="mt-6 rounded-2xl border border-[#ded5c8] bg-[#fbf8f1] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="font-serif text-5xl font-normal text-[#28251f] tabular-nums">
                {stats.rating.toFixed(1)}
              </span>
              <div>
                <StarRow value={stats.rating} size="md" />
                <p className="mt-1 text-xs text-[#777064]">
                  Based on {stats.count} total rating{stats.count === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="mt-6 space-y-2 border-t border-[#ded5c8] pt-5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs text-[#777064]">
                    <span className="w-10 font-mono text-[11px]">{stars} stars</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ded5c8]/50">
                      <div
                        className="h-full rounded-full bg-[#bd8e48]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-5 text-right font-mono text-[10px] text-[#918877]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setFormOpen((open) => !open)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#302d27] px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#fbf8f1] transition-all hover:bg-[#8d6d4e] shadow-sm cursor-pointer"
            >
              <Camera className="h-4 w-4 text-[#e6b967]" />
              <span>{formOpen ? 'Cancel Review' : 'Write a Review & Add Photo'}</span>
            </button>
          </div>

          {successMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#27745b]/30 bg-[#27745b]/10 p-3 text-xs leading-relaxed text-[#1f604b]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#27745b]" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Review submission form & Review List */}
        <div>
          {formOpen && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 rounded-2xl border border-[#c4a484]/40 bg-[#fbf8f1] p-6 sm:p-8 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-[#ded5c8] pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#28251f]">Share Your Sacred Experience</h3>
                  <p className="mt-1 text-xs text-[#777064]">Reviewing: {productName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-full p-1 text-[#8E8271] hover:bg-[#ded5c8]/40 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Star rating selector */}
              <div className="mt-5">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#514a3f]">
                  Rating Selection
                </label>
                <div className="mt-2 flex items-center gap-2" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="group p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= selectedRating
                            ? 'fill-[#bd8e48] text-[#bd8e48]'
                            : 'text-[#cfc4b4] group-hover:text-[#bd8e48]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-serif text-base text-[#bd8e48]">
                    {selectedRating === 5
                      ? '5 / 5 · Divine Connection'
                      : selectedRating === 4
                      ? '4 / 5 · Highly Recommended'
                      : selectedRating === 3
                      ? '3 / 5 · Balanced Resonance'
                      : `${selectedRating} / 5 Stars`}
                  </span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-medium text-[#514a3f]">
                  Your Name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanshu K."
                    className="mt-1.5 min-h-11 w-full rounded-sm border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e]"
                  />
                </label>
                <label className="block text-xs font-medium text-[#514a3f]">
                  Review Headline
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Calming presence in my home"
                    className="mt-1.5 min-h-11 w-full rounded-sm border border-[#cfc4b4] bg-white px-3 text-sm text-[#28251f] outline-none focus:border-[#8d6d4e]"
                  />
                </label>
              </div>

              {/* Body */}
              <label className="mt-5 block text-xs font-medium text-[#514a3f]">
                Detailed Feedback & Experience
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="How did this sacred item integrate into your daily meditation, altar, or routine?"
                  className="mt-1.5 w-full rounded-sm border border-[#cfc4b4] bg-white p-3 text-sm leading-relaxed text-[#28251f] outline-none focus:border-[#8d6d4e]"
                />
              </label>

              {/* Photo Upload Section */}
              <div className="mt-5 rounded-xl border border-dashed border-[#b9a58a] bg-[#faf6f0] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-[#bd8e48]" />
                    <span className="text-xs font-medium uppercase tracking-wider text-[#514a3f]">
                      Attach Photos ({photos.length}/4)
                    </span>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#8d6d4e] bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8d6d4e] transition-colors hover:bg-[#8d6d4e] hover:text-white">
                    <Upload className="h-3 w-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadError && <p className="mt-2 text-xs text-[#9b4f40]">{uploadError}</p>}

                {photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#ded5c8]">
                        <img src={photo} alt="Upload preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                          title="Remove photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#777064] hover:text-[#28251f] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-sm bg-[#302d27] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#fbf8f1] transition-colors hover:bg-[#8d6d4e] cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          )}

          {/* Filters Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ded5c8] pb-3 text-xs">
            <span className="text-xs uppercase tracking-wider text-[#817766]">
              {filteredReviews.length} Written Review{filteredReviews.length === 1 ? '' : 's'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: '5', label: '5 Stars' },
                { id: '4', label: '4 Stars' },
                { id: 'photos', label: 'With Photos' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    selectedFilter === tab.id
                      ? 'bg-[#302d27] text-white font-medium'
                      : 'border border-[#ded5c8] text-[#777064] hover:border-[#8d6d4e] hover:text-[#28251f]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Stream */}
          {filteredReviews.length > 0 ? (
            <div className="divide-y divide-[#ded5c8]">
              {filteredReviews.map((review) => (
                <article key={review.id} className="py-6 transition-colors first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StarRow value={review.rating} size="sm" />
                      {review.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-[#27745b]/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#27745b]">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified Seeker
                        </span>
                      )}
                    </div>
                    <time className="text-[11px] text-[#918877]">{review.date}</time>
                  </div>

                  <h4 className="mt-3 font-serif text-xl text-[#28251f]">{review.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f594f] font-light">{review.body}</p>

                  {/* Customer Photos Gallery */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {review.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setActivePhotoModal(photo)}
                          className="group relative h-20 w-20 overflow-hidden rounded-lg border border-[#ded5c8] transition-transform hover:scale-105 cursor-pointer shadow-xs"
                          title="Click to view full photo"
                        >
                          <img
                            src={photo}
                            alt={`Review photo ${pIdx + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                          <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                            <ZoomIn className="h-4 w-4" />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#918877] border-t border-[#ded5c8]/50 pt-3">
                    <span className="font-serif italic text-sm text-[#494239]">
                      By {review.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => markReviewHelpful(review.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#ded5c8] bg-white px-3 py-1 text-[11px] text-[#777064] transition-colors hover:border-[#bd8e48] hover:text-[#28251f] cursor-pointer"
                    >
                      <ThumbsUp className="h-3 w-3 text-[#bd8e48]" />
                      <span>Helpful ({review.helpfulCount || 0})</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#cfc4b4] bg-[#fbf8f1]/60 px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-[#b9a58a]" />
              <p className="mt-3 font-serif text-2xl text-[#514a3f]">No reviews in this category yet</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#777064]">
                Be the first to share your experience with {productName}.
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="mt-5 rounded-sm bg-[#302d27] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#fbf8f1] hover:bg-[#8d6d4e] transition-colors cursor-pointer"
              >
                Write the First Review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

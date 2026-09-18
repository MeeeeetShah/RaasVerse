'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { TESTIMONIALS } from '@/constants';

export default function Testimonials({ onOpenReview }) {
  const [reviews, setReviews] = useState(TESTIMONIALS);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic reviews:', err);
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="py-24 bg-[#090a0f] border-t border-white/5 relative overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl text-left space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Real Community Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              What Our <span className="text-gradient-red">Garba Dancers</span> Say
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Real stories from people whose Navratri celebrations were made unforgettable with RaasVerse.
            </p>
          </div>

          {/* Review Button */}
          {onOpenReview && (
            <button
              type="button"
              onClick={() => onOpenReview()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.id || i}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3 text-left">
                {/* Rating Stars & Event Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {review.eventTitle && (
                    <span className="text-[10px] text-amber-400/80 font-mono truncate max-w-[130px]">
                      {review.eventTitle}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-md uppercase">
                    {review.avatar || review.name?.charAt(0) || 'R'}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                      <span>{review.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    </h4>
                    <span className="text-[11px] text-gray-400">{review.city}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

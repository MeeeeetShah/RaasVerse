'use client';

import { useState, useEffect } from 'react';
import { X, Star, Sparkles, CheckCircle2, MessageSquare, User, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReviewModal({
  isOpen,
  onClose,
  prefilledEventTitle = '',
  prefilledName = '',
  onReviewSubmitted
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(prefilledName);
  const [city, setCity] = useState('Ahmedabad');
  const [eventTitle, setEventTitle] = useState(prefilledEventTitle);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (prefilledName) setName(prefilledName);
    if (prefilledEventTitle) setEventTitle(prefilledEventTitle);
    if (isOpen) {
      setSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen, prefilledName, prefilledEventTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!text.trim()) {
      setErrorMsg('Please write a few words about your experience.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || 'Ahmedabad',
          eventTitle: eventTitle.trim() || 'Navratri Garba',
          rating,
          text: text.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      // Celebrate
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#e11d48', '#10b981', '#ffffff']
        });
      } catch (_) {}

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(data.review);
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d0e15] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto text-left">
        {/* Decorative Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-rose-600/30 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Review Submitted!</h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">
                Thank you for helping other Garba lovers across Ahmedabad find authentic passes and unforgettable festive experiences!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Header */}
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> RaasVerse Community Feedback
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  How was your <span className="text-gradient-red">Pass Experience?</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Share quick feedback about WhatsApp pass reservation, collection or event vibe.
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-center space-y-1.5">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                  Select Rating
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] font-bold text-amber-400 font-mono">
                  {rating === 5
                    ? '★★★★★ Outstanding Experience!'
                    : rating === 4
                    ? '★★★★☆ Very Good'
                    : rating === 3
                    ? '★★★☆☆ Average'
                    : 'Need Improvement'}
                </span>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Your Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Krish Patel"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">City / Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bopal, Ahmedabad"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Event Attended */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Event or Experience</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Mandalam Garba 2026 / Pass Booking"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Feedback Text */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Your Review *</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us about the WhatsApp support, pass pickup ease, or ground experience..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-xs font-semibold">{errorMsg}</p>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

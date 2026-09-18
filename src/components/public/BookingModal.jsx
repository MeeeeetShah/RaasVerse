'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Ticket,
  User,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  Map,
  CheckCircle2,
  Star,
  Plus,
  Minus
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function BookingModal({
  event,
  isOpen,
  onClose,
  onOpenLayout,
  onOpenReview
}) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [passQuantities, setPassQuantities] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);

  // Initialize dates and pass tiers
  const datesList =
    event?.dates && Array.isArray(event.dates) && event.dates.length > 0
      ? event.dates
      : [
          {
            date: event?.dateRange || '11 Oct 2026',
            status: 'available',
            passes: [{ name: 'General Admission', price: event?.price || 799 }]
          }
        ];

  const activeDateObj = datesList[selectedDateIndex] || datesList[0];
  const passesList =
    activeDateObj?.passes && Array.isArray(activeDateObj.passes) && activeDateObj.passes.length > 0
      ? activeDateObj.passes
      : [{ name: 'General Pass', price: event?.price || 799 }];

  // Reset/Initialize pass quantities when event or date changes
  useEffect(() => {
    if (event && passesList.length > 0) {
      const initial = {};
      passesList.forEach((p, index) => {
        // Default: 1 pass for the first category, 0 for others
        initial[p.name] = index === 0 ? 1 : 0;
      });
      setPassQuantities(initial);
      setErrorMsg('');
    }
  }, [event, selectedDateIndex]);

  // Compute selected items, counts, and grand total
  const selectedItems = passesList
    .map((p) => {
      const qty = passQuantities[p.name] || 0;
      const rate = Number(p.price) || 0;
      return {
        name: p.name,
        price: rate,
        quantity: qty,
        subtotal: rate * qty
      };
    })
    .filter((item) => item.quantity > 0);

  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);

  // Listener to trigger review popup when user returns from WhatsApp
  const handleReturnFromWhatsApp = useCallback(() => {
    try {
      const pendingStr = localStorage.getItem('raasverse_pending_review');
      if (pendingStr) {
        const pendingData = JSON.parse(pendingStr);
        localStorage.removeItem('raasverse_pending_review');
        setHasOpenedWhatsApp(false);

        // Allow smooth focus transition before popping review
        setTimeout(() => {
          if (onOpenReview) {
            onClose();
            onOpenReview({
              eventTitle: pendingData.eventTitle || event?.title || 'Navratri Garba',
              customerName: pendingData.customerName || customerName || ''
            });
          }
        }, 600);
      }
    } catch (_) {}
  }, [event, customerName, onClose, onOpenReview]);

  useEffect(() => {
    if (!hasOpenedWhatsApp) return;

    const handleFocus = () => {
      handleReturnFromWhatsApp();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleReturnFromWhatsApp();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasOpenedWhatsApp, handleReturnFromWhatsApp]);

  if (!isOpen || !event) return null;

  const updateQuantity = (passName, change) => {
    setPassQuantities((prev) => {
      const current = prev[passName] || 0;
      const updated = Math.max(0, Math.min(500, current + change));
      return { ...prev, [passName]: updated };
    });
  };

  const handleBookOnWhatsApp = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (totalQuantity === 0) {
      setErrorMsg('Please select at least 1 pass across categories.');
      return;
    }
    setErrorMsg('');

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#10b981', '#ffffff']
      });
    } catch (_) {}

    // Multi-tier pass line item breakdown
    const passBreakdownText = selectedItems
      .map(
        (item) => `  • ${item.quantity}x ${item.name} (₹${item.price} each = ₹${item.subtotal})`
      )
      .join('\n');

    // Formulate structured WhatsApp message
    const message = `Hello RaasVerse Team,

I would like to place a Navratri Garba pass booking request.

Booking Details:
- Event: ${event.title}
- Festival: ${event.festival || 'Navratri 2026'}
- Venue: ${event.venue || event.location || 'Ahmedabad'}
- Date: ${activeDateObj.date}
- Passes Selected:
${passBreakdownText}
- Total Passes: ${totalQuantity} Pass(es)
- Grand Total Amount: ₹${grandTotal}

Customer Information:
- Full Name: ${customerName.trim()}
- Mobile: ${customerPhone.trim()}

Kindly confirm pass availability and share payment & pickup instructions.

Thank you!`;

    const whatsappUrl = CONTACT_INFO.getWhatsAppBookingUrl(message);

    // Save pending review info in localStorage
    try {
      localStorage.setItem(
        'raasverse_pending_review',
        JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          customerName: customerName.trim(),
          total: grandTotal,
          timestamp: Date.now()
        })
      );
    } catch (_) {}

    setHasOpenedWhatsApp(true);

    // Open WhatsApp in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0d0e14] border border-rose-900/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col md:flex-row my-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Event Poster & Venue Layout Button */}
        <div className="w-full md:w-5/12 relative min-h-[220px] md:min-h-[480px] bg-black/60 flex flex-col justify-between p-6">
          <Image
            src={
              event.image ||
              'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop'
            }
            alt={event.title}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-[#0d0e14]/40 to-transparent" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-rose-600/90 text-white shadow-md">
              {event.badge || 'Official Pass'}
            </span>

            {/* Quick Review Link */}
            {onOpenReview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReview({
                    eventTitle: event.title,
                    customerName: customerName || ''
                  });
                }}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer"
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Write Review</span>
              </button>
            )}
          </div>

          {/* Bottom Event Summary */}
          <div className="relative z-10 space-y-2 mt-auto">
            <h3 className="text-xl font-black text-white">{event.title}</h3>
            <p className="text-xs text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{event.location || event.venue || 'Ahmedabad, Gujarat'}</span>
            </p>

            {/* Event & Venue Features Chips */}
            {event.features && Array.isArray(event.features) && event.features.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {event.features.slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-black/50 text-gray-200 border border-white/10 backdrop-blur-sm"
                  >
                    ✨ {f}
                  </span>
                ))}
              </div>
            )}

            {/* Layout Button */}
            {event.layoutImage && (
              <button
                type="button"
                onClick={() => {
                  onOpenLayout && onOpenLayout(event);
                }}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 backdrop-blur-sm transition-all cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-amber-400" />
                <span>View Ground Layout Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Multi-Tier Booking Studio */}
        <div className="w-full md:w-7/12 p-6 overflow-y-auto max-h-[85vh] md:max-h-[92vh] space-y-5 text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Multi-Tier Pass Booking
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Select Dates & Passes</h2>
            <p className="text-xs text-gray-400">
              Mix and match categories (e.g. 1 VIP + 2 General passes) in a single booking!
            </p>
          </div>

          {/* 1. Date Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              1. Select Garba Night
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {datesList.map((d, index) => {
                const isSelected = selectedDateIndex === index;
                return (
                  <button
                    key={d.date + index}
                    type="button"
                    onClick={() => {
                      setSelectedDateIndex(index);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-xs font-bold">{d.date}</span>
                    <span
                      className={`block text-[10px] font-medium mt-0.5 ${
                        d.status === 'fast_filling' ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {d.status === 'fast_filling' ? 'Fast Filling' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Multi-Tier Pass Selector with Steppers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                2. Choose Pass Quantities for {activeDateObj.date}
              </label>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {totalQuantity} pass(es) selected
              </span>
            </div>

            <div className="space-y-2.5">
              {passesList.map((p, pIndex) => {
                const count = passQuantities[p.name] || 0;
                const isSelected = count > 0;
                const subtotal = (Number(p.price) || 0) * count;

                return (
                  <div
                    key={p.name + pIndex}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-950/40 via-[#18101a] to-black border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs block truncate">
                          {p.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {count} Selected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-amber-400 font-mono">
                          ₹{p.price}
                        </span>
                        <span className="text-[10px] text-gray-400 font-normal">/ pass</span>
                        {isSelected && (
                          <span className="text-[10px] text-gray-300 font-mono">
                            • Line Total: ₹{subtotal}
                          </span>
                        )}
                      </div>

                      {/* Pass Perks Badges */}
                      {p.perks && Array.isArray(p.perks) && p.perks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {p.perks.map((perk, perkIdx) => (
                            <span
                              key={perkIdx}
                              className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                              <span>{perk}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center bg-black/60 border border-white/15 rounded-xl overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(p.name, -1)}
                        className="p-2 text-gray-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Decrease count"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-black text-white font-mono">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(p.name, 1)}
                        className="p-2 text-gray-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Increase count"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Customer Contact Details */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              3. Reservation Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  placeholder="10-digit WhatsApp Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  maxLength={10}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
            {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}
          </div>

          {/* 4. Multi-Tier Price Breakdown */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            {selectedItems.length > 0 ? (
              <div className="space-y-1">
                {selectedItems.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs text-gray-300">
                    <span>
                      {item.quantity}x {item.name} (₹{item.price} each)
                    </span>
                    <span className="font-mono">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-amber-400 font-medium">
                Please select at least 1 pass tier above.
              </div>
            )}

            <div className="flex justify-between text-xs text-emerald-400 pt-1 border-t border-white/5">
              <span>Online Platform & Convenience Fee</span>
              <span className="font-semibold">FREE (₹0)</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-white block">Grand Total Amount:</span>
                <span className="text-[10px] text-gray-400">
                  Includes {totalQuantity} pass(es) for {activeDateObj.date}
                </span>
              </div>
              <span className="text-2xl font-black text-amber-400 font-mono">₹{grandTotal}</span>
            </div>
          </div>

          {/* 5. WhatsApp CTA Button */}
          <button
            type="button"
            onClick={handleBookOnWhatsApp}
            disabled={totalQuantity === 0}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>Book {totalQuantity > 0 ? `${totalQuantity} Passes` : 'Passes'} on WhatsApp</span>
          </button>

          <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Genuine Pass Guarantee • Instant Handover Support
          </p>
        </div>
      </div>
    </div>
  );
}

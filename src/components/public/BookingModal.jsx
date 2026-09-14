'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { X, Calendar, Ticket, User, Phone, MapPin, Sparkles, MessageCircle, Map, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function BookingModal({ event, isOpen, onClose, onOpenLayout }) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedPassIndex, setSelectedPassIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset indices when event changes
  useEffect(() => {
    if (event) {
      setSelectedDateIndex(0);
      setSelectedPassIndex(0);
      setQuantity(1);
      setErrorMsg('');
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const datesList = event.dates && Array.isArray(event.dates) && event.dates.length > 0
    ? event.dates
    : [{ date: event.dateRange || '11 Oct 2026', status: 'available', passes: [{ name: 'General Admission', price: event.price || 799 }] }];

  const activeDateObj = datesList[selectedDateIndex] || datesList[0];
  const passesList = activeDateObj.passes && Array.isArray(activeDateObj.passes) && activeDateObj.passes.length > 0
    ? activeDateObj.passes
    : [{ name: 'General Pass', price: event.price || 799 }];

  const activePass = passesList[selectedPassIndex] || passesList[0];
  const basePrice = Number(activePass.price) || 799;
  const totalPrice = basePrice * Number(quantity);

  const handleBookOnWhatsApp = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
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

    // Formulate structured WhatsApp message
    const message = `Hello RaasVerse Team,

I would like to place a Navratri Garba pass booking request.

Booking Details:
- Event: ${event.title}
- Festival: ${event.festival || 'Navratri 2026'}
- Venue: ${event.venue || event.location || 'Ahmedabad'}
- Date: ${activeDateObj.date}
- Pass Category: ${activePass.name}
- Rate: ₹${basePrice}
- Quantity: ${quantity} Pass(es)
- Total Amount: ₹${totalPrice}

Customer Information:
- Full Name: ${customerName.trim()}
- Mobile: ${customerPhone.trim()}

Kindly confirm pass availability and share payment & pickup instructions.

Thank you!`;

    const whatsappUrl = CONTACT_INFO.getWhatsAppBookingUrl(message);

    // Store in localStorage for quick revisit
    try {
      localStorage.setItem('lastRaasVerseBooking', JSON.stringify({
        eventId: event.id,
        title: event.title,
        date: activeDateObj.date,
        pass: activePass.name,
        total: totalPrice,
        timestamp: new Date().toISOString()
      }));
    } catch (_) {}

    // Open WhatsApp
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
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Event Poster & Venue Layout Button */}
        <div className="w-full md:w-5/12 relative min-h-[220px] md:min-h-[480px] bg-black/60 flex flex-col justify-between p-6">
          <Image
            src={event.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop'}
            alt={event.title}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-[#0d0e14]/40 to-transparent" />

          {/* Top Tag */}
          <div className="relative z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-rose-600/90 text-white shadow-md">
              {event.badge || 'Official Pass'}
            </span>
          </div>

          {/* Bottom Event Summary */}
          <div className="relative z-10 space-y-2 mt-auto">
            <h3 className="text-xl font-black text-white">{event.title}</h3>
            <p className="text-xs text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{event.location || event.venue || 'Ahmedabad, Gujarat'}</span>
            </p>

            {/* Layout Button */}
            {event.layoutImage && (
              <button
                type="button"
                onClick={() => {
                  onOpenLayout && onOpenLayout(event);
                }}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
              >
                <Map className="w-3.5 h-3.5 text-amber-400" />
                <span>View Ground Layout Map</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Booking Studio */}
        <div className="w-full md:w-7/12 p-6 overflow-y-auto max-h-[85vh] md:max-h-[92vh] space-y-5 text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Pass Booking
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Select Dates & Passes</h2>
            <p className="text-xs text-gray-400">Prices are verified against official ground rates.</p>
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
                      setSelectedPassIndex(0);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-xs font-bold">{d.date}</span>
                    <span className={`block text-[10px] font-medium mt-0.5 ${
                      d.status === 'fast_filling' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {d.status === 'fast_filling' ? 'Fast Filling' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pass Tier Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              2. Select Pass Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passesList.map((p, pIndex) => {
                const isPassSelected = selectedPassIndex === pIndex;
                return (
                  <button
                    key={p.name + pIndex}
                    type="button"
                    onClick={() => setSelectedPassIndex(pIndex)}
                    className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isPassSelected
                        ? 'bg-gradient-to-r from-rose-900/40 to-rose-700/20 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold">{p.name}</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">Verified Entry</span>
                    </div>
                    <span className="text-sm font-black text-amber-400">₹{p.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pass Quantity Stepper */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              3. Number of Passes
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(500, quantity + 1))}
                  className="px-3.5 py-2 text-sm font-bold text-gray-300 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-gray-400 font-medium">
                Passes for friends & squad? Enter up to 500 passes!
              </div>
            </div>
          </div>

          {/* 4. Customer Contact Details */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              4. Your Details (For WhatsApp Reservation)
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

          {/* 5. Total Price Breakdown */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{activePass.name} (₹{basePrice} × {quantity})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Online Platform Fee</span>
              <span className="font-semibold">FREE (₹0)</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Grand Total Amount:</span>
              <span className="text-xl font-black text-amber-400">₹{totalPrice}</span>
            </div>
          </div>

          {/* 6. WhatsApp CTA Button */}
          <button
            type="button"
            onClick={handleBookOnWhatsApp}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>Book Now on WhatsApp</span>
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

'use client';

import { useState } from 'react';
import { Users, Percent, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function GroupBookingCalc() {
  const [passCount, setPassCount] = useState(15);
  const [passType, setPassType] = useState('standard');

  const baseRates = {
    standard: 899,
    vip: 1699,
    season: 5999
  };

  const getDiscountPercent = (count) => {
    if (count >= 50) return 15;
    if (count >= 25) return 10;
    if (count >= 10) return 5;
    return 0;
  };

  const discountPercent = getDiscountPercent(passCount);
  const rate = baseRates[passType];
  const originalTotal = rate * passCount;
  const discountAmount = Math.round((originalTotal * discountPercent) / 100);
  const finalTotal = originalTotal - discountAmount;

  const handleWhatsAppQuote = () => {
    const message = `Hello RaasVerse Team,

I would like a customized Group / Squad Booking discount quote.

Squad Booking Details:
- Number of Passes: ${passCount}
- Pass Category: ${passType.toUpperCase()} (Base: ₹${rate})
- Estimated Total: ₹${finalTotal} (After ${discountPercent}% Squad Discount)
- Savings: ₹${discountAmount}

Please connect with me to finalize our college / corporate group passes.`;

    const url = CONTACT_INFO.getWhatsAppBookingUrl(message);
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-[#07070a] relative overflow-hidden" id="group-booking">
      {/* Background glow */}
      <div className="ambient-glow-2 -bottom-20 -left-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl glass-panel border border-amber-500/20 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative banner */}
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20">
                <Percent className="w-3.5 h-3.5" /> Bulk Pass Privileges
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Garba Squad & <span className="text-gradient-gold">Bulk Discount</span> Calculator
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Going with your garba group, college friends, or corporate team? Save up to 15% with exclusive bulk pass rates and dedicated on-ground pickup assistance in Ahmedabad.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-lg font-black text-amber-400">5% OFF</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">10+ Passes</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-lg font-black text-rose-400">10% OFF</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">25+ Passes</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-lg font-black text-emerald-400">15% OFF</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">50+ Passes</span>
                </div>
              </div>
            </div>

            {/* Right Calculator Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/60 border border-white/10 space-y-5">
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-300 tracking-wider">
                  Select Pass Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: 'General', price: '₹899' },
                    { id: 'vip', label: 'VIP Lounge', price: '₹1,699' },
                    { id: 'season', label: 'Season 9-Nights', price: '₹5,999' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPassType(tier.id)}
                      className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                        passType === tier.id
                          ? 'bg-rose-600/30 border-rose-500 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="block">{tier.label}</span>
                      <span className="block text-[10px] text-amber-400 font-mono mt-0.5">{tier.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase text-gray-300 tracking-wider">Number of Passes</span>
                  <span className="font-black text-base text-white font-mono">{passCount} Passes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={passCount}
                  onChange={(e) => setPassCount(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>5 passes</span>
                  <span>25 passes</span>
                  <span>50 passes</span>
                  <span>100 passes</span>
                </div>
              </div>

              {/* Calculated Breakdown */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Standard Price ({passCount} × ₹{rate}):</span>
                  <span>₹{originalTotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-medium">
                    <span>Squad Discount ({discountPercent}%):</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Estimated Squad Total:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">₹{finalTotal}</span>
                </div>
              </div>

              {/* WhatsApp Action */}
              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Instant Squad Quote on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

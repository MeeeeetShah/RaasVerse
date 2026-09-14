'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, ShieldCheck, Sparkles, Flame, ArrowRight, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function Hero() {
  // Countdown to Navratri 2026 (Oct 11, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-11T19:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center bg-gradient-radial-red">
      {/* Ambient background glow balls */}
      <div className="ambient-glow-1 -top-20 left-1/4 animate-pulse-glow" />
      <div className="ambient-glow-2 top-1/3 -right-20 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-rose-500/30 text-xs font-semibold text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ahmedabad's Most Trusted Garba Pass Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Experience The Magic Of{' '}
              <span className="text-gradient-red block sm:inline">Navratri 2026</span>{' '}
              Across Ahmedabad
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-300/90 max-w-xl font-normal leading-relaxed">
              RaasVerse connects you to the city's grandest Garba nights, celebrity concerts, and cultural celebrations. Enjoy 100% verified passes, zero black-market hassle, and instant booking support.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/events"
                className="btn-primary-glow px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg"
              >
                <span>Explore Garba Passes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={CONTACT_INFO.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Join VIP WhatsApp</span>
              </a>
            </div>

            {/* Live Navratri Countdown Clock */}
            <div className="pt-4">
              <div className="inline-block p-4 rounded-2xl glass-panel border border-rose-900/30 max-w-full">
                <p className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                  Countdown To Navratri Mahotsav
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  <div className="bg-black/60 px-3 py-2 rounded-xl border border-white/5 min-w-[60px] sm:min-w-[70px]">
                    <span className="font-extrabold text-xl sm:text-2xl text-white font-mono">{timeLeft.days}</span>
                    <span className="block text-[10px] uppercase text-gray-400 font-medium">Days</span>
                  </div>
                  <div className="bg-black/60 px-3 py-2 rounded-xl border border-white/5 min-w-[60px] sm:min-w-[70px]">
                    <span className="font-extrabold text-xl sm:text-2xl text-rose-400 font-mono">{timeLeft.hours}</span>
                    <span className="block text-[10px] uppercase text-gray-400 font-medium">Hours</span>
                  </div>
                  <div className="bg-black/60 px-3 py-2 rounded-xl border border-white/5 min-w-[60px] sm:min-w-[70px]">
                    <span className="font-extrabold text-xl sm:text-2xl text-amber-400 font-mono">{timeLeft.minutes}</span>
                    <span className="block text-[10px] uppercase text-gray-400 font-medium">Mins</span>
                  </div>
                  <div className="bg-black/60 px-3 py-2 rounded-xl border border-white/5 min-w-[60px] sm:min-w-[70px]">
                    <span className="font-extrabold text-xl sm:text-2xl text-rose-500 font-mono">{timeLeft.seconds}</span>
                    <span className="block text-[10px] uppercase text-gray-400 font-medium">Secs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
              <div>
                <h4 className="text-2xl font-black text-white">15K+</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Passes Distributed</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-amber-400">100%</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Verified Entry</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-rose-400">24/7</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Concierge Support</p>
              </div>
            </div>
          </div>

          {/* Right Column: Spotlight Feature Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Card Frame with Glowing Red Border */}
            <div className="relative w-full max-w-md p-1 rounded-3xl bg-gradient-to-b from-rose-600/50 via-amber-500/20 to-black shadow-[0_0_50px_rgba(225,29,72,0.35)]">
              <div className="relative rounded-[22px] bg-[#0c0d13] p-6 overflow-hidden border border-white/10 flex flex-col justify-between">
                {/* Spotlight Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Spotlight Season
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Live Booking
                  </span>
                </div>

                {/* Season Banner Details */}
                <div className="py-6 space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Navratri Mahotsav <span className="text-rose-500">2026</span>
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Ahmedabad's Biggest 9-Nights Celebration across VIP Road, Sindhu Bhavan & S.G. Highway.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Authentic Daily & Season Pass Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Dedicated VIP Lounges & Couple Entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Instant Handover & Direct WhatsApp Confirmation</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Starting from</span>
                    <span className="text-xl font-extrabold text-white">
                      ₹599 <span className="text-xs text-gray-400 font-normal">/ pass</span>
                    </span>
                  </div>

                  <Link
                    href="/events"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md hover:shadow-rose-600/40 transition-all flex items-center gap-1.5"
                  >
                    <span>View Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

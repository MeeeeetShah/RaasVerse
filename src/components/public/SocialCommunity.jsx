'use client';

import { MessageCircle, Sparkles, ArrowRight, BellRing } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { CONTACT_INFO } from '@/lib/constants';

export default function SocialCommunity() {
  return (
    <section className="py-20 bg-[#07070a] relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-rose-500" /> Never Miss A Pass Drop
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Stay Connected With <span className="text-gradient-red">RaasVerse</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Get instant event announcements, limited-quantity VIP pass alerts, and exclusive early-bird discounts.
          </p>
        </div>

        {/* 2 Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Card */}
          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Join Our VIP WhatsApp Community
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Be the first to know when passes go live! Exclusive member discounts, fast pass reservations, and direct support from the RaasVerse team.
              </p>
            </div>

            <a
              href={CONTACT_INFO.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Community</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Instagram Card */}
          <div className="p-8 rounded-3xl glass-panel border border-rose-500/30 hover:border-rose-500/60 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_rgba(225,29,72,0.1)]">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <InstagramIcon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">
                Follow On Instagram
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Catch reel highlights, artist announcements, dress code inspiration, and live ground atmosphere across Ahmedabad Garba nights.
              </p>
            </div>

            <a
              href={CONTACT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-pink-500 shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow @raas_verse</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

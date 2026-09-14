'use client';

import { Sparkles, CheckCircle2 } from 'lucide-react';
import { BENEFITS } from '@/constants';

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#07070a] relative overflow-hidden" id="why-us">
      {/* Background ambient lighting */}
      <div className="ambient-glow-1 top-1/2 -right-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Why Choose RaasVerse
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Celebrate With <span className="text-gradient-gold">Absolute Confidence</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Ahmedabad's dedicated event booking platform designed to eliminate ticket black-marketing, long queues, and fake passes.
          </p>
        </div>

        {/* 4-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/50 hover:shadow-[0_15px_30px_rgba(225,29,72,0.2)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 text-gray-300 border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-6 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guaranteed by RaasVerse</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

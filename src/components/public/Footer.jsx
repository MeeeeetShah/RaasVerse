'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { CONTACT_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-rose-900/30 relative overflow-hidden pt-16 pb-12">
      {/* Ambient background glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-rose-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-700 shadow-lg">
                <Image
                  src="/assets/logo.png"
                  alt="RaasVerse Logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover scale-105"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-wide text-white">
                  RAAS<span className="text-rose-500">VERSE</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-400 font-medium">
                  Navratri Passes • Events • Vibes
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              Ahmedabad's dedicated celebration platform connecting you with the city's grandest Garba nights, music concerts, and festive experiences with 100% verified passes.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Entry & Genuine Pass Distributor</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-rose-400 transition-colors">
                  All Garba Events
                </Link>
              </li>
              <li>
                <Link href="/#nine-nights" className="hover:text-rose-400 transition-colors">
                  9-Nights Lineup Explorer
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="hover:text-rose-400 transition-colors">
                  Why Choose RaasVerse
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-rose-400 transition-colors">
                  Customer Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-rose-400 transition-colors">
                  Dress Code & Entry FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Connect With Us
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={CONTACT_INFO.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500 text-xs text-gray-300 hover:text-white transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-600/30 border border-white/10 hover:border-rose-500 text-xs text-gray-300 hover:text-white transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 RaasVerse. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for Ahmedabad's Grandest Celebration with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

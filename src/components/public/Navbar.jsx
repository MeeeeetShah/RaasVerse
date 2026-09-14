'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Phone, MessageCircle, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function Navbar({ onSearchChange, searchTerm = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else {
      router.push(`/events?search=${encodeURIComponent(localSearch)}`);
    }
    setMobileSearchOpen(false);
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Events', href: '/events' },
    { label: '9-Nights Lineup', href: '/#nine-nights' },
    { label: 'Why RaasVerse', href: '/#why-us' },
    { label: 'Reviews', href: '/#testimonials' },
    { label: 'Garba FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 border-b border-rose-900/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-700 shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src="/assets/logo.png"
                  alt="RaasVerse Logo"
                  width={48}
                  height={48}
                  priority
                  className="object-cover w-full h-full scale-105"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wide leading-tight">
                <span className="text-white">RAAS</span>
                <span className="text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.7)]">VERSE</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-amber-400 font-medium -mt-0.5">
                Passes • Events • Vibes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 py-1 relative hover:text-rose-400 ${
                    isActive ? 'text-rose-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Search Bar & WhatsApp CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search events, venues..."
                value={localSearch}
                onChange={handleSearchInputChange}
                className="w-48 lg:w-60 pl-9 pr-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            <a
              href={CONTACT_INFO.getWhatsAppBookingUrl("Hi RaasVerse! I would like to inquire about Navratri Garba Passes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-200"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pass Support</span>
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-rose-500" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pt-2 pb-3 bg-[#0c0d13] border-b border-rose-900/20">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search events, ground, singer..."
                value={localSearch}
                onChange={handleSearchInputChange}
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-white/5 border border-rose-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3 pointer-events-none" />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-[#090a0f] border-l border-rose-900/30 p-6 flex flex-col justify-between shadow-2xl z-50">
            <div>
              {/* Top brand header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-500 p-0.5">
                    <Image
                      src="/assets/logo.png"
                      alt="RaasVerse Logo"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">RaasVerse</h3>
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider">Ahmedabad Garba Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-200 hover:text-white hover:bg-rose-600/10 hover:border-l-2 hover:border-rose-500 transition-all font-medium text-sm"
                  >
                    <span>{link.label}</span>
                    <span className="text-gray-500">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href={CONTACT_INFO.getWhatsAppBookingUrl("Hi RaasVerse! I would like to book Navratri passes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-200 bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                <span>{CONTACT_INFO.phone}</span>
              </a>

              <p className="text-[11px] text-center text-gray-400 mt-2">
                100% Genuine & Verified Passes Guaranteed
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

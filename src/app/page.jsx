'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/public/Preloader';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import TrendingSection from '@/components/public/TrendingSection';
import NavratriPlanner from '@/components/public/NavratriPlanner';
import GroupBookingCalc from '@/components/public/GroupBookingCalc';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import Testimonials from '@/components/public/Testimonials';
import SocialCommunity from '@/components/public/SocialCommunity';
import FaqSection from '@/components/public/FaqSection';
import FestiveSound from '@/components/public/FestiveSound';
import Footer from '@/components/public/Footer';
import BookingModal from '@/components/public/BookingModal';
import VenueLayoutModal from '@/components/public/VenueLayoutModal';
import ReviewModal from '@/components/public/ReviewModal';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [selectedEventForLayout, setSelectedEventForLayout] = useState(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPrefill, setReviewPrefill] = useState({
    eventTitle: 'Navratri Garba 2026',
    customerName: ''
  });

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Global listener for returning from WhatsApp booking
  useEffect(() => {
    const checkPendingReview = () => {
      try {
        const pendingStr = localStorage.getItem('raasverse_pending_review');
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          // Only prompt if within the last 15 minutes
          if (Date.now() - (pending.timestamp || 0) < 15 * 60 * 1000) {
            localStorage.removeItem('raasverse_pending_review');
            setTimeout(() => {
              setSelectedEventForBooking(null);
              setReviewPrefill({
                eventTitle: pending.eventTitle || 'Navratri Garba 2026',
                customerName: pending.customerName || ''
              });
              setIsReviewModalOpen(true);
            }, 800);
          }
        }
      } catch (_) {}
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPendingReview();
      }
    };

    const onFocus = () => {
      checkPendingReview();
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleBookClick = (event) => {
    setSelectedEventForBooking(event);
  };

  const handleLayoutClick = (event) => {
    setSelectedEventForLayout(event);
  };

  const handleOpenReview = (info = {}) => {
    setReviewPrefill({
      eventTitle: info.eventTitle || 'Navratri Garba 2026',
      customerName: info.customerName || ''
    });
    setIsReviewModalOpen(true);
  };

  const handleSelectDayFromPlanner = (dateString) => {
    // Open the first event with this date or default trending event
    const matched =
      events.find((e) =>
        e.dates?.some((d) => d.date?.toLowerCase().includes(dateString.toLowerCase()))
      ) || events[0];
    if (matched) {
      setSelectedEventForBooking(matched);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070a] text-slate-100 selection:bg-rose-600 selection:text-white relative">
      {/* Brand Intro Preloader */}
      <Preloader />

      {/* Navigation (NO Login Button) */}
      <Navbar />

      {/* Hero Section with Live Countdown */}
      <Hero />

      {/* Trending Garba Section */}
      <TrendingSection
        events={events}
        loading={loading}
        onBookClick={handleBookClick}
        onLayoutClick={handleLayoutClick}
      />

      {/* Interactive 9-Nights Navratri Lineup Explorer */}
      <NavratriPlanner onSelectDay={handleSelectDayFromPlanner} />

      {/* Group & Squad Booking Discount Calculator */}
      <GroupBookingCalc />

      {/* 4-Pillars Trust & Why Choose RaasVerse */}
      <WhyChooseUs />

      {/* Verified Ahmedabad Reviews Marquee with Write Review Button */}
      <Testimonials onOpenReview={handleOpenReview} />

      {/* WhatsApp VIP & Instagram Community */}
      <SocialCommunity />

      {/* Garba Guidelines & Entry Rules FAQ */}
      <FaqSection />

      {/* Ambient Dhol Rhythm Audio Toggle */}
      <FestiveSound />

      {/* Luxury Red & Black Footer */}
      <Footer />

      {/* Interactive Booking Studio Modal */}
      <BookingModal
        event={selectedEventForBooking}
        isOpen={Boolean(selectedEventForBooking)}
        onClose={() => setSelectedEventForBooking(null)}
        onOpenLayout={(ev) => {
          setSelectedEventForBooking(null);
          setSelectedEventForLayout(ev);
        }}
        onOpenReview={handleOpenReview}
      />

      {/* Interactive Venue Layout Diagram Modal */}
      <VenueLayoutModal
        event={selectedEventForLayout}
        isOpen={Boolean(selectedEventForLayout)}
        onClose={() => setSelectedEventForLayout(null)}
      />

      {/* Community Review Popup Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        prefilledEventTitle={reviewPrefill.eventTitle}
        prefilledName={reviewPrefill.customerName}
      />
    </main>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import EventsCatalog from '@/components/public/EventsCatalog';
import BookingModal from '@/components/public/BookingModal';
import VenueLayoutModal from '@/components/public/VenueLayoutModal';
import ReviewModal from '@/components/public/ReviewModal';
import FestiveSound from '@/components/public/FestiveSound';
import Footer from '@/components/public/Footer';
import { Sparkles } from 'lucide-react';

function EventsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

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
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Global listener for returning from WhatsApp booking
  useEffect(() => {
    const checkPendingReview = () => {
      try {
        const pendingStr = localStorage.getItem('raasverse_pending_review');
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
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

  const handleOpenReview = (info = {}) => {
    setReviewPrefill({
      eventTitle: info.eventTitle || 'Navratri Garba 2026',
      customerName: info.customerName || ''
    });
    setIsReviewModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-left space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Discover Experiences
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          All Garba & <span className="text-gradient-red">Cultural Events</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Browse Gujarat's biggest Garba nights, music concerts, and festive experiences across Ahmedabad. 100% verified passes with instant WhatsApp booking.
        </p>
      </div>

      {/* Catalog */}
      <EventsCatalog
        events={events}
        loading={loading}
        initialSearch={initialSearch}
        onBookClick={(e) => setSelectedEventForBooking(e)}
        onLayoutClick={(e) => setSelectedEventForLayout(e)}
      />

      {/* Modals */}
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

      <VenueLayoutModal
        event={selectedEventForLayout}
        isOpen={Boolean(selectedEventForLayout)}
        onClose={() => setSelectedEventForLayout(null)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        prefilledEventTitle={reviewPrefill.eventTitle}
        prefilledName={reviewPrefill.customerName}
      />
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-slate-100 selection:bg-rose-600 selection:text-white">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-gray-400">Loading Garba events...</div>}>
        <EventsContent />
      </Suspense>
      <FestiveSound />
      <Footer />
    </main>
  );
}

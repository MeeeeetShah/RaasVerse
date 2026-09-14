'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles } from 'lucide-react';

export default function VenueLayoutModal({ event, isOpen, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen || !event) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0d0e14] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Official Venue Map
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">{event.title} Layout</h3>
            <p className="text-xs text-gray-400">{event.venue || event.location || 'Ahmedabad, Gujarat'}</p>
          </div>

          {/* Zoom Controls & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Layout Image Display Area */}
        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 min-h-[350px]">
          <div
            className="transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={event.layoutImage || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop'}
              alt={`${event.title} Venue Layout`}
              width={800}
              height={500}
              className="rounded-xl object-contain max-h-[55vh] w-auto shadow-2xl border border-white/10"
            />
          </div>
        </div>

        {/* Legend Footer */}
        <div className="p-4 border-t border-white/10 bg-black/50 text-xs text-gray-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Main Orchestra & Stage</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>VIP & VVIP Lounges</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Food & Beverage Stalls</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
              <span>Sanitized Entry & Security</span>
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Use buttons above to zoom in/out</span>
        </div>
      </div>
    </div>
  );
}

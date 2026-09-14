'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Increment progress bar smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 120);

    const timer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, 1400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07070a] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-rose-600/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Logo wrap with glowing rings */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute -inset-4 rounded-full border border-rose-500/30 animate-ping opacity-25" />
        <div className="absolute -inset-2 rounded-full border border-amber-500/40 animate-pulse" />

        {/* Circular Logo Container */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-700 shadow-[0_0_40px_rgba(225,29,72,0.4)]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <Image
              src="/assets/logo.png"
              alt="RaasVerse Logo"
              width={140}
              height={140}
              priority
              className="object-cover w-full h-full scale-105"
            />
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <div className="text-center z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider">
          <span className="text-white">RAAS</span>
          <span className="text-rose-500 drop-shadow-[0_0_12px_rgba(225,29,72,0.8)]">VERSE</span>
        </h1>
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-amber-400/90 mt-2 font-medium">
          Navratri Passes • Events • Vibes
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden z-10 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-rose-600 via-amber-400 to-rose-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[11px] text-gray-400 tracking-widest mt-2 font-mono">
        LOADING EXPERIENCES...
      </span>
    </div>
  );
}

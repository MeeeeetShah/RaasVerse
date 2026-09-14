'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function FestiveSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Synthesize a subtle, festive dhol rhythm using Web Audio API
  const playDholBeat = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      let step = 0;
      const interval = 220; // rhythm tempo

      timerRef.current = setInterval(() => {
        const now = ctx.currentTime;

        // Base Dhol Dagga (Low boom)
        if (step % 4 === 0 || step % 4 === 2) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.19);
        }

        // High Click / Chapi (crisp tap)
        if (step % 2 === 1) {
          const oscHigh = ctx.createOscillator();
          const gainHigh = ctx.createGain();
          oscHigh.type = 'triangle';
          oscHigh.frequency.setValueAtTime(420, now);
          oscHigh.frequency.exponentialRampToValueAtTime(200, now + 0.08);

          gainHigh.gain.setValueAtTime(0.12, now);
          gainHigh.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

          oscHigh.connect(gainHigh);
          gainHigh.connect(ctx.destination);

          oscHigh.start(now);
          oscHigh.stop(now + 0.09);
        }

        step = (step + 1) % 8;
      }, interval);
    } catch (_) {}
  };

  const stopDholBeat = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopDholBeat();
      setIsPlaying(false);
    } else {
      playDholBeat();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopDholBeat();
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isPlaying
            ? 'bg-rose-600/90 border-rose-400 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] scale-105'
            : 'bg-black/70 border-white/15 text-gray-300 hover:text-white hover:border-white/30'
        }`}
        title={isPlaying ? 'Mute Garba Dhol Beat' : 'Play Garba Dhol Beat'}
        aria-label="Toggle festive sound"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-amber-300 h-full animate-pulse" />
              <span className="w-1 bg-white h-2/3 animate-bounce" />
              <span className="w-1 bg-amber-300 h-full animate-pulse" />
            </div>
            <span className="text-[11px] font-bold font-mono">Dhol Vibe</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-gray-400" />
            <span className="text-[11px] font-medium hidden sm:inline text-gray-300">Dhol Vibe</span>
          </>
        )}
      </button>
    </div>
  );
}

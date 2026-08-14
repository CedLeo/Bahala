'use client';

import { useState, useRef, useCallback } from 'react';
import { useFloodStore } from '@/lib/store';
import SOSConfirmation from './SOSConfirmation';
import SOSActivePanel from './SOSActivePanel';

export default function SOSButton() {
  const { sosAlert, activateSOS, cancelSOS } = useFloodStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = useCallback(() => {
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);
    }, 30);

    holdTimerRef.current = setTimeout(() => {
      setShowConfirmation(true);
      setHoldProgress(0);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }, duration);
  }, []);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  const handleConfirmSOS = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          activateSOS(position.coords.latitude, position.coords.longitude);
          setShowConfirmation(false);
        },
        () => {
          // Fallback: use a default Metro Manila location
          activateSOS(14.5995, 120.9842);
          setShowConfirmation(false);
        }
      );
    } else {
      activateSOS(14.5995, 120.9842);
      setShowConfirmation(false);
    }
  }, [activateSOS]);

  // If SOS is active, show active panel
  if (sosAlert && sosAlert.status === 'active') {
    return <SOSActivePanel sosAlert={sosAlert} onCancel={cancelSOS} />;
  }

  return (
    <>
      {/* SOS Hold Button */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className="relative w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-xl flex items-center justify-center text-white font-black text-sm transition-transform active:scale-95 select-none"
          aria-label="Emergency SOS - Press and hold for 2 seconds"
        >
          {/* Progress ring */}
          {holdProgress > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${(holdProgress / 100) * 176} 176`}
                opacity="0.8"
              />
            </svg>
          )}
          <span className="relative z-10">SOS</span>
        </button>
        <p className="text-xs text-slate-500 text-center mt-1.5 bg-white/80 rounded px-1.5 py-0.5 backdrop-blur-sm">
          Hold 2s
        </p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <SOSConfirmation
          onConfirm={handleConfirmSOS}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}

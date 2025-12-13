'use client';

import { useState, useEffect } from 'react';

export default function ChaosToggle() {
  const [isChaosMode, setIsChaosMode] = useState(false);

  useEffect(() => {
    // Check initial state from localStorage or default to false
    const chaosState = localStorage.getItem('chaosMode') === 'true';
    setIsChaosMode(chaosState);
    if (chaosState) {
      document.body.classList.add('chaos-mode');
    }
  }, []);

  const toggleChaos = () => {
    const newState = !isChaosMode;
    setIsChaosMode(newState);
    localStorage.setItem('chaosMode', String(newState));

    // Dispatch a custom event so ChaosManager can pick it up
    window.dispatchEvent(new CustomEvent('chaosModeChanged', { detail: { enabled: newState } }));

    if (newState) {
      document.body.classList.add('chaos-mode');
    } else {
      document.body.classList.remove('chaos-mode');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 hover:border-white/50 transition-colors">
      <span className={`text-xs font-bold uppercase tracking-widest ${isChaosMode ? 'text-yellow-400' : 'text-green-400'}`}>
        {isChaosMode ? 'CHAOS' : 'NORMAL'}
      </span>
      <button
        onClick={toggleChaos}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${isChaosMode ? 'bg-yellow-500 shadow-[0_0_10px_#FFFF00]' : 'bg-gray-600'
          }`}
        aria-label="Toggle Chaos Mode"
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isChaosMode ? 'translate-x-6' : 'translate-x-0'
            }`}
        />
      </button>
    </div>
  );
}

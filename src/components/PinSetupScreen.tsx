import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, Mic, Delete } from 'lucide-react';
import { encryptionService } from '../lib/services';

interface PinSetupScreenProps {
  onComplete: (pinHash: string) => void;
}

export function PinSetupScreen({ onComplete }: PinSetupScreenProps) {
  const [pin, setPin] = useState("");

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Set Your Security PIN</h2>
        <p className="text-slate-500 text-lg">Create a 4-digit code to protect your account.</p>
      </div>

      <div className="flex gap-6 mb-16 justify-center">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full transition-all duration-200 ${
              i < pin.length ? 'bg-blue-900 scale-110' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleKeypad(num.toString())}
            className="h-20 flex items-center justify-center bg-white rounded-2xl text-2xl font-bold text-slate-900 shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleDelete}
          className="h-20 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Delete size={32} className="text-slate-400" />
        </button>
        <button
          onClick={() => handleKeypad("0")}
          className="h-20 flex items-center justify-center bg-white rounded-2xl text-2xl font-bold text-slate-900 shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={() => pin.length === 4 && onComplete(encryptionService.hashPIN(pin))}
          className={`h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
            pin.length === 4 ? 'bg-blue-900 active:scale-95' : 'bg-slate-200 opacity-50'
          }`}
        >
          <ArrowRight size={32} className="text-white" />
        </button>
      </div>
    </div>
  );
}

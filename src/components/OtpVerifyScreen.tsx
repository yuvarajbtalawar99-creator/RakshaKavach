import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Mic, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface OtpVerifyScreenProps {
  mobile: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
}

export function OtpVerifyScreen({ mobile, onBack, onVerify }: OtpVerifyScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(45);
  const { isListening, transcript, startListening, speak } = useVoiceAssistant();

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (transcript) {
      const digits = transcript.replace(/\D/g, '');
      if (digits.length === 4) {
        setOtp(digits.split(''));
        speak(`Security code set to ${digits.split('').join(' ')}. Confirming.`);
        setTimeout(() => onVerify(digits), 1500);
      } else if (digits.length > 0) {
        const newOtp = [...otp];
        digits.split('').forEach((d, i) => {
          if (i < 4) newOtp[i] = d;
        });
        setOtp(newOtp);
      }
    }
  }, [transcript, speak, onVerify]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const val = value.slice(-1); // Take the last character if multiple are entered
    if (!/^\d*$/.test(val)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      // Auto-focus next input
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, move back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
      } else {
        // Just clear current (standard behavior, but we can force it)
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full pb-12">
      <div className="w-full flex justify-start mb-8">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full active:scale-95">
          <ArrowLeft className="text-blue-900" />
        </button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">Confirm your identity</h2>
        <p className="text-slate-500 text-lg">Enter the 4-digit code sent to +91 {mobile}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-12 w-full">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-full aspect-square bg-slate-100 border-none rounded-2xl text-center text-4xl font-bold focus:ring-2 focus:ring-blue-600 text-slate-900"
            maxLength={1}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-16 text-slate-500 bg-slate-100 px-6 py-3 rounded-full">
        <Timer size={20} />
        <span className="font-medium">Resend code in 00:{timer.toString().padStart(2, '0')}</span>
      </div>

      <div className="mb-12 flex flex-col items-center gap-4 relative">
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-16 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Loader2 className="animate-spin" size={20} />
              Listening...
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-200'}`}
        >
          <Mic size={32} className={isListening ? 'text-white' : 'text-blue-600'} fill="currentColor" />
        </button>
        <p className="text-blue-600 font-bold text-sm tracking-wide uppercase">
          {isListening ? "Speak now" : "TAP FOR VOICE HELP"}
        </p>
      </div>

      <button
        onClick={() => isComplete && onVerify(otp.join(''))}
        disabled={!isComplete}
        className={`w-full h-20 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all ${
          isComplete ? 'bg-blue-900 active:scale-95' : 'bg-slate-200 opacity-50'
        }`}
      >
        <span className="text-xl font-bold text-white tracking-wider">CONFIRM</span>
        <CheckCircle size={28} className="text-white" fill="currentColor" />
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Phone, ArrowRight, Mic, Delete, Loader2 } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface LoginScreenProps {
  onNext: (mobile: string) => void;
}

export function LoginScreen({ onNext }: LoginScreenProps) {
  const [mobile, setMobile] = useState("");
  const { isListening, transcript, startListening, speak } = useVoiceAssistant();

  useEffect(() => {
    if (transcript) {
      const digits = transcript.replace(/\D/g, '');
      if (digits.length === 10) {
        setMobile(digits);
        speak(`Mobile number set to ${digits.split('').join(' ')}. Is this correct?`);
      } else if (digits.length > 0) {
        setMobile(digits.slice(0, 10));
      }
    }
  }, [transcript, speak]);

  const handleKeypad = (num: string) => {
    if (mobile.length < 10) {
      setMobile(prev => prev + num);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  };

  const handleDelete = () => {
    setMobile(prev => prev.slice(0, -1));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full pb-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          What is your mobile number?
        </h1>
        <p className="text-slate-500 text-lg">
          We will send you a security code.
        </p>
      </div>

      <div className="w-full mb-12">
        <div className="bg-slate-100 h-20 rounded-2xl flex items-center px-6 border-2 border-transparent focus-within:border-blue-600 transition-all">
          <div className="flex items-center gap-2 mr-4 pr-4 border-r border-slate-300">
            <span className="text-2xl font-bold text-slate-900">+91</span>
          </div>
          <div className="text-3xl font-black tracking-widest text-slate-900">
            {mobile || "00000 00000"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleKeypad(num.toString())}
            className="h-20 bg-white rounded-2xl text-2xl font-extrabold text-slate-900 active:scale-95 active:bg-slate-50 transition-all shadow-sm border border-slate-100"
          >
            {num}
          </button>
        ))}
        <button onClick={handleDelete} className="h-20 flex items-center justify-center active:scale-95 transition-transform">
          <Delete size={32} className="text-slate-400" />
        </button>
        <button
          onClick={() => handleKeypad("0")}
          className="h-20 bg-white rounded-2xl text-2xl font-extrabold text-slate-900 active:scale-95 active:bg-slate-50 transition-all shadow-sm border border-slate-100"
        >
          0
        </button>
        <button
          onClick={() => mobile.length === 10 && onNext(mobile)}
          className={`h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${mobile.length === 10 ? 'bg-blue-600 active:scale-95' : 'bg-slate-200 opacity-50'}`}
        >
          <ArrowRight size={32} className="text-white" />
        </button>
      </div>

      <div className="flex flex-col items-center relative">
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-16 bg-teal-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Loader2 className="animate-spin" size={20} />
              Listening...
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mb-4 bg-slate-100 px-6 py-2 rounded-full">
          <p className="text-sm font-bold text-slate-600 tracking-wide uppercase">
            {isListening ? "Speak now" : "OR SPEAK YOUR NUMBER"}
          </p>
        </div>
        <button 
          onClick={startListening}
          className={`h-24 w-24 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-teal-600'}`}
        >
          <Mic size={48} fill="currentColor" className="text-white" />
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Contact, Mic, Delete, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface SendMoneyScreenProps {
  onBack: () => void;
  onSuccess: (details: any) => void;
}

export function SendMoneyScreen({ onBack, onSuccess }: SendMoneyScreenProps) {
  const [step, setStep] = useState(1);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const { isListening, transcript, startListening, speak } = useVoiceAssistant();

  useEffect(() => {
    if (transcript) {
      const digits = transcript.replace(/\D/g, '');
      if (step === 1) {
        if (digits.length === 10) {
          setReceiver(digits);
          speak(`Sending to ${digits.split('').join(' ')}. Is this correct?`);
        } else if (digits.length > 0) {
          setReceiver(digits.slice(0, 10));
        }
      } else {
        if (digits.length > 0) {
          setAmount(digits);
          speak(`Amount set to ${digits} rupees.`);
        }
      }
    }
  }, [transcript, step, speak]);

  const handleKeypad = (val: string) => {
    if (step === 1) {
      if (receiver.length < 10) setReceiver(prev => prev + val);
    } else {
      setAmount(prev => prev + val);
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  const handleDelete = () => {
    if (step === 1) setReceiver(prev => prev.slice(0, -1));
    else setAmount(prev => prev.slice(0, -1));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full active:scale-95">
          <ArrowLeft className="text-blue-900" />
        </button>
        <div className="px-4 py-2 bg-blue-100 text-blue-900 font-bold rounded-full text-sm">
          Step {step} of 2
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold leading-tight text-slate-900 mb-2">
          {step === 1 ? "Who are you sending money to?" : "How much money?"}
        </h2>
        <p className="text-slate-500 text-lg">
          {step === 1 ? "Enter a phone number or use your voice." : "Enter the amount to send."}
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        <div className="bg-slate-100 h-24 rounded-3xl px-8 flex items-center gap-4 border-2 border-transparent focus-within:border-blue-600 transition-all">
          {step === 1 ? <Contact className="text-slate-400" size={32} /> : <span className="text-3xl font-bold text-blue-600">₹</span>}
          <div className="text-3xl font-black tracking-widest text-slate-900">
            {step === 1 ? (receiver || "00000 00000") : (amount || "0")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleKeypad(num.toString())}
            className="h-20 bg-white rounded-2xl text-2xl font-extrabold text-slate-900 active:scale-95 transition-all shadow-sm border border-slate-100"
          >
            {num}
          </button>
        ))}
        <button onClick={handleDelete} className="h-20 flex items-center justify-center active:scale-95 transition-transform">
          <Delete size={32} className="text-slate-400" />
        </button>
        <button
          onClick={() => handleKeypad("0")}
          className="h-20 bg-white rounded-2xl text-2xl font-extrabold text-slate-900 active:scale-95 transition-all shadow-sm border border-slate-100"
        >
          0
        </button>
        <button
          onClick={() => {
            if (step === 1 && receiver.length === 10) setStep(2);
            else if (step === 2 && amount) onSuccess({ receiver, amount });
          }}
          className={`h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${((step === 1 && receiver.length === 10) || (step === 2 && amount)) ? 'bg-teal-600 active:scale-95' : 'bg-slate-200 opacity-50'}`}
        >
          <ArrowRight size={32} className="text-white" />
        </button>
      </div>

      <div className="flex flex-col items-center mt-auto pb-12 relative">
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
        <div className="mb-4 bg-slate-100 px-6 py-2 rounded-full">
          <p className="text-sm font-bold text-slate-600 tracking-wide uppercase">
            {isListening ? "Speak now" : "OR USE VOICE"}
          </p>
        </div>
        <button 
          onClick={startListening}
          className={`h-24 w-24 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`}
        >
          <Mic size={48} fill="currentColor" className="text-white" />
        </button>
      </div>
    </div>
  );
}

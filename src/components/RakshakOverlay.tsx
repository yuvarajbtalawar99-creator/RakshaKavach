import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Volume2 } from 'lucide-react';

interface RakshakOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: string;
  isListening: boolean;
}

export function RakshakOverlay({ isOpen, onClose, transcript, isListening }: RakshakOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between py-12 px-6"
        >
          <div className="flex flex-col items-center gap-8 w-full">
            <h2 className="text-white text-3xl font-black tracking-tight text-center">
              {isListening ? "Listening..." : "Rakshak is here"}
            </h2>
            
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute w-40 h-40 bg-blue-500/20 rounded-full blur-xl"
              />
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl">
                <Mic size={48} fill="currentColor" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 h-12">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isListening ? ["20%", "100%", "20%"] : "20%" }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  className="w-1.5 bg-blue-400 rounded-full"
                />
              ))}
            </div>
            
            {transcript && (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 max-w-sm">
                <p className="text-white text-xl font-bold text-center">"{transcript}"</p>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col gap-4 max-w-sm">
            <p className="text-white/60 text-center font-bold text-sm tracking-widest uppercase">Try saying</p>
            <div className="flex flex-col gap-3">
              {["Send 500 to Ramesh", "Check my balance", "Show my history"].map((cmd) => (
                <button
                  key={cmd}
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold text-lg text-center active:scale-95 transition-transform"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full max-w-xs bg-blue-700 text-white py-5 rounded-full font-black text-xl tracking-wide shadow-2xl active:scale-95 transition-transform"
          >
            CLOSE
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

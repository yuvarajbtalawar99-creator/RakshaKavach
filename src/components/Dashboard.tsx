import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, QrCode, History, ShieldAlert, Mic, Home, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface DashboardProps {
  onAction: (action: string) => void;
  onRakshak: () => void;
}

export function Dashboard({ onAction, onRakshak }: DashboardProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-8 max-w-2xl mx-auto w-full pb-32">
      {/* Balance Card */}
      <section className="flex flex-col items-center justify-center py-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[12px] border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-[12px] border-teal-600 border-t-transparent border-r-transparent -rotate-45"></div>
          
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="flex items-center gap-2 mb-2 bg-teal-50 px-4 py-1 rounded-full">
              <ShieldAlert size={16} className="text-teal-600" />
              <span className="text-teal-600 font-bold text-sm tracking-wider">SAFE</span>
            </div>
            <span className="text-4xl font-black text-slate-900">{formatCurrency(42850)}</span>
            <span className="text-slate-400 font-semibold text-sm">TOTAL BALANCE</span>
          </div>
        </div>
      </section>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold leading-tight text-slate-900">What would you like to do?</h1>
        <p className="text-slate-500 mt-2">Tap a box or speak your command</p>
      </div>

      <section className="grid grid-cols-2 gap-6 mb-10">
        <button 
          onClick={() => onAction('send')}
          className="flex flex-col items-center justify-center gap-4 bg-white p-8 h-56 rounded-3xl shadow-xl shadow-slate-200/50 active:scale-95 transition-all"
        >
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Send size={40} />
          </div>
          <span className="text-xl font-bold text-blue-600">Send Money</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-4 bg-white p-8 h-56 rounded-3xl shadow-xl shadow-slate-200/50 active:scale-95 transition-all">
          <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white">
            <QrCode size={40} />
          </div>
          <span className="text-xl font-bold text-teal-600">Receive</span>
        </button>

        <button 
          onClick={() => onAction('guardian')}
          className="flex flex-col items-center justify-center gap-4 bg-white p-8 h-56 rounded-3xl shadow-xl shadow-slate-200/50 active:scale-95 transition-all"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
            <History size={40} />
          </div>
          <span className="text-xl font-bold text-slate-900">Guardian Help</span>
        </button>

        <button className="flex flex-col items-center justify-center gap-4 bg-white p-8 h-56 rounded-3xl shadow-xl shadow-slate-200/50 active:scale-95 transition-all">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <AlertCircle size={40} />
          </div>
          <span className="text-xl font-bold text-red-600">Fraud Help</span>
        </button>
      </section>

      <div className="bg-slate-50 rounded-3xl p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
          <div className="flex items-end gap-1">
            <div className="w-1 h-3 bg-teal-600 rounded-full"></div>
            <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
            <div className="w-1 h-4 bg-teal-600 rounded-full"></div>
          </div>
        </div>
        <p className="text-lg font-semibold leading-snug text-slate-700">"Hey Rakshak, send 500 rupees to Ramesh."</p>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 bg-white border-t border-slate-100 shadow-2xl rounded-t-[3rem]">
        <button className="flex flex-col items-center justify-center bg-blue-900 text-white rounded-full p-6 scale-110 -translate-y-6 shadow-xl transition-all active:scale-95">
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Home</span>
        </button>
        
        <button 
          onClick={onRakshak}
          className="flex flex-col items-center justify-center text-slate-500 p-4 active:scale-95"
        >
          <Mic size={32} />
          <span className="text-[10px] font-bold uppercase mt-1">Voice</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-slate-500 p-4 active:scale-95">
          <ShieldAlert size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Help</span>
        </button>
      </nav>
    </div>
  );
}

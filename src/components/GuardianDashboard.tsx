import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, UserCheck, AlertCircle, Lock, Unlock, ArrowLeft } from 'lucide-react';

interface GuardianDashboardProps {
  onBack: () => void;
}

export function GuardianDashboard({ onBack }: GuardianDashboardProps) {
  const pendingApprovals = [
    { id: 1, user: "Father (Ramesh)", amount: 5000, time: "2 mins ago", risk: "Medium" }
  ];

  return (
    <div className="flex-1 flex flex-col px-6 pt-8 max-w-2xl mx-auto w-full pb-32">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full">
          <ArrowLeft className="text-blue-900" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Guardian Portal</h1>
      </div>

      <section className="mb-12">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Pending Approvals</h2>
        <div className="space-y-4">
          {pendingApprovals.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{app.user}</h3>
                  <p className="text-slate-500">Sending ₹{app.amount}</p>
                </div>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                  {app.risk} Risk
                </span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform">
                  Approve
                </button>
                <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold active:scale-95 transition-transform">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Controls</h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 bg-red-600 text-white p-6 rounded-3xl shadow-xl active:scale-95 transition-transform">
            <Lock size={32} />
            <span className="font-bold">Lock Account</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 bg-slate-100 text-slate-900 p-6 rounded-3xl active:scale-95 transition-transform">
            <UserCheck size={32} />
            <span className="font-bold">Trust Score: 98</span>
          </button>
        </div>
      </section>
    </div>
  );
}

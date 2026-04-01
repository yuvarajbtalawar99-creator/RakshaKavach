import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { OtpVerifyScreen } from './components/OtpVerifyScreen';
import { PinSetupScreen } from './components/PinSetupScreen';
import { Dashboard } from './components/Dashboard';
import { SendMoneyScreen } from './components/SendMoneyScreen';
import { GuardianDashboard } from './components/GuardianDashboard';
import { RakshakOverlay } from './components/RakshakOverlay';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from './lib/utils';

type Screen = 'login' | 'otp-verify' | 'pin-setup' | 'dashboard' | 'send' | 'success' | 'guardian';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [mobileNumber, setMobileNumber] = useState("");
  const [isRakshakOpen, setIsRakshakOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const { isListening, transcript, speak, startListening } = useVoiceAssistant();

  const handleLogin = (mobile: string) => {
    setMobileNumber(mobile);
    setCurrentScreen('otp-verify');
    speak("Sending security code to your mobile number.");
  };

  const handleOtpVerify = (otp: string) => {
    setCurrentScreen('pin-setup');
    speak("Identity confirmed. Please set your 4-digit security PIN.");
  };

  const handlePinComplete = (pinHash: string) => {
    setCurrentScreen('dashboard');
    speak("Namaste, Welcome to Rakshakavach. Your account is secure.");
  };

  const handleAction = (action: string) => {
    if (action === 'send') setCurrentScreen('send');
    if (action === 'guardian') setCurrentScreen('guardian');
  };

  const handleTransactionSuccess = (details: any) => {
    setLastTransaction(details);
    setCurrentScreen('success');
    speak(`Transaction of ${details.amount} rupees to ${details.receiver} was successful.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-700" size={28} />
          <span className="text-2xl font-black text-blue-900 tracking-tight">RAKSHAKAVACH</span>
        </div>
        <button 
          onClick={() => setIsLocked(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-bold tracking-wider active:scale-95 transition-transform"
        >
          SOS
        </button>
      </header>

      <main className="pt-24 min-h-screen flex flex-col">
        {isLocked && (
          <div className="fixed inset-0 z-[200] bg-red-600 flex flex-col items-center justify-center text-white p-6 text-center">
            <AlertTriangle size={120} className="mb-8" />
            <h1 className="text-5xl font-black mb-4">ACCOUNT LOCKED</h1>
            <p className="text-2xl mb-12">Please contact your guardian or use voice unlock.</p>
            <button 
              onContextMenu={(e) => { e.preventDefault(); setIsLocked(false); }}
              className="w-full max-w-xs bg-white text-red-600 py-6 rounded-full font-black text-xl shadow-2xl"
            >
              LONG PRESS TO UNLOCK
            </button>
          </div>
        )}
        {currentScreen === 'login' && <LoginScreen onNext={handleLogin} />}
        {currentScreen === 'otp-verify' && (
          <OtpVerifyScreen 
            mobile={mobileNumber} 
            onBack={() => setCurrentScreen('login')} 
            onVerify={handleOtpVerify} 
          />
        )}
        {currentScreen === 'pin-setup' && <PinSetupScreen onComplete={handlePinComplete} />}
        {currentScreen === 'dashboard' && (
          <Dashboard 
            onAction={handleAction} 
            onRakshak={() => {
              setIsRakshakOpen(true);
              startListening();
            }} 
          />
        )}
        {currentScreen === 'guardian' && <GuardianDashboard onBack={() => setCurrentScreen('dashboard')} />}
        {currentScreen === 'send' && (
          <SendMoneyScreen 
            onBack={() => setCurrentScreen('dashboard')} 
            onSuccess={handleTransactionSuccess}
          />
        )}
        {currentScreen === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-8">
              <CheckCircle size={80} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Sent Successfully</h1>
            <p className="text-xl text-slate-500 mb-12">
              Payment of {formatCurrency(Number(lastTransaction?.amount))} to {lastTransaction?.receiver} has been confirmed.
            </p>
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full max-w-xs bg-blue-900 text-white py-5 rounded-full font-bold text-xl shadow-xl active:scale-95 transition-transform"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>

      <RakshakOverlay 
        isOpen={isRakshakOpen} 
        onClose={() => setIsRakshakOpen(false)}
        transcript={transcript}
        isListening={isListening}
      />
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';

interface VoiceAssistantState {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
}

export function useVoiceAssistant() {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    transcript: '',
    isSpeaking: false,
  });

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Default to Hindi for rural context, fallback to English
    utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
    utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setState(prev => ({ ...prev, isListening: true }));
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setState(prev => ({ ...prev, transcript }));
    };
    recognition.onend = () => setState(prev => ({ ...prev, isListening: false }));
    recognition.start();
  }, []);

  return { ...state, speak, startListening };
}

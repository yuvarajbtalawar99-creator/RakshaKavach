import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Voice Authentication Service (Local Simulation)
export const voiceAuthService = {
  enroll: async (audioBlob: Blob) => {
    // In a real app, we'd extract MFCC features here using Web Audio API
    // For now, we simulate feature extraction
    const mockEmbedding = Array.from({ length: 128 }, () => Math.random());
    return mockEmbedding;
  },
  verify: async (audioBlob: Blob, storedEmbedding: number[]) => {
    // Simulate cosine similarity check
    const currentEmbedding = Array.from({ length: 128 }, () => Math.random());
    const similarity = 0.95; // Mock high similarity
    return similarity > 0.8;
  }
};

// Encryption Service (Client Side for sensitive UI data before sending to server)
import CryptoJS from 'crypto-js';

const CLIENT_SECRET = "client-side-secret-key";

export const encryptionService = {
  encrypt: (text: string) => {
    return CryptoJS.AES.encrypt(text, CLIENT_SECRET).toString();
  },
  decrypt: (ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, CLIENT_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  hashPIN: (pin: string) => {
    return CryptoJS.SHA256(pin).toString();
  }
};

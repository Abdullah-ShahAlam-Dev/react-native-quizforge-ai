// auth.service.js
// Data-flow rule: screens call THIS, not api.js directly.
// Mock mode is active. To switch to live backend, uncomment the api calls.

import api from '../../../api/api'; // imported and ready for production

// ─────────────────────────────────────────
//  MOCK: Login
// ─────────────────────────────────────────
export const loginUser = async (email, password) => {
  // ── PRODUCTION (uncomment when backend is ready) ──
  // const response = await api.post('/auth/login', { email, password });
  // return response.data; // { token, user }

  // ── MOCK ──
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email.includes('@') || password.length < 6) {
        reject(new Error('Invalid email or password (min 6 chars).'));
        return;
      }
      resolve({
        token: 'mock-jwt-token-xyz-98765',
        user:  { id: 'u_001', email, name: email.split('@')[0] },
      });
    }, 1200);
  });
};

// ─────────────────────────────────────────
//  MOCK: Register
// ─────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  // ── PRODUCTION ──
  // const response = await api.post('/auth/register', { name, email, password });
  // return response.data;

  // ── MOCK ──
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!name || !email.includes('@') || password.length < 6) {
        reject(new Error('Please fill all fields correctly.'));
        return;
      }
      resolve({
        token: 'mock-jwt-token-abc-11223',
        user:  { id: 'u_002', email, name },
      });
    }, 1400);
  });
};
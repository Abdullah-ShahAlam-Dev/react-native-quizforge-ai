// jwtHelper.js
// Pure-JS, zero-dependency helpers for encoding mock JWTs and decoding/validating
// real ones issued by your Python backend. No native crypto signing — sufficient
// for reading claims (exp, sub, email) out of any JWT.

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const base64UrlEncode = (str) => {
  let output = '';
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = i + 1 < str.length ? str.charCodeAt(i + 1) : NaN;
    const c = i + 2 < str.length ? str.charCodeAt(i + 2) : NaN;
    const triplet = (a << 16) | ((isNaN(b) ? 0 : b) << 8) | (isNaN(c) ? 0 : c);
    output += CHARS[(triplet >> 18) & 0x3f];
    output += CHARS[(triplet >> 12) & 0x3f];
    output += isNaN(b) ? '' : CHARS[(triplet >> 6) & 0x3f];
    output += isNaN(c) ? '' : CHARS[triplet & 0x3f];
  }
  return output.replace(/\+/g, '-').replace(/\//g, '_');
};

const base64UrlDecode = (str) => {
  let input = str.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  let output = '';
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '=') break;
    const index = CHARS.indexOf(c);
    if (index === -1) continue;
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return output;
};

// Builds a structurally-valid (but unsigned) JWT for mock/dev auth.
// Swap this out entirely once the real backend issues real signed tokens.
export const generateMockJWT = (payload, expiresInSeconds = 60 * 60 * 24) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const fakeSignature = base64UrlEncode('quizforge-mock-signature');
  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

// Decodes ANY JWT's payload (mock or real) without verifying the signature.
// Signature verification must happen on the backend — the frontend only
// needs to read claims like `exp` to decide whether to keep the session.
export const decodeJWT = (token) => {
  try {
    const payloadSegment = token.split('.')[1];
    const json = base64UrlDecode(payloadSegment);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};
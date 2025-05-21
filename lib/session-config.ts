import { SessionOptions } from 'iron-session';

// Ensure SESSION_SECRET is set, especially in production
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error(
    'SESSION_SECRET environment variable is not set. Please generate a secure random string (at least 32 characters long) and set it.'
  );
}

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
  cookieName: 'preview-session', // Choose a unique name
  // Secure: true should be used in production (HTTPS)
  // SameSite: 'strict' is recommended for security
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
};

// Define the shape of your session data
// This needs to be accessible by both edge and node runtimes
declare module 'iron-session' {
  interface IronSessionData {
    isAuthenticated?: boolean;
  }
}
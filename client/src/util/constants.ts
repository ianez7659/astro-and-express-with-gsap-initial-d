// Use environment variable in production, fallback to localhost for development
export const BASE_URL = 
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : ""; // Empty string means relative path, which works for Vercel's /api routes

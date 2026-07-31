// In-memory sliding-window rate limiter.
// No external dependencies — uses a Map keyed by IP address.
// Each entry stores an array of timestamps for recent requests.

const windowMs = 60 * 1000; // 1-minute window
const maxRequests = 5;      // max requests per window per IP

const hits = new Map(); // IP → [timestamp, timestamp, ...]

// Periodic cleanup to prevent unbounded memory growth
let lastCleanup = Date.now();
const cleanupInterval = 5 * 60 * 1000; // every 5 minutes

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < cleanupInterval) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [ip, timestamps] of hits) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      hits.delete(ip);
    } else {
      hits.set(ip, valid);
    }
  }
}

/**
 * Check if the given IP is within rate limits.
 * Returns { ok: true } if allowed, or { ok: false, retryAfterMs } if blocked.
 */
export function checkRateLimit(ip) {
  cleanup();
  const now = Date.now();
  const cutoff = now - windowMs;

  let timestamps = hits.get(ip) || [];
  // Keep only timestamps within the current window
  timestamps = timestamps.filter((t) => t > cutoff);

  if (timestamps.length >= maxRequests) {
    const oldestInWindow = timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { ok: false, retryAfterMs };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return { ok: true };
}

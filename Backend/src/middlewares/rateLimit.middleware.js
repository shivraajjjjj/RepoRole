const ANONYMOUS_DAILY_LIMIT = 2;
const anonymousUsage = new Map();

export function rateLimitForRoles(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    // Authenticated users are not subject to the anonymous daily limit here.
    if (token) return next();

    const key = getAnonymousUsageKey(req);
    const current = anonymousUsage.get(key) ?? 0;

    if (current >= ANONYMOUS_DAILY_LIMIT) {
      res.setHeader("X-RateLimit-Limit", String(ANONYMOUS_DAILY_LIMIT));
      res.setHeader("X-RateLimit-Remaining", "0");

      return res.status(429).json({
        success: false,
        message: "Anonymous daily role-analysis limit reached. Sign in to continue.",
      });
    }

    const nextCount = current + 1;
    anonymousUsage.set(key, nextCount);
    res.setHeader("X-RateLimit-Limit", String(ANONYMOUS_DAILY_LIMIT));
    res.setHeader("X-RateLimit-Remaining", String(ANONYMOUS_DAILY_LIMIT - nextCount));

    cleanupOldAnonymousUsage();
    return next();
  } catch (err) {
    return next(err);
  }
}

function getAnonymousUsageKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim() || req.ip || req.socket?.remoteAddress || "unknown";

  return `${getUtcDayKey()}:${ip}`;
}

function getUtcDayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cleanupOldAnonymousUsage() {
  const today = getUtcDayKey();

  for (const key of anonymousUsage.keys()) {
    if (!key.startsWith(`${today}:`)) {
      anonymousUsage.delete(key);
    }
  }
}

export default rateLimitForRoles;

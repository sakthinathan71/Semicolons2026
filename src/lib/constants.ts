// ─── App Constants ────────────────────────────────────────────────────────────
// Single source of truth for all magic strings and configuration values

/** The name of the primary (non-competitor) brand being monitored */
export const PRIMARY_BRAND = "Tata CLiQ Luxury";
export const PRIMARY_BRAND_LOWER = PRIMARY_BRAND.toLowerCase();

/** Maximum number of signals to retain in the live feed */
export const MAX_SIGNALS = 50;

/** Maximum number of AI recommendations to retain */
export const MAX_RECOMMENDATIONS = 5;

/** Simulation tick interval in milliseconds */
export const SIMULATION_INTERVAL_MS = 3_000;

/** Maximum signals sent to Gemini API per request (token budget) */
export const MAX_SIGNALS_PER_BRIEF = 15;

/** Gemini API request timeout in milliseconds */
export const GEMINI_TIMEOUT_MS = 20_000;

/** Rate limit window in milliseconds (1 minute) */
export const RATE_LIMIT_WINDOW_MS = 60_000;

/** Max API requests per IP per window */
export const RATE_LIMIT_MAX_REQUESTS = 100;

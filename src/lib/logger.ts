/**
 * Structured logger for LuxeLens AI.
 * Wraps console methods with log levels, timestamps, and context tagging.
 * In production, replace the console.* calls with your log aggregator SDK (e.g., Datadog, Pino).
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

const IS_PROD = process.env.NODE_ENV === "production";

function formatEntry(entry: LogEntry): string {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}`;
}

function log(level: LogLevel, context: string, message: string, data?: unknown) {
  // Suppress debug logs in production
  if (IS_PROD && level === "debug") return;

  const entry: LogEntry = {
    level,
    context,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "debug":
      console.debug(formatted, data ?? "");
      break;
    case "info":
      console.info(formatted, data ?? "");
      break;
    case "warn":
      console.warn(formatted, data ?? "");
      break;
    case "error":
      console.error(formatted, data ?? "");
      // TODO: Send to Sentry — Sentry.captureException(data instanceof Error ? data : new Error(message));
      break;
  }
}

/**
 * Creates a scoped logger for a specific module/component.
 * @example const logger = createLogger("IntelligenceContext");
 *          logger.info("Simulation started");
 */
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: unknown) => log("debug", context, message, data),
    info: (message: string, data?: unknown) => log("info", context, message, data),
    warn: (message: string, data?: unknown) => log("warn", context, message, data),
    error: (message: string, data?: unknown) => log("error", context, message, data),
  };
}

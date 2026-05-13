"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Component name for error context */
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches rendering errors in child component trees
 * and displays a graceful fallback UI instead of a blank screen.
 *
 * Wrap critical sections of the dashboard with this component.
 *
 * @example
 * <ErrorBoundary context="IntelligenceHub">
 *   <IntelligenceHub ... />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: Send to Sentry in production
    // Sentry.captureException(error, { extra: info });
    console.error(`[ErrorBoundary:${this.props.context ?? "Unknown"}]`, error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="glass p-10 rounded-[40px] border border-red-500/20 bg-red-500/[0.02] flex flex-col items-center justify-center min-h-[300px] text-center space-y-6"
        >
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {this.props.context ? `${this.props.context} encountered an error` : "Something went wrong"}
            </h3>
            <p className="text-sm text-white/40 max-w-md">
              This panel crashed unexpectedly. Your data is safe. Click below to reload this section.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mt-4 text-[10px] text-red-400/60 bg-red-500/5 p-3 rounded-xl text-left max-w-md overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Panel</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

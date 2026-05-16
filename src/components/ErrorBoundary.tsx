"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-12 bg-red-500/5 border border-red-500/20 rounded-[32px] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Something went wrong</h2>
              <p className="text-sm text-muted max-w-xs mx-auto">
                The intelligence engine encountered an unexpected error.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Retry Component</span>
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

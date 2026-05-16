"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
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
          <div className="glass rounded-[32px] p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Something went wrong</h2>
            <p className="text-muted text-sm mb-8 max-w-md mx-auto">
              Our intelligence systems encountered an unexpected error. This has been logged and we are investigating.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 bg-luxury-gold text-white px-6 py-3 rounded-full hover:bg-luxury-gold/90 transition-all font-bold uppercase text-[10px] tracking-widest"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restore Systems</span>
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

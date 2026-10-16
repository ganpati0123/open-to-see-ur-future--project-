import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error('Unhandled app error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080914] text-[#f5f0e7] flex items-center justify-center p-6 selection:bg-[#e6b967]/30 selection:text-[#f5f0e7]">
          <div className="max-w-md w-full border border-[#e6b967]/25 bg-[#111326]/90 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(89,55,181,0.25)]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#e6b967] font-medium">
              Open to See Your Future
            </span>
            <h1 className="mt-4 font-serif text-3xl text-[#f5f0e7]">
              Something went quietly off-course
            </h1>
            <p className="mt-3 text-sm text-[#a8a9bf] leading-relaxed">
              We encountered an unexpected moment. You can refresh or return safely to the home sanctum.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#e6b967] text-[#080914] text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-[#d8a74e]"
              >
                Refresh page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 border border-[#e6b967]/40 text-[#f5f0e7] text-xs uppercase tracking-wider rounded transition-colors hover:bg-[#e6b967]/10"
              >
                Return to studio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

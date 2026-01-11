import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-black/50 border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center backdrop-blur-xl">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">System Failure</h1>
            <p className="text-gray-400 mb-6">
              The cargo loading algorithm encountered a critical error.
            </p>
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6 text-left overflow-auto max-h-32">
              <code className="text-xs text-red-400 font-mono">
                {this.state.error?.message || 'Unknown Error'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 mx-auto transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
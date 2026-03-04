import React from 'react';
import Card from '../ui/Card';
import { SparklesIcon } from '../ui/Icon';

interface GeminiSummaryProps {
  summary: string | null;
  isLoading: boolean;
}

const GeminiSummary: React.FC<GeminiSummaryProps> = ({ summary, isLoading }) => {
  if (!summary && !isLoading) {
    return null;
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-sm border border-slate-700">
      <div className="flex items-center mb-3">
        <SparklesIcon className="w-6 h-6 text-purple-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">AI-Powered Budget Summary</h3>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-t-purple-500 border-slate-600 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-400">Analyzing your spending habits...</p>
        </div>
      ) : (
        <div className="text-slate-300 space-y-2 whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
            {summary}
        </div>
      )}
    </Card>
  );
};

export default GeminiSummary;

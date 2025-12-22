import { Loader2 } from 'lucide-react';

export interface ProgressState {
  stage: 'sending' | 'analyzing' | 'extracting' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
}

interface TranscriptProgressProps {
  progress: ProgressState;
}

const stageLabels = {
  sending: 'Sending to Claude...',
  analyzing: 'Analyzing transcript...',
  extracting: 'Extracting ideas...',
  saving: 'Saving to database...',
  complete: 'Complete!',
  error: 'Error',
};

export function TranscriptProgress({ progress }: TranscriptProgressProps) {
  const isComplete = progress.stage === 'complete';
  const isError = progress.stage === 'error';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        {!isComplete && !isError && (
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        )}
        <span className="text-sm font-medium text-gray-900">
          {stageLabels[progress.stage]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isError ? 'bg-red-500' : isComplete ? 'bg-green-500' : 'bg-gray-900'
          }`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Progress percentage and message */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{progress.message}</span>
        <span>{Math.round(progress.progress)}%</span>
      </div>
    </div>
  );
}

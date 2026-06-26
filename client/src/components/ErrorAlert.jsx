import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm">
      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <p className="flex-1 text-rose-200">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-rose-400 hover:text-rose-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

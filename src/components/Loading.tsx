import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loading({ fullPage = false, size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin text-primary ${className}`} />;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="Chargement..." />
    </div>
  );
}

export function LoadingButton() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Chargement...</span>
    </div>
  );
}

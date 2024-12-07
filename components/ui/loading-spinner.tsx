'use client';

export function LoadingSpinner() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
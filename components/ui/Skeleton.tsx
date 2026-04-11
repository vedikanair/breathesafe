export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}

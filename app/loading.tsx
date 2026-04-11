import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Skeleton className="w-64 h-16 mb-4" />
        <Skeleton className="w-96 h-6 mb-12" />
        <div className="flex gap-6">
          <Skeleton className="w-36 h-20 rounded-xl" />
          <Skeleton className="w-36 h-20 rounded-xl" />
          <Skeleton className="w-36 h-20 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

import Skeleton from "@/components/ui/Skeleton";

export default function ExploreLoading() {
  return (
    <main className="min-h-screen pt-12 px-6 max-w-7xl mx-auto">
      <Skeleton className="w-80 h-12 mb-2" />
      <Skeleton className="w-48 h-5 mb-8" />
      <Skeleton className="w-full h-14 rounded-xl mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </main>
  );
}

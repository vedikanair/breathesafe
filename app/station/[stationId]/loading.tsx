import Skeleton from "@/components/ui/Skeleton";

export default function StationLoading() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 pt-8 pb-24">
      <Skeleton className="w-48 h-4 mb-8" />
      <div className="flex gap-6 mb-10">
        <Skeleton className="w-48 h-32" />
        <div className="flex-1">
          <Skeleton className="w-64 h-8 mb-2" />
          <Skeleton className="w-40 h-5 mb-3" />
          <Skeleton className="w-56 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[340px] rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[200px] rounded-2xl" />
          <Skeleton className="h-[120px] rounded-2xl" />
          <Skeleton className="h-[250px] rounded-2xl" />
        </div>
      </div>
    </main>
  );
}

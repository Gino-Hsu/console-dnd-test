import { Skeleton } from "@/ui-components/skeleton";

export function SkeletonDemo() {
  return (
    <div className="container max-w-4xl py-12 px-8 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Skeleton</h1>
        <p className="text-lg text-muted-foreground">
          Use to show a placeholder while content is loading.
        </p>
      </div>

      <div className="p-10 border rounded-xl flex items-center justify-center min-h-[300px]">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

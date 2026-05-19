import { Badge } from "@/ui-components/badge";

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>

      <div className="flex items-center gap-2 border rounded-md p-4 bg-background">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-info"></span>
        </span>
        <span className="text-sm font-medium">系統狀態</span>
        <Badge variant="outline" className="ml-4">
          更新中
        </Badge>
      </div>
    </div>
  );
}

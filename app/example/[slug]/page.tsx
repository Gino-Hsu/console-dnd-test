import { COMPONENTS_LIST } from "@/ui-lib/components-data";
import { DemoRegistry } from "../_demos";

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const component = COMPONENTS_LIST.find((c) => c.slug === slug);

  if (!component) {
    return (
      <div className="container max-w-4xl py-12 px-8 mx-auto text-center">
        <h1 className="text-3xl font-bold">404 - 找不到此元件</h1>
        <p className="text-gray-600 mt-4">尋找的 slug: {slug}</p>
        <p className="text-gray-500 text-sm mt-2">
          可用的元件: {COMPONENTS_LIST.map((c) => c.slug).join(", ")}
        </p>
      </div>
    );
  }

  // 從名冊動態取得 Demo 元件
  const DemoContent = DemoRegistry[component.slug];

  return (
    <div className="container max-w-5xl py-12 px-8 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
        <p className="text-lg text-muted-foreground">{component.description}</p>
      </div>

      <div className="p-10 border rounded-xl flex items-center justify-center min-h-[400px] bg-muted/10 overflow-hidden relative">
        {DemoContent ? (
          <DemoContent />
        ) : (
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Demo 開發中...</p>
            <p className="text-sm text-muted-foreground/60">
              元件已安裝，但專屬展示畫面建置中
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-components/card";
import { Badge } from "@/ui-components/badge";
import { Button } from "@/ui-components/button";
import { Separator } from "@/ui-components/separator";

import { COMPONENTS_LIST } from "@/ui-lib/components-data";

function ColorSwatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-24 w-full rounded-md border shadow-sm flex items-end p-2"
        style={{ backgroundColor: `var(${variable})` }}
      ></div>
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{variable}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <main className="container max-w-6xl py-12 px-8 mx-auto space-y-24">
        {/* 1. Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 pt-12 pb-8">
          <Badge
            variant="outline"
            className="px-3 py-1 rounded-full bg-muted/50"
          >
            v1.0.0 Design System
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-balance">
            UI Primitive Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl text-balance">
            企業識別與 UI
            設計規範，融合品牌核心與現代化介面體驗，提供快速打造一致性網頁的基礎解決方案。
          </p>
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8">
              開始使用
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              查看元件
            </Button>
          </div>
        </section>

        <Separator />

        {/* 2. Architecture Stack Section */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Architecture Stack
            </h2>
            <p className="text-muted-foreground">
              基於現代化前端技術棧所建置的核心架構。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader>
                <CardTitle>Next.js 16</CardTitle>
                <CardDescription>
                  App Router, React Server Components
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader>
                <CardTitle>Tailwind CSS v4</CardTitle>
                <CardDescription>
                  CSS-first configuration, OKLCH colors
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader>
                <CardTitle>Shadcn UI</CardTitle>
                <CardDescription>
                  Radix UI primitives & accessible components
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* 3. Brand Essence & Interface Colors Section */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Colors System</h2>
            <p className="text-muted-foreground">
              品牌主色、介面輔助色與狀態色彩規範。
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">
              Brand Essence (品牌核心色彩)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <ColorSwatch name="Primary" variable="--primary" />
              <ColorSwatch name="Secondary" variable="--secondary" />
              <ColorSwatch name="Accent" variable="--accent" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">
              Interface States (介面狀態色彩)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <ColorSwatch name="Info" variable="--info" />
              <ColorSwatch name="Warning" variable="--warning" />
              <ColorSwatch name="Destructive" variable="--destructive" />
              <ColorSwatch name="Neutral" variable="--neutral" />
            </div>
          </div>
        </section>

        {/* 4. Foundation Section (Radius) */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Foundation</h2>
            <p className="text-muted-foreground">圓角、字體等基礎設計基石。</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div
              className="aspect-square bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              sm
            </div>
            <div
              className="aspect-square bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              md
            </div>
            <div
              className="aspect-square bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm shadow-xl ring-2 ring-ring ring-offset-2"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              Base / lg
            </div>
            <div
              className="aspect-square bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              xl
            </div>
            <div
              className="aspect-square bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm"
              style={{ borderRadius: "var(--radius-2xl)" }}
            >
              2xl
            </div>
          </div>
        </section>

        <Separator />

        {/* 5. Component Layout Grid */}
        <section className="space-y-8" id="components">
          <div className="space-y-2 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Components</h2>
              <p className="text-muted-foreground">
                已安裝並可使用的基礎 UI 元件清單。
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              {COMPONENTS_LIST.filter((c) => c.installed).length} Installed
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPONENTS_LIST.map((component) => {
              const cardContent = (
                <Card
                  className={`flex flex-col h-full transition-all hover:shadow-md hover:-translate-y-1 ${!component.installed && "opacity-60 grayscale-[0.5] hover:translate-y-0 hover:shadow-none bg-muted/50"}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      {component.name}
                    </CardTitle>
                    {component.installed ? (
                      <Badge
                        variant="default"
                        className="text-[10px] px-2 py-0"
                      >
                        Installed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 bg-background"
                      >
                        Pending
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-sm">
                      {component.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );

              if (component.installed) {
                return (
                  <Link
                    key={component.name}
                    href={`/example/${component.slug}`}
                    className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={component.name}
                  className="block h-full cursor-not-allowed"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

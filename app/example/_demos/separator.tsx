import { Separator } from "@/ui-components/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-components/card";

export function SeparatorDemo() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">水平分隔線</h3>
        <div>
          <p className="text-sm text-muted-foreground mb-4">上方內容</p>
          <Separator />
          <p className="text-sm text-muted-foreground mt-4">下方內容</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">在卡片中使用</h3>
        <Card>
          <CardHeader>
            <CardTitle>Section 1</CardTitle>
            <CardDescription>第一部分的描述</CardDescription>
          </CardHeader>
          <Separator />
          <CardHeader>
            <CardTitle>Section 2</CardTitle>
            <CardDescription>第二部分的描述</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">列表中的分隔</h3>
        <div className="space-y-3">
          <p className="text-sm">項目 1</p>
          <Separator />
          <p className="text-sm">項目 2</p>
          <Separator />
          <p className="text-sm">項目 3</p>
        </div>
      </div>
    </div>
  );
}

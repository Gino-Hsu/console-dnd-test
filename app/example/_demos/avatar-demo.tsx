import { Avatar, AvatarFallback, AvatarImage } from "@/ui-components/avatar";

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">正常圖片</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://broken-link.jpg" alt="Broken fallback" />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            User
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">文字 Fallback</span>
      </div>
    </div>
  );
}

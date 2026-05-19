import { Input } from "@/ui-components/input";
import { Label } from "@/ui-components/label";
import { Button } from "@/ui-components/button";

export function InputDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="picture">Upload Picture</Label>
        <Input id="picture" type="file" />
      </div>

      <div className="flex w-full items-center space-x-2">
        <Input type="email" placeholder="Subscribe to newsletter" />
        <Button type="submit">Subscribe</Button>
      </div>
    </div>
  );
}

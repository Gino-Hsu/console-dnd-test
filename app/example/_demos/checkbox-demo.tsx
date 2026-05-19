import { Checkbox } from "@/ui-components/checkbox";
import { Label } from "@/ui-components/label";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </Label>
      </div>

      <div className="items-top flex space-x-2">
        <Checkbox id="terms1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms1">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

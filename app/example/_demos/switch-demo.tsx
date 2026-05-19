import { Switch } from "@/ui-components/switch";
import { Label } from "@/ui-components/label";

export function SwitchDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>

      <div className="flex items-center space-x-2 opacity-50">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled">Disabled (Off)</Label>
      </div>
    </div>
  );
}

import { cn } from "@/lib/cn";
import { Slider } from "@/ui-components/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export function SliderDemo({ className, ...props }: SliderProps) {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-4">
        <span className="text-sm font-medium">Volume (Default)</span>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className={cn("w-full", className)}
          {...props}
        />
      </div>

      <div className="space-y-4">
        <span className="text-sm font-medium">
          Price Range (Multiple thumbs)
        </span>
        <Slider
          defaultValue={[25, 75]}
          max={100}
          step={1}
          className={cn("w-full", className)}
          {...props}
        />
      </div>
    </div>
  );
}

import Image from "next/image";
import { AspectRatio } from "@/ui-components/aspect-ratio";

export function AspectRatioDemo() {
  return (
    <div className="container max-w-4xl py-12 px-8 mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Aspect Ratio</h1>
        <p className="text-lg text-muted-foreground">
          Displays content within a desired ratio.
        </p>
      </div>

      <div className="p-10 border rounded-xl flex items-center justify-center min-h-[400px]">
        <div className="w-[450px]">
          <AspectRatio
            ratio={16 / 9}
            className="bg-muted overflow-hidden rounded-md"
          >
            <Image
              src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80"
              alt="Photo by Alvaro Pinot"
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}

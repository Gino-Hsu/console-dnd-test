import { Alert, AlertDescription, AlertTitle } from "@/ui-components/alert";
import { Terminal, AlertCircle } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/">
        <Button size="lg" variant="default">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}

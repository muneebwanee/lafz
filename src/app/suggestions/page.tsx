
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuggestionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 mb-24">
        <div className="container py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Share Your Ideas
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Have a suggestion or a feature request? We'd love to hear from you! Your feedback helps us make LAFZ better for everyone.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
                <div className="text-center">
                    <Github className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h2 className="text-2xl font-bold mt-4 font-headline">Submit an Issue on GitHub</h2>
                    <p className="text-muted-foreground mt-2 mb-6">
                        The best way to suggest a feature or report a bug is by creating an issue on our GitHub repository. This helps us track all feedback in one place.
                    </p>
                    <Link href="https://github.com/muneebwanee/lafz/issues/new" target="_blank" rel="noopener noreferrer">
                        <Button size="lg">
                            <Github className="mr-2 h-5 w-5" />
                            Create a GitHub Issue
                        </Button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </main>
      <Link href="/" passHref>
        <Button
            variant="outline"
            className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg z-50 p-0 flex items-center justify-center"
            aria-label="Back to Home"
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}

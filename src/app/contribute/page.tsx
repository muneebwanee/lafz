
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Github, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ContributePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 mb-24">
        <div className="container py-12 md:py-16">
          <div className="text-center mb-12">
             <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Heart className="h-16 w-16 text-primary" />
                </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Contribute to LAFZ
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              LAFZ is an open-source project built with love by the community. We welcome contributions of all kinds, from code and documentation to word data and feedback.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
                <div className="text-center">
                    <Github className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h2 className="text-2xl font-bold mt-4 font-headline">Find us on GitHub</h2>
                    <p className="text-muted-foreground mt-2 mb-6">
                        Our entire project is hosted on GitHub. It's the best place to report issues, suggest features, or submit your own contributions.
                    </p>
                    <Link href="https://github.com/muneebwanee/lafz" target="_blank" rel="noopener noreferrer">
                        <Button size="lg">
                            <Github className="mr-2 h-5 w-5" />
                            View on GitHub
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

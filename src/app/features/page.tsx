
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, AlertTriangle, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Interactive Learning Paths',
      description: 'Follow guided paths for high-frequency words, unique roots, and word forms to build your knowledge systematically.',
    },
    {
      title: 'Spaced Repetition System (SRS)',
      description: 'An intelligent system to help you review words at the perfect time to maximize retention.',
    },
    {
      title: 'Gamification & Achievements',
      description: 'Earn points, badges, and unlock new levels to make learning more engaging and fun.',
      status: 'upcoming',
    },
    {
        title: 'Pronunciation Audio',
        description: 'Listen to the correct pronunciation for each word to improve your listening and speaking skills.',
        status: 'upcoming',
    },
    {
        title: 'Community Suggestions',
        description: 'A dedicated page for users to suggest new features and improvements.',
    },
    {
        title: 'Open Source & Contribution',
        description: 'LAFZ is built by the community. Find out how you can contribute on our dedicated contribute page.',
        icon: Heart,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 mb-24">
        <div className="container py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Features
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Discover the powerful tools designed to help you master the language of the Quran.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon || CheckCircle;
              return (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                   {(feature as any).status === 'upcoming' && (
                    <div className="mt-4">
                        <span className="text-xs font-semibold bg-primary/10 text-primary py-1 px-2 rounded-full">Upcoming</span>
                    </div>
                   )}
                </CardContent>
              </Card>
            )})}
          </div>

           <div className="mt-16 max-w-3xl mx-auto">
             <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimers</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                    <p>The word data, including meanings and examples, is sourced from community contributions and may contain inaccuracies. We are constantly working to verify and improve the dataset.</p>
                    <p>LAFZ is intended as a learning aid and is not a substitute for scholarly works or direct consultation with qualified teachers. Please use it as a tool to supplement your studies.</p>
                </AlertDescription>
             </Alert>
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


import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Interactive Learning Paths',
      description: 'Follow guided paths for high-frequency words, unique roots, and word forms to build your knowledge systematically.',
    },
    {
      title: 'Spaced Repetition System (SRS)',
      description: 'An intelligent system to help you review words at the perfect time to maximize retention.',
      status: 'upcoming',
    },
    {
      title: 'Gamification & Achievements',
      description: 'Earn points, badges, and unlock new levels to make learning more engaging and fun.',
      status: 'upcoming',
    },
    {
        title: 'Contextual Examples',
        description: 'See how each word is used in different verses of the Quran, with translations in multiple languages.',
    },
    {
        title: 'Pronunciation Audio',
        description: 'Listen to the correct pronunciation for each word to improve your listening and speaking skills.',
    },
    {
        title: 'Community Suggestions',
        description: 'A dedicated page for users to suggest new features and improvements.',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
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
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                   {feature.status === 'upcoming' && (
                    <div className="mt-4">
                        <span className="text-xs font-semibold bg-primary/10 text-primary py-1 px-2 rounded-full">Upcoming</span>
                    </div>
                   )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

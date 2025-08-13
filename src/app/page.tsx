
"use client";

import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { words } from '@/data/words';
import { ArrowRight, BookOpenIcon, Zap, Gem, Layers } from 'lucide-react';
import type { Word } from '@/types';

export default function Home() {

  const highFrequencyWords = words.filter(w => w.category === 'high-frequency');
  const uniqueRoots = words.filter(w => w.category === 'unique-root');
  const uniqueWordForms = words.filter(w => w.category === 'unique-word-form');

  const highFrequencyLevels = Array.from(new Set(highFrequencyWords.map(w => w.level))).sort((a, b) => a - b);
  const uniqueRootLevels = Array.from(new Set(uniqueRoots.map(w => w.level))).sort((a, b) => a - b);
  const uniqueWordFormLevels = Array.from(new Set(uniqueWordForms.map(w => w.level))).sort((a, b) => a - b);


  const JourneySection = ({ title, description, icon: Icon, words, levels }: { title: string, description: string, icon: React.ElementType, words: Word[], levels: number[] }) => (
    <section className="mb-16">
      <div className="text-center mb-12">
        <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl font-headline">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
          {description}
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-primary/20 -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {levels.map((level, index) => {
            const levelWords = words.filter(w => w.level === level);
            const wordCount = levelWords.length;
            
            return (
              <div key={level} className="relative flex items-center">
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg ring-4 ring-background">
                    {level}
                  </div>
                </div>

                <Card className={`w-full transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-24 bg-primary ${index % 2 === 0 ? 'rounded-l-lg' : 'rounded-r-lg order-2'}`}></div>
                    <div className="p-6 flex-1">
                      <h3 className="font-headline text-2xl font-semibold">Chapter {level}</h3>
                      <p className="text-muted-foreground">{wordCount} words</p>
                      <Link href={`/levels/${level}`} className="mt-4 inline-block">
                        <Button>
                          Begin Chapter <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <BookOpenIcon className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">
                Quranic Lexica
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Your Learning Journey
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Master the core words of the Quran, one chapter at a time.
            </p>
          </div>

          <JourneySection 
            title="High-Frequency Words"
            description="Focus on the most common ~400 words. Recognize and understand ~80% of the words you see on any page. You will get the general gist of most verses."
            icon={Zap}
            words={highFrequencyWords}
            levels={highFrequencyLevels}
          />
          
          <JourneySection 
            title="Unique Roots"
            description="Master ~1,800 unique roots. Unlock a deep and comprehensive understanding of the entire Quranic vocabulary. This is the long-term goal for mastery."
            icon={Gem}
            words={uniqueRoots}
            levels={uniqueRootLevels}
          />

          <JourneySection 
            title="Unique Word Forms"
            description="The technical total, but not a practical number for a learner to focus on. This section is for advanced learners."
            icon={Layers}
            words={uniqueWordForms}
            levels={uniqueWordFormLevels}
          />

        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-center gap-4 h-24 md:flex-row">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} Quranic Lexica. Built with purpose.
          </p>
        </div>
      </footer>
    </div>
  );
}

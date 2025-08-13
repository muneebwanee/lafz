
"use client";

import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { words } from '@/data/words';
import { ArrowRight, BookOpenIcon, Zap, Gem, Layers } from 'lucide-react';
import type { Word } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Home() {

  const highFrequencyWords = words.filter(w => w.category === 'high-frequency');
  const uniqueRoots = words.filter(w => w.category === 'unique-root');
  const uniqueWordForms = words.filter(w => w.category === 'unique-word-form');

  const getChaptersForCategory = (wordsInCategory: Word[]) => {
    const chapters = wordsInCategory.reduce((acc, word) => {
      if (!acc[word.chapter]) {
        acc[word.chapter] = [];
      }
      acc[word.chapter].push(word);
      return acc;
    }, {} as Record<string, Word[]>);
  
    return Object.entries(chapters).map(([chapterName, words]) => ({
      name: chapterName,
      wordCount: words.length,
      level: words[0].level // Use the level of the first word for the link
    }));
  };

  const highFrequencyChapters = getChaptersForCategory(highFrequencyWords);
  const uniqueRootChapters = getChaptersForCategory(uniqueRoots);
  const uniqueWordFormChapters = getChaptersForCategory(uniqueWordForms);


  const JourneySection = ({ chapters }: { chapters: { name: string, wordCount: number, level: number }[] }) => (
    <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-primary/20 -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {chapters.map(({ name, wordCount, level }, index) => {
            return (
              <div key={name} className="relative flex items-center">
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg ring-4 ring-background">
                    {index + 1}
                  </div>
                </div>

                <Card className={`w-full transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="flex items-center">
                    <div className={`w-2 h-24 bg-primary ${index % 2 === 0 ? 'rounded-l-lg' : 'rounded-r-lg order-2'}`}></div>
                    <div className="p-6 flex-1">
                      <h3 className="font-headline text-2xl font-semibold">{name}</h3>
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

          <Accordion type="multiple" className="w-full max-w-4xl mx-auto space-y-8" defaultValue={['item-1']}>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left bg-card p-6 rounded-lg shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out hover:no-underline hover:-translate-y-1">
                    <div className="flex items-center space-x-6">
                        <Icon icon={Zap} />
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl font-headline">
                                High-Frequency Words
                            </h2>
                            <p className="mt-2 text-md text-muted-foreground">
                                Focus on the most common ~400 words. Recognize and understand ~80% of the words you see on any page. You will get the general gist of most verses.
                            </p>
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="pt-8">
                <JourneySection 
                  chapters={highFrequencyChapters}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-left bg-card p-6 rounded-lg shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out hover:no-underline hover:-translate-y-1">
                    <div className="flex items-center space-x-6">
                        <Icon icon={Gem} />
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl font-headline">
                                Unique Roots
                            </h2>
                            <p className="mt-2 text-md text-muted-foreground">
                                Master ~1,800 unique roots. Unlock a deep and comprehensive understanding of the entire Quranic vocabulary. This is the long-term goal for mastery.
                            </p>
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="pt-8">
                 <JourneySection 
                  chapters={uniqueRootChapters}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b-0">
                 <AccordionTrigger className="text-left bg-card p-6 rounded-lg shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out hover:no-underline hover:-translate-y-1">
                    <div className="flex items-center space-x-6">
                        <Icon icon={Layers} />
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl font-headline">
                                Unique Word Forms
                            </h2>
                            <p className="mt-2 text-md text-muted-foreground">
                                The technical total, but not a practical number for a learner to focus on. This section is for advanced learners.
                            </p>
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="pt-8">
                 <JourneySection 
                  chapters={uniqueWordFormChapters}
                />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

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

const Icon = ({ icon: IconComponent }: { icon: React.ElementType }) => (
    <div className="flex items-center justify-center rounded-lg bg-primary/10 p-3 h-12 w-12 flex-shrink-0">
        <IconComponent className="h-6 w-6 text-primary" />
    </div>
);

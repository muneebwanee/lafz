
"use client";

import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { words } from '@/data/words';
import { ArrowRight, BookOpenIcon, Zap, Gem, Shield } from 'lucide-react';

const levelIcons = {
  easy: <Zap className="h-8 w-8 text-green-500" />,
  medium: <Gem className="h-8 w-8 text-blue-500" />,
  hard: <Shield className="h-8 w-8 text-red-500" />,
};

export default function Home() {

  const levels = ['easy', 'medium', 'hard'];

  const getLevelStats = (level: string) => {
    return words.filter(word => word.difficulty === level).length;
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
              Your Learning Journey
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Select a level to begin mastering the core words of the Quran.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {levels.map(level => (
              <Card key={level} className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4">
                  {levelIcons[level as keyof typeof levelIcons]}
                  <div>
                    <CardTitle className="font-headline text-3xl">{capitalize(level)}</CardTitle>
                    <CardDescription>{getLevelStats(level)} words</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    {level === 'easy' && 'Start with the most common and foundational words.'}
                    {level === 'medium' && 'Build upon your foundation with more nuanced words.'}
                    {level === 'hard' && 'Challenge yourself with less frequent and complex words.'}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/levels/${level}`} className="w-full">
                    <Button className="w-full">
                      Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
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

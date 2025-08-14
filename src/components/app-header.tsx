
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpenText, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export function AppHeader() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/muneebwanee/tafheem')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(e => console.error("Failed to fetch stars", e));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">
            LAFZ
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <a href="https://github.com/muneebwanee/tafheem" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Star on GitHub
                    {stars !== null ? (
                        <span className="text-xs text-muted-foreground font-bold tabular-nums">({stars})</span>
                    ) : (
                        <Skeleton className="w-8 h-4 rounded-md" />
                    )}
                </Button>
            </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

    

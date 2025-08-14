
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpenText, Star, Gem } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const USER_POINTS_STORAGE_KEY = 'lafz-user-points';

export function AppHeader() {
  const [stars, setStars] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    // Fetch GitHub stars
    fetch('https://api.github.com/repos/muneebwanee/lafz')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(e => console.error("Failed to fetch stars", e));

    // Load points from local storage
    try {
        const storedPoints = localStorage.getItem(USER_POINTS_STORAGE_KEY);
        setPoints(storedPoints ? parseInt(storedPoints, 10) : 0);
    } catch (error) {
        console.error("Failed to load points from localStorage", error);
        setPoints(0);
    }
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === USER_POINTS_STORAGE_KEY && e.newValue) {
            setPoints(parseInt(e.newValue, 10));
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
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
            {points !== null && (
                 <div className="flex items-center gap-2 bg-accent/10 text-accent font-bold py-2 px-3 rounded-lg text-sm">
                    <Gem className="h-4 w-4" />
                    <span className="tabular-nums">{points}</span>
                </div>
            )}
            <a href="https://github.com/muneebwanee/lafz" target="_blank" rel="noopener noreferrer">
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

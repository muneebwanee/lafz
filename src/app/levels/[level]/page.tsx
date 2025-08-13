
"use client";

import { useState, useMemo } from 'react';
import { WordCard } from '@/components/word-card';
import { words } from '@/data/words';
import type { Word } from '@/types';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, BookOpenIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LevelPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level, 10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const levelWords = useMemo(() => words.filter(word => word.level === level), [level]);

  // We need to manage learned state for each word on this page
  const [learnedWords, setLearnedWords] = useState<Record<number, boolean>>({});

  const handleLearnedChange = (wordId: number, learned: boolean) => {
    setLearnedWords(prev => ({ ...prev, [wordId]: learned }));
  };

  const filteredWords = levelWords.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.meanings.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.arabic.includes(searchTerm)
  );

  const learnedCount = Object.values(learnedWords).filter(Boolean).length;
  const progressPercentage = levelWords.length > 0 ? (learnedCount / levelWords.length) * 100 : 0;
  
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
          <div className="mb-8">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning Journey
            </Link>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
                    Chapter {level}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                    Master these {levelWords.length} words to advance your learning.
                </p>
            </div>
            <div className="mt-8 max-w-xl mx-auto">
                <div className='flex items-center gap-4'>
                    <Progress value={progressPercentage} className="w-full h-3" />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{learnedCount} / {levelWords.length}</span>
                </div>
            </div>
          </div>
          <div className="mb-12 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search this chapter..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredWords.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWords.map(word => (
                <WordCard 
                  key={word.id} 
                  word={word}
                  isLearned={!!learnedWords[word.id]}
                  onLearnedChange={(learned) => handleLearnedChange(word.id, learned)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No words found. Try a different search term.
            </div>
          )}
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

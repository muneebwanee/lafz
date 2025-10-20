
"use client";

import { useState, useMemo, useEffect } from 'react';
import { WordCard } from '@/components/word-card';
import { words } from '@/data/words';
import type { Word } from '@/types';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';

export const runtime = 'edge';

const LEARNED_WORDS_STORAGE_KEY = 'lafz-learned-words';
const USER_POINTS_STORAGE_KEY = 'lafz-user-points';

export default function LevelPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level, 10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const levelWords = useMemo(() => words.filter(word => word.level === level), [level]);
  const maxLevel = useMemo(() => Math.max(...words.map(w => w.level)), []);

  const [learnedWords, setLearnedWords] = useState<Record<number, number>>({});
  const [userPoints, setUserPoints] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedLearnedWords = localStorage.getItem(LEARNED_WORDS_STORAGE_KEY);
      if (storedLearnedWords) {
        setLearnedWords(JSON.parse(storedLearnedWords));
      }
      const storedPoints = localStorage.getItem(USER_POINTS_STORAGE_KEY);
      if (storedPoints) {
        setUserPoints(parseInt(storedPoints, 10));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  const handleLearnedChange = (wordId: number, learned: boolean) => {
    const newLearnedWords = { ...learnedWords };
    if (learned) {
      newLearnedWords[wordId] = Date.now();
    } else {
      delete newLearnedWords[wordId];
    }
    setLearnedWords(newLearnedWords);

    const pointsChange = learned ? 10 : -10;
    const newPoints = Math.max(0, userPoints + pointsChange);
    setUserPoints(newPoints);
    
    try {
      localStorage.setItem(LEARNED_WORDS_STORAGE_KEY, JSON.stringify(newLearnedWords));
      localStorage.setItem(USER_POINTS_STORAGE_KEY, newPoints.toString());
      window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_STORAGE_KEY, newValue: newPoints.toString() }));
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
  };
  
  const filteredWords = levelWords.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.meanings.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.arabic.includes(searchTerm)
  );

  const learnedCount = levelWords.filter(word => learnedWords[word.id]).length;
  const progressPercentage = levelWords.length > 0 ? (learnedCount / levelWords.length) * 100 : 0;
  
  const chapterName = levelWords.length > 0 ? levelWords[0].chapter : '';
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 mb-24">
        <div className="container py-8 md:py-12">
          <div className="mb-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
                    {chapterName || `Chapter ${level}`}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                    Master these {levelWords.length} words to advance your learning.
                </p>
            </div>
            <div className="mt-8 max-w-xl mx-auto">
                <div className='flex items-center gap-4'>
                    <Progress value={progressPercentage} className="w-full h-3" variant="accent" />
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
            <div className="text-center text-muted-foreground py-16">
              <p>No words found for your search.</p>
              <p className="text-sm">Try a different term or clear the search.</p>
            </div>
          )}

          {level < maxLevel && (
            <div className="mt-16 text-center">
              <Link href={`/levels/${level + 1}`}>
                <Button size="lg" variant="default">
                  Next Chapter <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Link href="/" passHref>
        <Button
            variant="outline"
            className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg z-50 p-0 flex items-center justify-center"
            aria-label="Back to Learning Journey"
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}

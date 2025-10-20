
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { words } from '@/data/words';
import { ArrowRight, BookOpenText, Zap, Gem, Layers, AlertTriangle, Search, X, BrainCircuit } from 'lucide-react';
import type { Word } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { WordCard } from '@/components/word-card';
import { AppHeader } from '@/components/app-header';

const LEARNED_WORDS_STORAGE_KEY = 'lafz-learned-words';
const USER_POINTS_STORAGE_KEY = 'lafz-user-points';
const REVIEW_INTERVAL_DAYS = 7;

export default function Home() {
  const { theme } = useTheme();
  const [learnedWords, setLearnedWords] = useState<Record<number, number>>({});
  const [userPoints, setUserPoints] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [loadingChapter, setLoadingChapter] = useState<number | null>(null);
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

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === LEARNED_WORDS_STORAGE_KEY && e.newValue) {
            setLearnedWords(JSON.parse(e.newValue));
        }
        if (e.key === USER_POINTS_STORAGE_KEY && e.newValue) {
            setUserPoints(parseInt(e.newValue, 10));
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      const results = words.filter(word =>
        word.word.toLowerCase().includes(term.toLowerCase()) ||
        word.meanings.english.toLowerCase().includes(term.toLowerCase()) ||
        word.arabic.includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
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

  const highFrequencyWords = useMemo(() => words.filter(w => w.category === 'high-frequency'), []);
  const uniqueRoots = useMemo(() => words.filter(w => w.category === 'unique-root'), []);
  const uniqueWordForms = useMemo(() => words.filter(w => w.category === 'unique-word-form'), []);
  
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
      words: words,
      level: words[0].level
    }));
  };

  const highFrequencyChapters = useMemo(() => getChaptersForCategory(highFrequencyWords), [highFrequencyWords]);
  const uniqueRootChapters = useMemo(() => getChaptersForCategory(uniqueRoots), [uniqueRoots]);
  const uniqueWordFormChapters = useMemo(() => getChaptersForCategory(uniqueWordForms), [uniqueWordForms]);

  const calculateProgress = (words: Word[]) => {
    if (words.length === 0) return { count: 0, total: 0, percentage: 0 };
    const learnedCount = words.filter(w => learnedWords[w.id]).length;
    return {
        count: learnedCount,
        total: words.length,
        percentage: (learnedCount / words.length) * 100
    };
  };

  const wordsForReview = useMemo(() => {
    const now = Date.now();
    const reviewCutoff = now - REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
    return words.filter(word => learnedWords[word.id] && learnedWords[word.id] < reviewCutoff);
  }, [learnedWords]);

  const highFrequencyProgress = useMemo(() => calculateProgress(highFrequencyWords), [highFrequencyWords, learnedWords]);
  const uniqueRootsProgress = useMemo(() => calculateProgress(uniqueRoots), [uniqueRoots, learnedWords]);
  const uniqueWordFormsProgress = useMemo(() => calculateProgress(uniqueWordForms), [uniqueWordForms, learnedWords]);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  const JourneySection = ({ chapters }: { chapters: { name: string, words: Word[], level: number }[] }) => (
    <div className="relative max-w-4xl mx-auto py-8">
      <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
  
      <div className="space-y-12">
        {chapters.map(({ name, words, level }, index) => {
          const chapterProgress = calculateProgress(words);
          return (
            <div key={name} className="relative flex items-start">
              <div className="absolute left-6 -translate-x-1/2 z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg ring-4 ring-background transition-all duration-300 group-hover:scale-110">
                  {index + 1}
                </div>
              </div>
  
              <div className="w-full ml-20">
                  <Card className={`w-full transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1`}>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl font-semibold text-foreground">{name}</CardTitle>
                      <p className="text-muted-foreground">{words.length} words</p>
                    </CardHeader>
                    <CardContent>
                      <div className="my-4">
                        <div className="flex justify-between items-center mb-1 flex-wrap gap-x-2">
                          <span className="text-xs font-semibold text-primary">Progress</span>
                          <span className="text-xs font-semibold text-primary">{chapterProgress.count} / {chapterProgress.total}</span>
                        </div>
                        <Progress value={chapterProgress.percentage} className="h-2" />
                      </div>
                      <Link href={`/levels/${level}`} className="mt-2 inline-block" onClick={() => setLoadingChapter(level)}>
                        <Button loading={loadingChapter === level}>
                          Begin Chapter <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  

  const AccordionTriggerWithProgress = ({ icon, title, progress }: { icon: React.ElementType, title: string, progress: { count: number, total: number, percentage: number } }) => (
     <AccordionTrigger className="text-left bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out hover:no-underline hover:-translate-y-1 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/20">
        <div className='w-full'>
            <div className="flex items-center space-x-6">
                <Icon icon={icon} />
                <div className='flex-1'>
                    <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl font-headline">
                        {title}
                    </h2>
                </div>
            </div>
            {progress.total > 0 && (
                <div className="mt-4 px-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-primary">Overall Progress</span>
                      <span className="text-sm font-semibold text-primary">{progress.count} / {progress.total}</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2 bg-secondary" />
                </div>
            )}
        </div>
    </AccordionTrigger>
  )

  const SearchResultsDisplay = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-center font-headline">
        Search Results
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        Found {searchResults.length} matching words for "{searchTerm}".
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {searchResults.map(word => (
          <WordCard
            key={word.id}
            word={word}
            isLearned={!!learnedWords[word.id]}
            onLearnedChange={(learned) => handleLearnedChange(word.id, learned)}
          />
        ))}
      </div>
    </div>
  );

  const ReviewZone = () => (
    <div className="mt-16 py-12 bg-secondary/50 rounded-xl">
        <div className="container">
            <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <BrainCircuit className="h-16 w-16 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl font-headline">
                    Review Zone
                </h2>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                    Time to reinforce your memory! Review these words you learned a while ago.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wordsForReview.slice(0, 3).map(word => (
                <WordCard
                    key={word.id}
                    word={word}
                    isLearned={!!learnedWords[word.id]}
                    onLearnedChange={(learned) => handleLearnedChange(word.id, learned)}
                />
                ))}
            </div>
        </div>
    </div>
  )

  return (
    <div className="relative flex flex-col min-h-screen bg-background isolate">
       <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-primary/10 to-transparent -z-10"></div>
      
      <AppHeader />

      <main className="flex-1 z-10 mb-24">
        <div className="container py-8 md:py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                    <BookOpenText className="h-16 w-16 text-primary" />
                </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl font-headline">
              Unlock the Language of the Quran
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Embark on a guided journey to master the core vocabulary of the Quran. Learn smarter, not harder, and unlock a deeper connection with every verse.
            </p>
          </div>

          <div className="mb-16 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for any word..."
                className="w-full pl-11 text-lg h-12"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                 <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => handleSearchChange({ target: { value: '' } } as any)}>
                    <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
          {searchTerm.length > 1 ? (
            <SearchResultsDisplay />
          ) : (
            <>
              {wordsForReview.length > 0 && <ReviewZone />}
              <Accordion type="multiple" className="w-full max-w-4xl mx-auto space-y-8 mt-16" defaultValue={['item-1']}>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTriggerWithProgress 
                        icon={Zap}
                        title="Essentials"
                        progress={highFrequencyProgress}
                    />
                  <AccordionContent className="pt-8">
                    <p className="text-md text-muted-foreground px-6 pb-8 max-w-2xl mx-auto text-center">
                        The essential first step. Master the 200+ words that make up a significant portion of the Quran's text. This will give you an instant and dramatic boost in comprehension.
                    </p>
                    <JourneySection 
                      chapters={highFrequencyChapters}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTriggerWithProgress
                        icon={Gem}
                        title="Roots"
                        progress={uniqueRootsProgress}
                    />
                  <AccordionContent className="pt-8">
                     <p className="text-md text-muted-foreground px-6 pb-8 max-w-2xl mx-auto text-center">
                       Go deeper by learning the 629 unique word roots. This will unlock a comprehensive understanding of the entire Quranic vocabulary and the rich connections between words. Mastering roots is the key to true fluency.
                    </p>
                     <JourneySection 
                      chapters={uniqueRootChapters}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b-0">
                     <AccordionTriggerWithProgress
                        icon={Layers}
                        title="Forms"
                        progress={uniqueWordFormsProgress}
                    />
                  <AccordionContent className="pt-8">
                     <div className="px-6 pb-8 max-w-3xl mx-auto space-y-6">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>A Note on Learning Methodology</AlertTitle>
                            <AlertDescription className="space-y-2 mt-2">
                               <p>This category demonstrates how a single root can blossom into many different words. While there are thousands of unique word forms in the Quran, memorizing them all individually is not an effective learning strategy.</p>
                               <p>The human mind learns through patterns. The true path to understanding all word forms is not by memorizing the {uniqueWordForms.length} individual forms, but by mastering the <strong>{uniqueRoots.length} unique roots (in the previous category)</strong> and their predictable patterns.</p>
                               <p className="font-semibold text-foreground">This section is provided to demonstrate the richness of the language and to allow you to see the root system in action. By studying these examples, you will see how a handful of roots can generate a wide array of vocabulary.</p>
                            </AlertDescription>
                        </Alert>
                     </div>
                     <JourneySection 
                      chapters={uniqueWordFormChapters}
                    />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

const Icon = ({ icon: IconComponent }: { icon: React.ElementType }) => (
    <div className="flex items-center justify-center rounded-lg bg-primary/10 p-3 h-16 w-16 flex-shrink-0">
        <IconComponent className="h-8 w-8 text-primary" />
    </div>
);


"use client";

import { useState } from 'react';
import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Volume2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from './ui/scroll-area';

interface WordCardProps {
    word: Word;
    isLearned: boolean;
    onLearnedChange: (learned: boolean) => void;
}

export function WordCard({ word, isLearned, onLearnedChange }: WordCardProps) {
    const [examples, setExamples] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"english" | "urdu" | "hinglish">("english");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleGetExamples = () => {
        setError(null);
        if (word.examples && word.examples[activeTab] && word.examples[activeTab].length > 0) {
            setExamples(word.examples[activeTab]);
            setIsDialogOpen(true);
        } else {
            setError("No examples available for this word in the selected language.");
        }
    };
    
    const handlePlayPronunciation = () => {
        if (word.pronunciationUrl) {
            setIsPlaying(true);
            const audio = new Audio(word.pronunciationUrl);
            audio.play();
            audio.onended = () => setIsPlaying(false);
        }
    };

    return (
        <>
            <Card className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${isLearned ? 'bg-accent/10 border-accent/50' : 'bg-card'}`}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className='flex-1'>
                            <CardTitle className="font-headline text-3xl mb-1">{word.word}</CardTitle>
                            <div className="flex justify-between items-center">
                                <CardDescription className="text-4xl text-right font-serif text-foreground/80">{word.arabic}</CardDescription>
                                {word.pronunciationUrl && (
                                    <Button onClick={handlePlayPronunciation} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" disabled={isPlaying}>
                                        <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pl-4">
                            <Label htmlFor={`learned-${word.id}`} className="text-sm text-muted-foreground">Learned</Label>
                            <Switch id={`learned-${word.id}`} checked={isLearned} onCheckedChange={onLearnedChange} aria-label="Mark as learned" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                        <Tabs defaultValue="english" className="w-full" onValueChange={(value) => setActiveTab(value as "english" | "urdu" | "hinglish")}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="english">English</TabsTrigger>
                                <TabsTrigger value="urdu">Urdu</TabsTrigger>
                                <TabsTrigger value="hinglish">Hinglish</TabsTrigger>
                            </TabsList>
                            <TabsContent value="english" className="mt-4 min-h-[60px] text-muted-foreground"><p>{word.meanings.english}</p></TabsContent>
                            <TabsContent value="urdu" className="mt-4 min-h-[60px] text-muted-foreground"><p className="text-right font-serif" dir="rtl">{word.meanings.urdu}</p></TabsContent>
                            <TabsContent value="hinglish" className="mt-4 min-h-[60px] text-muted-foreground"><p>{word.meanings.hinglish}</p></TabsContent>
                        </Tabs>
                        
                        {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
                    </div>

                    <div className="mt-6">
                         {word.examples && (
                            <Button onClick={handleGetExamples} variant="secondary" className="w-full">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Show Examples
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Contextual Examples for "{word.word}"</DialogTitle>
                  <DialogDescription>
                    These verses from the Quran show how the word is used in context.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-4 py-4">
                     <ul className="list-decimal list-inside text-muted-foreground space-y-3">
                         {examples.map((ex, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: `<span class="${activeTab === 'urdu' ? 'font-serif text-lg' : ''}">${ex}</span>` }} />
                        ))}
                     </ul>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
        </>
    );
}

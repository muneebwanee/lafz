
"use client";

import { useState } from 'react';
import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Volume2, BookText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface WordCardProps {
    word: Word;
    isLearned: boolean;
    onLearnedChange: (learned: boolean) => void;
}

export function WordCard({ word, isLearned, onLearnedChange }: WordCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPronunciation = () => {
        if (word.pronunciationUrl) {
            setIsPlaying(true);
            const audio = new Audio(word.pronunciationUrl);
            audio.play();
            audio.onended = () => setIsPlaying(false);
        }
    };

    return (
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
                    <Tabs defaultValue="english" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="english">English</TabsTrigger>
                            <TabsTrigger value="urdu">Urdu</TabsTrigger>
                            <TabsTrigger value="hinglish">Hinglish</TabsTrigger>
                        </TabsList>
                        <TabsContent value="english" className="mt-4 min-h-[60px] text-muted-foreground"><p>{word.meanings.english}</p></TabsContent>
                        <TabsContent value="urdu" className="mt-4 min-h-[60px] text-muted-foreground"><p className="text-right font-serif" dir="rtl">{word.meanings.urdu}</p></TabsContent>
                        <TabsContent value="hinglish" className="mt-4 min-h-[60px] text-muted-foreground"><p>{word.meanings.hinglish}</p></TabsContent>
                    </Tabs>
                </div>
                {word.examples && (
                    <div className="mt-4 flex justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <BookText className="mr-2 h-4 w-4" />
                                    Show Examples
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                <DialogTitle>Usage Examples for "{word.word}"</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                <Tabs defaultValue="english" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="english">English</TabsTrigger>
                                        <TabsTrigger value="urdu">Urdu</TabsTrigger>
                                        <TabsTrigger value="hinglish">Hinglish</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="english" className="mt-4 space-y-3">
                                        {word.examples?.english.map((ex, i) => <p key={i} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: ex }} />)}
                                    </TabsContent>
                                    <TabsContent value="urdu" className="mt-4 space-y-3">
                                        {word.examples?.urdu.map((ex, i) => <p key={i} className="text-muted-foreground text-right font-serif" dir="rtl" dangerouslySetInnerHTML={{ __html: ex }} />)}
                                    </TabsContent>
                                    <TabsContent value="hinglish" className="mt-4 space-y-3">
                                        {word.examples?.hinglish.map((ex, i) => <p key={i} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: ex }} />)}
                                    </TabsContent>
                                </Tabs>
                                </div>
                                <DialogClose />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

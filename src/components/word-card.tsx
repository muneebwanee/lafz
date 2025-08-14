
"use client";

import { useState } from 'react';
import type { Word } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { provideContextualExamples } from '@/ai/flows/provide-contextual-examples';
import type { ContextualExamplesInput, ContextualExamplesOutput } from '@/ai/flows/provide-contextual-examples';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from './ui/separator';

interface WordCardProps {
    word: Word;
    isLearned: boolean;
    onLearnedChange: (learned: boolean) => void;
}

export function WordCard({ word, isLearned, onLearnedChange }: WordCardProps) {
    const [examples, setExamples] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"english" | "urdu" | "hinglish">("english");

    const handleGetExamples = async () => {
        setIsLoading(true);
        setError(null);
        setExamples([]);
        try {
            const input: ContextualExamplesInput = {
                word: word.word,
                translationLanguage: activeTab,
            };
            const result: ContextualExamplesOutput = await provideContextualExamples(input);
            setExamples(result.examples);
        } catch (e) {
            setError("Failed to fetch examples. Please try again.");
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <Card className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${isLearned ? 'bg-accent/10 border-accent/50' : 'bg-card'}`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className='flex-1'>
                        <CardTitle className="font-headline text-3xl mb-1">{word.word}</CardTitle>
                        <CardDescription className="text-4xl text-right font-serif text-foreground/80">{word.arabic}</CardDescription>
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
                    
                    {(error || examples.length > 0) && <Separator className='my-4' />}

                    {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
                    
                    {examples.length > 0 && (
                        <div className="mt-4 space-y-2 text-sm">
                           <h4 className="font-semibold font-headline text-foreground">Contextual Examples:</h4>
                           <ul className="list-decimal list-inside text-muted-foreground space-y-2">
                               {examples.map((ex, i) => <li key={i}><span className={activeTab === 'urdu' ? 'font-serif' : ''}>{ex}</span></li>)}
                           </ul>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Button onClick={handleGetExamples} disabled={isLoading} variant="secondary" className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Show Examples
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

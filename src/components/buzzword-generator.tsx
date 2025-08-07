"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateBuzzwordResponse } from '@/ai/flows/generate-buzzword-response';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { getPrompts, savePrompt } from '@/services/prompt-service';
import { ScrollArea } from '@/components/ui/scroll-area';

export function BuzzwordGenerator() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedPrompts, setStoredPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoadingPrompts(true);
      const prompts = await getPrompts();
      setStoredPrompts(prompts);
      setIsLoadingPrompts(false);
    };
    fetchPrompts();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResponse('');
    setError(null);
    try {
      const result = await generateBuzzwordResponse({ prompt });
      setResponse(result.response);
      if (prompt.trim() !== '' && !storedPrompts.includes(prompt)) {
        await savePrompt(prompt);
        setStoredPrompts(prev => [...prev, prompt]);
      }
    } catch (e) {
      console.error("Error generating response:", e);
      setError("An error occurred while synergizing your request. Please recalibrate and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-primary/10">
      <CardHeader className="text-center p-8">
        <CardTitle className="text-4xl font-headline font-extrabold text-primary">
          Buzzword Bingo Bot
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground pt-2">
          Leverage next-gen AI to generate paradigm-shifting, buzzword-heavy responses.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <div className="grid w-full gap-4">
          <Textarea
            placeholder="Type your question to synergize your paradigm shift..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleGenerate();
              }
            }}
            rows={4}
            className="text-base rounded-lg focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Buzzwords'
            )}
          </Button>
        </div>
      </CardContent>
      {(isLoading || response || error) && (
        <CardFooter className="px-8 pb-8 flex flex-col items-start w-full">
            <h3 className="text-xl font-semibold font-headline text-primary mb-4">
              Synergized Response:
            </h3>
            <div className="w-full p-6 bg-secondary rounded-lg min-h-[120px] flex items-center justify-center">
              {isLoading && !response ? (
                <div className="space-y-3 w-full">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-secondary-foreground whitespace-pre-wrap leading-relaxed w-full">{response}</p>
              )}
            </div>
        </CardFooter>
      )}
       <CardFooter className="px-8 pb-8 flex flex-col items-start w-full">
         <h3 className="text-xl font-semibold font-headline text-primary mb-4">
           Previous Prompts
         </h3>
         <ScrollArea className="h-40 w-full rounded-md border p-4">
            {isLoadingPrompts ? (
                <div className="space-y-3 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : storedPrompts.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {storedPrompts.map((p, i) => (
                        <Button key={i} variant="outline" className="w-full justify-start text-left h-auto" onClick={() => setPrompt(p)}>
                            {p}
                        </Button>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center">No prompts saved yet.</p>
            )}
         </ScrollArea>
       </CardFooter>
    </Card>
  );
}

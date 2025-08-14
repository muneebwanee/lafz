
'use server';

/**
 * @fileOverview This file defines a Genkit flow to provide relevant examples from the Quran for a given word.
 *
 * - provideContextualExamples - A function that retrieves contextual examples for a Quranic word.
 * - ContextualExamplesInput - The input type for the provideContextualExamples function.
 * - ContextualExamplesOutput - The return type for the provideContextualExamples function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualExamplesInputSchema = z.object({
  word: z.string().describe('The Quranic word to find examples for.'),
  translationLanguage: z.enum(['english', 'urdu', 'hinglish']).default('english').describe('The language to translate the example to.')
});
export type ContextualExamplesInput = z.infer<typeof ContextualExamplesInputSchema>;

const ContextualExamplesOutputSchema = z.object({
  examples: z.array(z.string()).describe('An array of Quranic verses containing the word, translated to the specified language.'),
});
export type ContextualExamplesOutput = z.infer<typeof ContextualExamplesOutputSchema>;

export async function provideContextualExamples(input: ContextualExamplesInput): Promise<ContextualExamplesOutput> {
  return provideContextualExamplesFlow(input);
}

const provideContextualExamplesPrompt = ai.definePrompt({
  name: 'provideContextualExamplesPrompt',
  input: {schema: ContextualExamplesInputSchema},
  output: {schema: ContextualExamplesOutputSchema},
  prompt: `You are an expert in the Quran and Islamic studies.
  Your task is to provide relevant examples from the Quran for a given word, translated to a specific language.

  Word: {{{word}}}
  Translation Language: {{{translationLanguage}}}

  Provide a maximum of 3 examples. Each example should be a complete verse from the Quran that contains the word.
  Ensure the examples are relevant and provide context for understanding the word's usage.
  The examples should be translated into the specified language.
  Format the output as a JSON array of strings.

  Examples:
  `,
});

const provideContextualExamplesFlow = ai.defineFlow(
  {
    name: 'provideContextualExamplesFlow',
    inputSchema: ContextualExamplesInputSchema,
    outputSchema: ContextualExamplesOutputSchema,
  },
  async input => {
    const {output} = await provideContextualExamplesPrompt(input);
    return output!;
  }
);

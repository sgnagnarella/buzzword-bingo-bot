'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating buzzword-filled responses to user prompts.
 *
 * It includes:
 * - generateBuzzwordResponse: The main function to generate the buzzword response.
 * - GenerateBuzzwordResponseInput: The input type for the function.
 * - GenerateBuzzwordResponseOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBuzzwordResponseInputSchema = z.object({
  prompt: z.string().describe('The user prompt or question.'),
});
export type GenerateBuzzwordResponseInput = z.infer<typeof GenerateBuzzwordResponseInputSchema>;

const GenerateBuzzwordResponseOutputSchema = z.object({
  response: z.string().describe('The buzzword-filled response.'),
});
export type GenerateBuzzwordResponseOutput = z.infer<typeof GenerateBuzzwordResponseOutputSchema>;

export async function generateBuzzwordResponse(input: GenerateBuzzwordResponseInput): Promise<GenerateBuzzwordResponseOutput> {
  return generateBuzzwordResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBuzzwordResponsePrompt',
  input: {schema: GenerateBuzzwordResponseInputSchema},
  output: {schema: GenerateBuzzwordResponseOutputSchema},
  prompt: `You are a buzzword generator. Given the following prompt, generate a response filled with technical buzzwords and AI jargon. The response should sound impressive but doesn't need to directly answer the question. If the prompt is empty, generate a generic buzzword-filled statement.

Prompt: {{{prompt}}}

Response:`, 
});

const generateBuzzwordResponseFlow = ai.defineFlow(
  {
    name: 'generateBuzzwordResponseFlow',
    inputSchema: GenerateBuzzwordResponseInputSchema,
    outputSchema: GenerateBuzzwordResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

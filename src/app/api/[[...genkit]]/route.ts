/**
 * @fileoverview This file creates a Next.js API route that exposes all
 * Genkit flows defined in the application.
 */

// @ts-ignore
import { genkitNextHandler } from '@genkit-ai/next';

export const POST = genkitNextHandler();


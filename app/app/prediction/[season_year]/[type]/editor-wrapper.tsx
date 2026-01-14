import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditorClient } from './editor-client';
import type { PredictionWithItems } from '@/lib/types';

interface PageProps {
  params: Promise<{ season_year: string; type: string }>;
  searchParams: Promise<{ series?: string }>;
}

export async function EditorWrapper() {
  // Access params and searchParams via props
  // In the actual page component, Next.js passes these
  // For server component, we'll handle this differently
  return <EditorClient />;
}

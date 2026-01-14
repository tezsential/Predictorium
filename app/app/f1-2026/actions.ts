'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLatestUsers(seasonYear: number) {
  const supabase = await createClient();

  // Get latest unique users who have created/updated predictions for this season
  const { data, error } = await supabase
    .from('predictions')
    .select('user_id, updated_at, updated_by_email')
    .eq('season_year', seasonYear)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch latest users - query error:', error);
    return [];
  }

  if (!data) {
    console.error('Failed to fetch latest users - no data returned');
    return [];
  }

  console.log(`Found ${data.length} total predictions for season ${seasonYear}`);

  // Deduplicate by user_id, keeping the most recent, limit to 10
  const seen = new Set<string>();
  const uniqueUsers = data
    .filter((item) => {
      if (seen.has(item.user_id)) return false;
      seen.add(item.user_id);
      return true;
    })
    .slice(0, 10);

  console.log(`Found ${uniqueUsers.length} unique users`);

  return uniqueUsers.map((item) => ({
    userId: item.user_id,
    email: item.updated_by_email || `User ${item.user_id.substring(0, 8)}`,
    updatedAt: item.updated_at,
  }));
}

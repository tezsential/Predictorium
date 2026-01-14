'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getLockInfo } from '@/lib/lock';
import type { PredictionPayload, PredictionWithItems } from '@/lib/types';

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function loadPrediction(
  season_year: number,
  type: string,
  userId: string | null
): Promise<PredictionWithItems | null> {
  const supabase = await createClient();

  let targetUserId = userId;

  // If no userId provided, use current user
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    targetUserId = user.id;
  }

  // Fetch prediction
  const { data: prediction, error } = await supabase
    .from('predictions')
    .select('*, items:prediction_items(*)')
    .eq('user_id', targetUserId)
    .eq('season_year', season_year)
    .eq('type', type)
    .single();

  if (error || !prediction) {
    return null;
  }

  return prediction as PredictionWithItems;
}

export async function getUserEmail(userId: string | null): Promise<string> {
  const supabase = await createClient();

  let targetUserId = userId;

  // If no userId provided, use current user
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 'Unknown';
    return user.email || 'Unknown';
  }

  // For other users, fetch email from their most recent prediction
  const { data } = await supabase
    .from('predictions')
    .select('updated_by_email')
    .eq('user_id', targetUserId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  return data?.updated_by_email || `User ${targetUserId.substring(0, 8)}`;
}

export async function savePrediction(payload: PredictionPayload) {
  const { season_year, type, drivers, constructors } = payload;

  // Check lock
  const lockInfo = getLockInfo(season_year);
  if (lockInfo.locked) {
    return { error: 'Predictions are locked.' };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Auth error:', userError);
    return { error: 'Not authenticated.' };
  }

  // Upsert prediction
  const { data: prediction, error: predError } = await supabase
    .from('predictions')
    .upsert(
      {
        user_id: user.id,
        season_year,
        type,
        updated_at: new Date().toISOString(),
        updated_by_email: user.email,
      },
      { onConflict: 'user_id,season_year,type' }
    )
    .select()
    .single();

  if (predError || !prediction) {
    console.error('Prediction save error:', predError);
    return { error: `Failed to save prediction: ${predError?.message || 'Unknown error'}` };
  }

  // Delete old items
  const { error: deleteError } = await supabase.from('prediction_items').delete().eq('prediction_id', prediction.id);
  if (deleteError) {
    console.error('Delete items error:', deleteError);
  }

  // Insert new items
  const driverItems = drivers.map((name, index) => ({
    prediction_id: prediction.id,
    category: 'DRIVER' as const,
    name,
    rank: index + 1,
  }));

  const constructorItems = constructors.map((name, index) => ({
    prediction_id: prediction.id,
    category: 'CONSTRUCTOR' as const,
    name,
    rank: index + 1,
  }));

  const { error: itemsError } = await supabase
    .from('prediction_items')
    .insert([...driverItems, ...constructorItems]);

  if (itemsError) {
    console.error('Insert items error:', itemsError);
    return { error: `Failed to save items: ${itemsError?.message || 'Unknown error'}` };
  }

  revalidatePath(`/app/prediction/${season_year}/${type}`);
  return { success: true };
}

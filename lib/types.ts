export type PredictionType = 'PRIMARY' | 'WILD';
export type ItemCategory = 'DRIVER' | 'CONSTRUCTOR';

export interface Prediction {
  id: string;
  user_id: string;
  season_year: number;
  type: PredictionType;
  created_at: string;
  updated_at: string;
}

export interface PredictionItem {
  id: string;
  prediction_id: string;
  category: ItemCategory;
  name: string;
  rank: number;
}

export interface PredictionWithItems extends Prediction {
  items: PredictionItem[];
}

export interface OrderedLists {
  drivers: string[];
  constructors: string[];
}

export interface PredictionPayload {
  season_year: number;
  type: PredictionType;
  drivers: string[];
  constructors: string[];
}

export interface LockInfo {
  locked: boolean;
  cutoff: string; // ISO string for March 1st 00:00 Europe/Prague of the season
  lockedSince?: string; // when lock became active
}

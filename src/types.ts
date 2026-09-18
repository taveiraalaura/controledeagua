export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';
export type ClimateType = 'mild' | 'moderate' | 'hot';

export interface UserConfig {
  weightKg: number;
  activityLevel: ActivityLevel;
  climate: ClimateType;
  customGoalMl?: number;
  isConfigured: boolean;
}

export interface WaterLogEntry {
  id: string;
  amountMl: number;
  timestamp: number;
  timeStr: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  totalMl: number;
  goalMl: number;
  goalReached: boolean;
  entries: WaterLogEntry[];
}

export interface PlantStageInfo {
  stage: number; // 1 to 5
  name: string;
  description: string;
  minPercent: number;
  maxPercent: number;
}

import { DayRecord, UserConfig, WaterLogEntry } from '../types';
import { calculateDailyGoal } from './calculator';

const STORAGE_KEYS = {
  USER_CONFIG: 'hidrata_user_config',
  CURRENT_DAY: 'hidrata_current_day',
  HISTORY: 'hidrata_history',
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultConfig(): UserConfig {
  return {
    weightKg: 70,
    activityLevel: 'moderate',
    climate: 'moderate',
    isConfigured: false,
  };
}

export function loadUserConfig(): UserConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
    if (!raw) return getDefaultConfig();
    return JSON.parse(raw);
  } catch {
    return getDefaultConfig();
  }
}

export function saveUserConfig(config: UserConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving user config:', err);
  }
}

export function loadHistory(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveHistory(history: Record<string, DayRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving history:', err);
  }
}

export function getOrCreateTodayRecord(config: UserConfig): DayRecord {
  const today = getTodayDateString();
  const history = loadHistory();
  const expectedGoal = calculateDailyGoal(config.weightKg, config.activityLevel, config.climate);

  if (history[today]) {
    // If goal changed in config, keep record up-to-date
    const record = history[today];
    if (record.goalMl !== expectedGoal) {
      record.goalMl = expectedGoal;
      record.goalReached = record.totalMl >= expectedGoal;
      history[today] = record;
      saveHistory(history);
    }
    return record;
  }

  const newRecord: DayRecord = {
    date: today,
    totalMl: 0,
    goalMl: expectedGoal,
    goalReached: false,
    entries: [],
  };

  history[today] = newRecord;
  saveHistory(history);
  return newRecord;
}

export function addWaterEntry(
  entry: Omit<WaterLogEntry, 'id' | 'timestamp' | 'timeStr'>,
  config: UserConfig
): { todayRecord: DayRecord; isFirstTimeReached: boolean } {
  const today = getTodayDateString();
  const history = loadHistory();
  const record = history[today] || getOrCreateTodayRecord(config);

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const newEntry: WaterLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    amountMl: entry.amountMl,
    timestamp: Date.now(),
    timeStr: `${hours}:${minutes}`,
  };

  const prevReached = record.goalReached;
  record.entries.unshift(newEntry); // newest first
  record.totalMl += entry.amountMl;
  record.goalReached = record.totalMl >= record.goalMl;

  const isFirstTimeReached = !prevReached && record.goalReached;

  history[today] = record;
  saveHistory(history);

  return { todayRecord: record, isFirstTimeReached };
}

export function removeWaterEntry(
  entryId: string,
  config: UserConfig
): DayRecord {
  const today = getTodayDateString();
  const history = loadHistory();
  const record = history[today] || getOrCreateTodayRecord(config);

  const target = record.entries.find((e) => e.id === entryId);
  if (!target) return record;

  record.entries = record.entries.filter((e) => e.id !== entryId);
  record.totalMl = Math.max(0, record.totalMl - target.amountMl);
  record.goalReached = record.totalMl >= record.goalMl;

  history[today] = record;
  saveHistory(history);

  return record;
}

export function calculateConsecutiveStreak(todayRecord: DayRecord): number {
  const history = loadHistory();
  const today = getTodayDateString();
  
  // Create a sorted list of completed dates
  let streak = 0;
  const todayReached = todayRecord.goalReached;
  
  if (todayReached) {
    streak = 1;
  }

  // Check backwards day by day from yesterday
  const checkDate = new Date();
  if (todayReached) {
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If not reached today, check if yesterday was reached to preserve active streak
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const rec = history[dateStr];
    if (rec && rec.goalReached) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

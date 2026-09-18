import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Droplets,
  Settings2,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import { UserConfig, DayRecord } from './types';
import {
  loadUserConfig,
  saveUserConfig,
  getOrCreateTodayRecord,
  addWaterEntry,
  removeWaterEntry,
  calculateConsecutiveStreak,
  getTodayDateString,
} from './utils/storage';
import { playWaterDropSound, playCelebrationSound } from './utils/audio';
import { PlantMascot } from './components/PlantMascot';
import { WaterProgressBar } from './components/WaterProgressBar';
import { QuickLogButtons } from './components/QuickLogButtons';
import { StreakBadge } from './components/StreakBadge';
import { DailyHistory } from './components/DailyHistory';
import { GoalCalculatorModal } from './components/GoalCalculatorModal';

export default function App() {
  const [config, setConfig] = useState<UserConfig>(() => loadUserConfig());
  const [todayRecord, setTodayRecord] = useState<DayRecord>(() =>
    getOrCreateTodayRecord(loadUserConfig())
  );
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hidrata_sound_enabled') !== 'false';
    } catch {
      return true;
    }
  });
  const [lastLoggedTime, setLastLoggedTime] = useState<number | undefined>(undefined);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Check if today changed (e.g. user keeps tab open overnight)
  useEffect(() => {
    const interval = setInterval(() => {
      const todayStr = getTodayDateString();
      if (todayRecord.date !== todayStr) {
        setTodayRecord(getOrCreateTodayRecord(config));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [todayRecord.date, config]);

  // If not configured, open the calculator onboarding automatically
  useEffect(() => {
    if (!config.isConfigured) {
      setIsCalculatorOpen(true);
    }
  }, [config.isConfigured]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hidrata_sound_enabled', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const streakDays = useMemo(() => {
    return calculateConsecutiveStreak(todayRecord);
  }, [todayRecord]);

  const progressPercent = useMemo(() => {
    if (!todayRecord.goalMl || todayRecord.goalMl <= 0) return 0;
    return Math.round((todayRecord.totalMl / todayRecord.goalMl) * 100);
  }, [todayRecord.totalMl, todayRecord.goalMl]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#34D399', '#F472B6', '#FBBF24'],
      });
    } catch {
      // Ignore if canvas blocked
    }
  }, []);

  const handleLogWater = (amountMl: number) => {
    const { todayRecord: updated, isFirstTimeReached } = addWaterEntry(
      { amountMl },
      config
    );
    setTodayRecord({ ...updated });
    setLastLoggedTime(Date.now());

    if (soundEnabled) {
      playWaterDropSound();
    }

    if (isFirstTimeReached) {
      triggerConfetti();
      setShowCelebrationBanner(true);
      if (soundEnabled) {
        setTimeout(() => playCelebrationSound(), 180);
      }
    }
  };

  const handleRemoveEntry = (entryId: string) => {
    const updated = removeWaterEntry(entryId, config);
    setTodayRecord({ ...updated });
  };

  const handleSaveConfig = (newConfig: UserConfig) => {
    setConfig(newConfig);
    saveUserConfig(newConfig);
    const updatedRecord = getOrCreateTodayRecord(newConfig);
    setTodayRecord({ ...updatedRecord });
    setIsCalculatorOpen(false);
  };

  // Formatted date string for header in Portuguese
  const todayFormatted = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-slate-50 to-emerald-50/30 text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
      {/* Top Application Bar */}
      <header
        id="app-header"
        className="w-full max-w-4xl flex items-center justify-between py-3 mb-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 text-white flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-none flex items-center gap-1.5">
              <span>Controle de Água</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800">
                Diário
              </span>
            </h1>
            <p className="text-xs text-slate-500 capitalize mt-0.5">{todayFormatted}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={toggleSound}
            title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
            className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-white border-slate-200 text-sky-600 hover:bg-sky-50'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            id="open-calculator-btn"
            onClick={() => setIsCalculatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 shadow-2xs transition-all active:scale-95"
            title="Ajustar Meta e Parâmetros"
          >
            <Settings2 className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Ajustar Meta</span>
          </button>
        </div>
      </header>

      {/* Goal Reached Celebration Banner */}
      {showCelebrationBanner && (
        <div
          id="celebration-banner"
          className="w-full max-w-4xl mb-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold flex items-center gap-1">
                <span>Parabéns! Você bateu a sua meta diária!</span>
                <Sparkles className="w-4 h-4 text-amber-200 inline" />
              </h2>
              <p className="text-xs text-white/90">
                Sua plantinha floresceu com vigor e sua sequência de hidratação subiu. Continue bebendo água!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCelebrationBanner(false)}
            className="text-xs font-bold px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors shrink-0 ml-2"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Plant Mascot & Daily Streak summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <PlantMascot
            progressPercent={progressPercent}
            isGoalReached={todayRecord.goalReached}
            totalMl={todayRecord.totalMl}
            goalMl={todayRecord.goalMl}
            lastLoggedTime={lastLoggedTime}
            onPlantTap={() => {
              if (soundEnabled) playWaterDropSound();
            }}
          />

          {/* Streak & Drink Count */}
          <StreakBadge
            streakDays={streakDays}
            timesLoggedToday={todayRecord.entries.length}
            totalMl={todayRecord.totalMl}
            isGoalReachedToday={todayRecord.goalReached}
          />
        </div>

        {/* Right Column: Progress Bar, Quick Logging & History (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Progress Bar with Goal info */}
          <WaterProgressBar
            totalMl={todayRecord.totalMl}
            goalMl={todayRecord.goalMl}
            progressPercent={progressPercent}
            isGoalReached={todayRecord.goalReached}
          />

          {/* Quick & Custom Logging Control */}
          <QuickLogButtons onLogWater={handleLogWater} />

          {/* Visual History of the Day */}
          <DailyHistory
            entries={todayRecord.entries}
            totalMl={todayRecord.totalMl}
            timesCount={todayRecord.entries.length}
            onRemoveEntry={handleRemoveEntry}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl mt-8 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <span>Meta personalizada ativa:</span>
          <strong className="text-slate-600 font-bold">{todayRecord.goalMl} ml/dia</strong>
          <span className="text-slate-300">•</span>
          <span>(35ml/kg + atividade e clima)</span>
        </div>
        <button
          type="button"
          onClick={() => setIsCalculatorOpen(true)}
          className="text-sky-600 hover:text-sky-700 font-semibold hover:underline flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Recalcular meta
        </button>
      </footer>

      {/* First-access Onboarding & Edit Goal Modal */}
      <GoalCalculatorModal
        isOpen={isCalculatorOpen}
        isFirstAccess={!config.isConfigured}
        initialConfig={config}
        onSave={handleSaveConfig}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}

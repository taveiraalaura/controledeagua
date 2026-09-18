import { motion } from 'motion/react';
import { Droplet, Trophy, CheckCircle2 } from 'lucide-react';

interface WaterProgressBarProps {
  totalMl: number;
  goalMl: number;
  progressPercent: number;
  isGoalReached: boolean;
}

export function WaterProgressBar({
  totalMl,
  goalMl,
  progressPercent,
  isGoalReached,
}: WaterProgressBarProps) {
  const remainingMl = Math.max(0, goalMl - totalMl);
  const cappedPercent = Math.min(100, Math.max(0, progressPercent));

  return (
    <div
      id="water-progress-card"
      className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isGoalReached ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
            {isGoalReached ? (
              <Trophy className="w-5 h-5 animate-bounce text-emerald-600" />
            ) : (
              <Droplet className="w-5 h-5 fill-sky-500 text-sky-500" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Progresso de Hoje</h3>
            <p className="text-xs text-slate-500">
              {isGoalReached ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Meta diária alcançada!
                </span>
              ) : (
                <span>Faltam <strong className="text-sky-700 font-bold">{remainingMl} ml</strong></span>
              )}
            </p>
          </div>
        </div>

        {/* Big percentage pill */}
        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold ${
              isGoalReached
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-sky-100 text-sky-800'
            }`}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Modern Wave / Gradient Bar */}
      <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <motion.div
          id="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${cappedPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full transition-colors ${
            isGoalReached
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 shadow-xs'
              : 'bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-500 shadow-xs'
          }`}
        />
      </div>

      {/* Markers under the bar */}
      <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-1">
        <span>0 ml</span>
        <span>{Math.round(goalMl * 0.5)} ml (50%)</span>
        <span className={isGoalReached ? 'text-emerald-600 font-bold' : ''}>
          {goalMl} ml
        </span>
      </div>
    </div>
  );
}

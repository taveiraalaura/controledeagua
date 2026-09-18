import { Flame, Clock, CalendarCheck } from 'lucide-react';

interface StreakBadgeProps {
  streakDays: number;
  timesLoggedToday: number;
  totalMl: number;
  isGoalReachedToday: boolean;
}

export function StreakBadge({
  streakDays,
  timesLoggedToday,
  totalMl,
  isGoalReachedToday,
}: StreakBadgeProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Daily Drinks Count */}
      <div
        id="daily-count-card"
        className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
          <Clock className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Ingestões Hoje
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-slate-800">
              {timesLoggedToday}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {timesLoggedToday === 1 ? 'vez' : 'vezes'}
            </span>
          </div>
        </div>
      </div>

      {/* Streak Count */}
      <div
        id="streak-count-card"
        className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 transition-colors ${
          streakDays > 0
            ? 'bg-gradient-to-br from-amber-50/60 to-orange-50/40 border-amber-200/80'
            : 'bg-white border-slate-200/80'
        }`}
      >
        <div
          className={`p-2.5 rounded-xl ${
            streakDays > 0
              ? 'bg-amber-100 text-amber-600'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          <Flame
            className={`w-5 h-5 ${
              streakDays > 0 ? 'fill-amber-500 text-amber-600 animate-pulse' : ''
            }`}
          />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Sequência
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl font-extrabold ${
                streakDays > 0 ? 'text-amber-600' : 'text-slate-700'
              }`}
            >
              {streakDays}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {streakDays === 1 ? 'dia' : 'dias'}
            </span>
            {isGoalReachedToday && (
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 inline ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

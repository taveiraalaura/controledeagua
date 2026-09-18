import { WaterLogEntry } from '../types';
import { History, Trash2, GlassWater, Sparkles } from 'lucide-react';

interface DailyHistoryProps {
  entries: WaterLogEntry[];
  totalMl: number;
  timesCount: number;
  onRemoveEntry: (id: string) => void;
}

export function DailyHistory({
  entries,
  totalMl,
  timesCount,
  onRemoveEntry,
}: DailyHistoryProps) {
  return (
    <div
      id="daily-history-card"
      className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <History className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Histórico de Hoje</h3>
            <p className="text-xs text-slate-500">
              {timesCount} {timesCount === 1 ? 'registro' : 'registros'} • Total:{' '}
              <strong className="text-teal-700 font-bold">{totalMl} ml</strong>
            </p>
          </div>
        </div>
      </div>

      {/* List of today's drinks */}
      {entries.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <GlassWater className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Nenhum registro ainda hoje</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Beba um copo d'água e registre acima para hidratar sua planta!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {entries.map((item, index) => (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center font-bold text-xs">
                  #{entries.length - index}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800">
                      +{item.amountMl} ml
                    </span>
                    {item.amountMl >= 500 && (
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold bg-sky-100 text-sky-700 rounded-md">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Garrafa
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Horário: {item.timeStr}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveEntry(item.id)}
                title="Remover este registro"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-70 group-hover:opacity-100 transition-all active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

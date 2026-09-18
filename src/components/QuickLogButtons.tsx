import { useState } from 'react';
import { Plus, Droplets, Coffee, GlassWater, Milk, Wine } from 'lucide-react';

interface QuickLogButtonsProps {
  onLogWater: (amountMl: number) => void;
}

const PRESETS = [
  { ml: 150, label: '150 ml', desc: 'Pequeno', icon: Coffee },
  { ml: 200, label: '200 ml', desc: 'Copo', icon: GlassWater },
  { ml: 250, label: '250 ml', desc: 'Padrão', icon: GlassWater },
  { ml: 300, label: '300 ml', desc: 'Caneca', icon: Milk },
  { ml: 500, label: '500 ml', desc: 'Garrafa', icon: Wine },
];

export function QuickLogButtons({ onLogWater }: QuickLogButtonsProps) {
  const [customMl, setCustomMl] = useState<string>('250');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetClick = (amount: number) => {
    setIsSubmitting(true);
    onLogWater(amount);
    setTimeout(() => setIsSubmitting(false), 250);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!val || val <= 0 || val > 3000) return;
    setIsSubmitting(true);
    onLogWater(val);
    setTimeout(() => setIsSubmitting(false), 250);
  };

  return (
    <div
      id="quick-log-card"
      className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Droplets className="w-5 h-5 fill-blue-500 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Registrar Ingestão</h3>
            <p className="text-xs text-slate-500">Escolha um atalho ou digite a quantidade</p>
          </div>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {PRESETS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.ml}
              type="button"
              id={`preset-btn-${item.ml}`}
              onClick={() => handlePresetClick(item.ml)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/60 active:scale-95 transition-all text-slate-700 hover:text-sky-700 group focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            >
              <div className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-white text-slate-600 group-hover:text-sky-600 transition-colors mb-1">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
              <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Milliliters Input Form */}
      <form
        onSubmit={handleCustomSubmit}
        id="custom-water-form"
        className="flex items-center gap-2 pt-2 border-t border-slate-100"
      >
        <div className="relative flex-1">
          <input
            id="custom-ml-input"
            type="number"
            min="10"
            max="3000"
            step="10"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            placeholder="Ex: 350"
            className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
            ml
          </span>
        </div>

        {/* Quick Stepper adjustment buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            id="minus-50-btn"
            onClick={() => {
              const cur = parseInt(customMl, 10) || 200;
              setCustomMl(String(Math.max(50, cur - 50)));
            }}
            className="px-2.5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl active:scale-95 transition-all"
            title="Diminuir 50ml"
          >
            -50
          </button>
          <button
            type="button"
            id="plus-50-btn"
            onClick={() => {
              const cur = parseInt(customMl, 10) || 200;
              setCustomMl(String(cur + 50));
            }}
            className="px-2.5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl active:scale-95 transition-all"
            title="Aumentar 50ml"
          >
            +50
          </button>
        </div>

        <button
          type="submit"
          id="submit-log-btn"
          disabled={isSubmitting || !customMl || parseInt(customMl, 10) <= 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar</span>
        </button>
      </form>
    </div>
  );
}

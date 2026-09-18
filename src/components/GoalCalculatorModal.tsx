import { useState, useId } from 'react';
import { ActivityLevel, ClimateType, UserConfig } from '../types';
import { getGoalBreakdown, calculateDailyGoal } from '../utils/calculator';
import { Scale, Dumbbell, SunMedium, Check, X, Info } from 'lucide-react';

interface GoalCalculatorModalProps {
  isOpen: boolean;
  isFirstAccess: boolean;
  initialConfig: UserConfig;
  onSave: (config: UserConfig) => void;
  onClose?: () => void;
}

const ACTIVITY_OPTIONS: { id: ActivityLevel; title: string; desc: string; extra: string }[] = [
  { id: 'sedentary', title: 'Sedentário', desc: 'Trabalho sentado, sem treino hoje', extra: '+0 ml' },
  { id: 'light', title: 'Leve', desc: 'Caminhada suave, afazeres domésticos', extra: '+150 ml' },
  { id: 'moderate', title: 'Moderado', desc: 'Treino moderado (~45min)', extra: '+300 ml' },
  { id: 'intense', title: 'Intenso', desc: 'Treino pesado, corrida ou esporte', extra: '+500 ml' },
];

const CLIMATE_OPTIONS: { id: ClimateType; title: string; desc: string; extra: string }[] = [
  { id: 'mild', title: 'Ameno / Frio', desc: 'Clima fresco ou ar condicionado', extra: '+0 ml' },
  { id: 'moderate', title: 'Moderado', desc: 'Temperatura agradável (20-27°C)', extra: '+150 ml' },
  { id: 'hot', title: 'Quente / Calor', desc: 'Dias quentes ou sol forte (>28°C)', extra: '+350 ml' },
];

export function GoalCalculatorModal({
  isOpen,
  isFirstAccess,
  initialConfig,
  onSave,
  onClose,
}: GoalCalculatorModalProps) {
  const [weight, setWeight] = useState<number>(initialConfig.weightKg || 70);
  const [activity, setActivity] = useState<ActivityLevel>(initialConfig.activityLevel || 'moderate');
  const [climate, setClimate] = useState<ClimateType>(initialConfig.climate || 'moderate');

  const weightInputId = useId();

  if (!isOpen) return null;

  const tempConfig: UserConfig = {
    weightKg: Number(weight) || 70,
    activityLevel: activity,
    climate: climate,
    isConfigured: true,
  };

  const breakdown = getGoalBreakdown(tempConfig);
  const totalGoal = calculateDailyGoal(tempConfig.weightKg, activity, climate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || weight < 30 || weight > 250) return;

    onSave({
      weightKg: Number(weight),
      activityLevel: activity,
      climate: climate,
      isConfigured: true,
    });
  };

  return (
    <div
      id="goal-calculator-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="goal-calculator-modal-content"
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button if not mandatory first access */}
        {!isFirstAccess && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {isFirstAccess ? 'Bem-vindo ao Controle de Água!' : 'Calculadora de Meta Personalizada'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {isFirstAccess
              ? 'Calcule sua meta diária de hidratação ideal com base no seu peso corporal, treino e clima de hoje.'
              : 'Ajuste seus dados para recalcular a quantidade ideal de água para hoje.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Body Weight */}
          <div>
            <label
              htmlFor={weightInputId}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              <Scale className="w-4 h-4 text-sky-600" />
              <span>1. Peso Corporal (kg)</span>
            </label>
            <div className="relative">
              <input
                id={weightInputId}
                type="number"
                min="30"
                max="250"
                step="0.5"
                required
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                placeholder="Ex: 70"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                kg
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Fórmula base de hidratação: 35 ml por quilograma corporal.
            </p>
          </div>

          {/* 2. Physical Activity Level */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Dumbbell className="w-4 h-4 text-sky-600" />
              <span>2. Atividade Física Hoje</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITY_OPTIONS.map((opt) => {
                const isSelected = activity === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setActivity(opt.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-xs ring-1 ring-sky-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{opt.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-sky-200 text-sky-800' : 'bg-slate-200/60 text-slate-500'
                        }`}
                      >
                        {opt.extra}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Climate / Weather */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <SunMedium className="w-4 h-4 text-amber-500" />
              <span>3. Clima / Temperatura de Hoje</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CLIMATE_OPTIONS.map((opt) => {
                const isSelected = climate === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setClimate(opt.id)}
                    className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs ring-1 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.title}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 ${
                        isSelected ? 'bg-amber-200 text-amber-800' : 'bg-slate-200/60 text-slate-500'
                      }`}
                    >
                      {opt.extra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Calculation Breakdown Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
              Detalhamento do Cálculo:
            </span>
            <div className="text-xs text-slate-600 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Base (35 ml × {weight || 0} kg):</span>
                <strong className="text-slate-800">{breakdown.baseMl} ml</strong>
              </div>
              <div className="flex justify-between">
                <span>Ajuste por treino:</span>
                <strong className="text-sky-700">{breakdown.activityLabel}</strong>
              </div>
              <div className="flex justify-between">
                <span>Ajuste por temperatura:</span>
                <strong className="text-amber-700">{breakdown.climateLabel}</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Sua Meta Diária:</span>
              <span className="text-lg font-extrabold text-sky-700">
                {totalGoal} ml
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            id="save-goal-btn"
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{isFirstAccess ? 'Começar a Hidratar' : 'Salvar e Atualizar Meta'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

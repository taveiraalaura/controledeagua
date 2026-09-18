import { ActivityLevel, ClimateType, UserConfig } from '../types';

export function calculateDailyGoal(
  weightKg: number,
  activityLevel: ActivityLevel,
  climate: ClimateType
): number {
  if (!weightKg || weightKg <= 0) {
    return 2000;
  }

  // Fórmula base: 35ml × peso corporal
  const baseMl = Math.round(weightKg * 35);

  // Ajuste por atividade física (+500ml para treino/atividade intensa)
  let activityAdjustment = 0;
  switch (activityLevel) {
    case 'sedentary':
      activityAdjustment = 0;
      break;
    case 'light':
      activityAdjustment = 150;
      break;
    case 'moderate':
      activityAdjustment = 300;
      break;
    case 'intense':
      activityAdjustment = 500;
      break;
  }

  // Ajuste por clima (temperatura alta aumenta a meta recomendada)
  let climateAdjustment = 0;
  switch (climate) {
    case 'mild':
      climateAdjustment = 0;
      break;
    case 'moderate':
      climateAdjustment = 150;
      break;
    case 'hot':
      climateAdjustment = 350;
      break;
  }

  const rawTotal = baseMl + activityAdjustment + climateAdjustment;
  // Arredondar para o múltiplo de 50 mais próximo para legibilidade
  return Math.round(rawTotal / 50) * 50;
}

export function getGoalBreakdown(config: UserConfig) {
  const baseMl = Math.round(config.weightKg * 35);
  let activityAdjustment = 0;
  let activityLabel = 'Sedentário (0 ml)';
  switch (config.activityLevel) {
    case 'sedentary':
      activityAdjustment = 0;
      activityLabel = 'Sedentário (+0 ml)';
      break;
    case 'light':
      activityAdjustment = 150;
      activityLabel = 'Leve (+150 ml)';
      break;
    case 'moderate':
      activityAdjustment = 300;
      activityLabel = 'Moderado (+300 ml)';
      break;
    case 'intense':
      activityAdjustment = 500;
      activityLabel = 'Intenso (+500 ml)';
      break;
  }

  let climateAdjustment = 0;
  let climateLabel = 'Ameno / Frio (0 ml)';
  switch (config.climate) {
    case 'mild':
      climateAdjustment = 0;
      climateLabel = 'Ameno / Frio (+0 ml)';
      break;
    case 'moderate':
      climateAdjustment = 150;
      climateLabel = 'Moderado (+150 ml)';
      break;
    case 'hot':
      climateAdjustment = 350;
      climateLabel = 'Quente / Calor (+350 ml)';
      break;
  }

  const total = calculateDailyGoal(config.weightKg, config.activityLevel, config.climate);

  return {
    baseMl,
    activityAdjustment,
    activityLabel,
    climateAdjustment,
    climateLabel,
    total,
  };
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface PlantMascotProps {
  progressPercent: number; // 0 to 100+
  isGoalReached: boolean;
  totalMl: number;
  goalMl: number;
  onPlantTap?: () => void;
  lastLoggedTime?: number;
}

export function PlantMascot({
  progressPercent,
  isGoalReached,
  totalMl,
  goalMl,
  onPlantTap,
  lastLoggedTime,
}: PlantMascotProps) {
  const [isWatering, setIsWatering] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  // Trigger watering animation on new log
  useEffect(() => {
    if (lastLoggedTime) {
      setIsWatering(true);
      const timer = setTimeout(() => setIsWatering(false), 1400);
      return () => clearTimeout(timer);
    }
  }, [lastLoggedTime]);

  const handleTap = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
    onPlantTap?.();
  };

  // Determine stage (1 to 5)
  let stage = 1;
  let stageName = 'Brotinho Inicial';
  let stageDescription = 'Dê água para me ver crescer!';

  if (progressPercent >= 100) {
    stage = 5;
    stageName = 'Florescida & Radiante!';
    stageDescription = 'Meta batida! Planta 100% hidratada e feliz.';
  } else if (progressPercent >= 75) {
    stage = 4;
    stageName = 'Botão Quase Florescendo';
    stageDescription = 'Quase lá! As pétalas já estão despontando.';
  } else if (progressPercent >= 50) {
    stage = 3;
    stageName = 'Planta Forte & Jovem';
    stageDescription = 'Mais da metade do caminho percorrido!';
  } else if (progressPercent >= 25) {
    stage = 2;
    stageName = 'Muda em Crescimento';
    stageDescription = 'Primeiras folhas viçosas surgindo!';
  }

  return (
    <div
      id="plant-mascot-card"
      className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50/70 via-emerald-50/40 to-amber-50/20 rounded-3xl border border-sky-100/80 shadow-sm overflow-hidden"
    >
      {/* Decorative background aura */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isGoalReached
            ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.18),transparent_70%)]'
            : 'opacity-40 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_70%)]'
        }`}
      />

      {/* Floating Sparkles when goal reached */}
      {isGoalReached && (
        <div className="absolute top-3 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 text-emerald-800 text-xs font-semibold rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Meta Atingida!</span>
        </div>
      )}

      {/* Interactive Mascot SVG container */}
      <div
        id="plant-clickable-area"
        onClick={handleTap}
        className="relative w-56 h-56 cursor-pointer select-none flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-95"
        title="Clique na plantinha para dar carinho!"
      >
        {/* Heart pop animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 10 }}
              animate={{ opacity: 1, scale: 1.2, y: -45 }}
              exit={{ opacity: 0, scale: 0.8, y: -65 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-8 z-30 pointer-events-none text-rose-500"
            >
              <Heart className="w-7 h-7 fill-rose-400 drop-shadow" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Water Droplets falling into pot */}
        <AnimatePresence>
          {isWatering && (
            <div className="absolute inset-0 pointer-events-none z-20 flex justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20, x: (i - 1) * 24 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [0, 110],
                    scale: [0.8, 1, 1.1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.18,
                    ease: 'easeIn',
                  }}
                  className="w-3 h-4 bg-sky-400 rounded-full rounded-t-none shadow-xs"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* SVG Plant Artwork */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="potRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="leafGradDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="flowerPetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>

          {/* Plant Stem & Foliage animated based on stage */}
          <motion.g
            animate={{
              rotate: [0, 1.2, -1.2, 0],
              y: isWatering ? [0, -3, 0] : 0,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              y: { duration: 0.4 },
            }}
            style={{ transformOrigin: '100px 145px' }}
          >
            {/* STAGE 1: Sprout (0-24%) */}
            {stage === 1 && (
              <g id="plant-stage-1">
                {/* Tiny Stem */}
                <path
                  d="M100 145 Q100 135 100 128"
                  stroke="#22C55E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Left Baby Leaf */}
                <motion.path
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  d="M100 130 C90 125 88 116 93 115 C98 114 100 124 100 130 Z"
                  fill="url(#leafGradLight)"
                />
                {/* Right Baby Leaf */}
                <motion.path
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  d="M100 130 C110 125 112 116 107 115 C102 114 100 124 100 130 Z"
                  fill="url(#leafGradLight)"
                />
                {/* Dew drop */}
                <circle cx="106" cy="116" r="1.5" fill="#E0F2FE" />
              </g>
            )}

            {/* STAGE 2: Young seedling (25-49%) */}
            {stage === 2 && (
              <g id="plant-stage-2">
                {/* Stem */}
                <path
                  d="M100 145 Q98 120 100 108"
                  stroke="#16A34A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lower left leaf */}
                <path
                  d="M99 128 C80 128 72 112 85 110 C96 108 99 123 99 128 Z"
                  fill="url(#leafGradDeep)"
                />
                {/* Lower right leaf */}
                <path
                  d="M101 124 C118 124 126 110 114 108 C103 106 101 120 101 124 Z"
                  fill="url(#leafGradLight)"
                />
                {/* Top sprout leaves */}
                <path
                  d="M100 108 C93 96 95 86 100 85 C105 86 107 96 100 108 Z"
                  fill="url(#leafGradLight)"
                />
              </g>
            )}

            {/* STAGE 3: Medium healthy plant (50-74%) */}
            {stage === 3 && (
              <g id="plant-stage-3">
                {/* Sturdy Stem */}
                <path
                  d="M100 145 Q96 115 100 88"
                  stroke="#15803D"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lower wide leaves */}
                <path
                  d="M98 132 C72 135 62 115 80 110 C94 106 98 126 98 132 Z"
                  fill="url(#leafGradDeep)"
                />
                <path
                  d="M102 128 C128 130 138 112 120 107 C106 103 102 122 102 128 Z"
                  fill="url(#leafGradDeep)"
                />
                {/* Middle leaves */}
                <path
                  d="M98 108 C80 104 74 88 88 85 C98 83 98 102 98 108 Z"
                  fill="url(#leafGradLight)"
                />
                <path
                  d="M102 104 C120 100 126 84 112 81 C102 79 102 98 102 104 Z"
                  fill="url(#leafGradLight)"
                />
                {/* Top emerging flower bud */}
                <circle cx="100" cy="85" r="5" fill="#F472B6" />
                <path d="M97 88 Q100 82 103 88" fill="#15803D" />
              </g>
            )}

            {/* STAGE 4: Lush with big flower bud (75-99%) */}
            {stage === 4 && (
              <g id="plant-stage-4">
                {/* Stem */}
                <path
                  d="M100 145 Q95 110 100 78"
                  stroke="#15803D"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* 4 Rich curved leaves */}
                <path
                  d="M98 132 C65 138 54 112 78 106 C95 101 98 126 98 132 Z"
                  fill="url(#leafGradDeep)"
                />
                <path
                  d="M102 128 C135 134 146 108 122 102 C105 97 102 122 102 128 Z"
                  fill="url(#leafGradDeep)"
                />
                <path
                  d="M97 102 C74 96 68 76 86 72 C98 69 98 94 97 102 Z"
                  fill="url(#leafGradLight)"
                />
                <path
                  d="M103 98 C126 92 132 72 114 68 C102 65 102 90 103 98 Z"
                  fill="url(#leafGradLight)"
                />
                {/* Big Ready Bud */}
                <motion.g
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path
                    d="M100 76 C92 74 90 60 97 58 C100 57 100 70 100 76 Z"
                    fill="url(#flowerPetal)"
                  />
                  <path
                    d="M100 76 C108 74 110 60 103 58 C100 57 100 70 100 76 Z"
                    fill="url(#flowerPetal)"
                  />
                  <ellipse cx="100" cy="65" rx="5" ry="8" fill="#F472B6" />
                  <circle cx="100" cy="74" r="3.5" fill="#15803D" />
                </motion.g>
              </g>
            )}

            {/* STAGE 5: Fully Bloomed Flower! (100%+) */}
            {stage === 5 && (
              <g id="plant-stage-5">
                {/* Main Stem */}
                <path
                  d="M100 145 Q96 110 100 75"
                  stroke="#15803D"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lush mature foliage */}
                <path
                  d="M98 132 C60 138 50 110 76 104 C94 99 98 126 98 132 Z"
                  fill="url(#leafGradDeep)"
                />
                <path
                  d="M102 128 C140 134 150 106 124 100 C106 95 102 122 102 128 Z"
                  fill="url(#leafGradDeep)"
                />
                <path
                  d="M97 100 C70 92 64 68 85 64 C98 61 98 90 97 100 Z"
                  fill="url(#leafGradLight)"
                />
                <path
                  d="M103 96 C130 88 136 64 115 60 C102 57 102 86 103 96 Z"
                  fill="url(#leafGradLight)"
                />

                {/* Glorious Open Flower with animation */}
                <motion.g
                  animate={{
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '100px 58px' }}
                >
                  {/* 8 Flower Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                    <ellipse
                      key={idx}
                      cx="100"
                      cy="40"
                      rx="8"
                      ry="16"
                      fill="url(#flowerPetal)"
                      transform={`rotate(${angle} 100 58)`}
                      className="opacity-95 drop-shadow-xs"
                    />
                  ))}
                  {/* Inner golden glowing core */}
                  <circle cx="100" cy="58" r="10" fill="#FBBF24" />
                  <circle cx="100" cy="58" r="7" fill="#F59E0B" />
                  {/* Cheerful flower center face */}
                  <circle cx="97" cy="56" r="1.3" fill="#78350F" />
                  <circle cx="103" cy="56" r="1.3" fill="#78350F" />
                  <path
                    d="M98 61 Q100 63 102 61"
                    stroke="#78350F"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Rosy cheeks */}
                  <circle cx="95" cy="59" r="1.4" fill="#F43F5E" opacity="0.6" />
                  <circle cx="105" cy="59" r="1.4" fill="#F43F5E" opacity="0.6" />
                </motion.g>

                {/* Floating sparkles around flower */}
                <circle cx="68" cy="45" r="2" fill="#38BDF8" className="animate-ping" />
                <circle cx="132" cy="40" r="2" fill="#F472B6" className="animate-pulse" />
                <circle cx="100" cy="20" r="2.5" fill="#FBBF24" className="animate-bounce" />
              </g>
            )}
          </motion.g>

          {/* Pot Rim & Soil */}
          <ellipse cx="100" cy="145" rx="42" ry="10" fill="url(#soilGrad)" />

          {/* Ceramic Pot Body */}
          <path
            d="M62 145 L70 182 Q72 186 78 186 L122 186 Q128 186 130 182 L138 145 Z"
            fill="url(#potGrad)"
            stroke="#9A3412"
            strokeWidth="1.5"
          />

          {/* Pot Rim Lip */}
          <rect
            x="57"
            y="138"
            width="86"
            height="10"
            rx="5"
            fill="url(#potRim)"
            stroke="#9A3412"
            strokeWidth="1.5"
          />

          {/* Pot Cute Mascot Face */}
          <g id="pot-face">
            {/* Eyes */}
            {stage === 5 ? (
              // Joyful curved happy eyes (^ ^)
              <>
                <path
                  d="M87 163 Q90 159 93 163"
                  stroke="#431407"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M107 163 Q110 159 113 163"
                  stroke="#431407"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : (
              // Open curious eyes with catchlights
              <>
                <ellipse cx="90" cy="162" rx="3.5" ry="4" fill="#431407" />
                <circle cx="89" cy="160" r="1.3" fill="#FFFFFF" />
                <ellipse cx="110" cy="162" rx="3.5" ry="4" fill="#431407" />
                <circle cx="109" cy="160" r="1.3" fill="#FFFFFF" />
              </>
            )}

            {/* Mouth */}
            {stage === 5 ? (
              <path
                d="M96 168 Q100 174 104 168"
                stroke="#431407"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#DC2626"
              />
            ) : stage >= 3 ? (
              <path
                d="M97 168 Q100 172 103 168"
                stroke="#431407"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Neutral/soft smile
              <path
                d="M98 168 Q100 170 102 168"
                stroke="#431407"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Soft pink cheeks on pot */}
            <circle cx="83" cy="166" r="3.5" fill="#F87171" opacity="0.45" />
            <circle cx="117" cy="166" r="3.5" fill="#F87171" opacity="0.45" />
          </g>
        </svg>
      </div>

      {/* Stage Badge & Status */}
      <div className="mt-2 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full border border-sky-100 text-sky-900 font-semibold text-xs shadow-xs mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{stageName}</span>
          <span className="text-slate-400 font-normal">({progressPercent}%)</span>
        </div>
        <p className="text-xs text-slate-500 max-w-xs">{stageDescription}</p>
      </div>

      {/* Daily Progress summary under mascot */}
      <div className="w-full mt-3 pt-3 border-t border-sky-100/60 flex items-center justify-between text-xs text-slate-600">
        <span>
          Ingerido: <strong className="text-sky-700 font-bold">{totalMl} ml</strong>
        </span>
        <span>
          Meta: <strong className="text-slate-800 font-bold">{goalMl} ml</strong>
        </span>
      </div>
    </div>
  );
}

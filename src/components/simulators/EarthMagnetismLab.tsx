import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Compass, Sun, Sparkles, Navigation, Info } from 'lucide-react';
import { storageService } from '../../services/storage';

interface EarthMagnetismLabProps {
  onXpEarned?: (xp: number, badgeNames: string[]) => void;
}

export const EarthMagnetismLab: React.FC<EarthMagnetismLabProps> = ({ onXpEarned }) => {
  const [compassAngleDeg, setCompassAngleDeg] = useState(45); // Position along planetary orbit arc
  const [solarWindActive, setSolarWindActive] = useState(false);
  const [showFieldLines, setShowFieldLines] = useState(true);

  // Trigger feedback
  const triggerAction = async (simKey: string) => {
    const { newlyUnlockedBadges, xpGained } = await storageService.recordSimulationAction('earth-lab', simKey);
    if (xpGained > 0 || newlyUnlockedBadges.length > 0) {
      onXpEarned?.(xpGained, newlyUnlockedBadges.map(b => b.title));
    }
  };

  const handleCompassMove = (deg: number) => {
    setCompassAngleDeg(deg);
    triggerAction('earth-compass-dragged');
  };

  const handleTriggerSolarWind = () => {
    setSolarWindActive(true);
    triggerAction('solar-burst');
    setTimeout(() => {
      setSolarWindActive(false);
    }, 4500);
  };

  // Compute compass position on circle around Earth
  const rad = (compassAngleDeg * Math.PI) / 180;
  const compassX = 250 + Math.cos(rad) * 160;
  const compassY = 200 + Math.sin(rad) * 160;

  // The compass needle points toward the Earth's South Magnetic Pole (approx Geographic North, near top, y ~ 80)
  // Angle from compass point to top pole (250, 75)
  const angleToMagneticSouth = Math.atan2(75 - compassY, 250 - compassX) * (180 / Math.PI);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Laboratório 3: Campo Magnético Terrestre, Bússola & Auroras
            </h3>
            <p className="text-xs text-slate-400">
              O enigma dos polos invertidos e o escudo planetário contra partículas solares
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFieldLines(!showFieldLines)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              showFieldLines 
                ? 'bg-indigo-950/70 border-indigo-500 text-indigo-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showFieldLines ? 'Linhas de Campo: Visíveis' : 'Ocultar Linhas'}
          </button>

          <button
            onClick={handleTriggerSolarWind}
            disabled={solarWindActive}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Sun className="w-3.5 h-3.5" />
            {solarWindActive ? 'Rajada em Curso...' : 'Disparar Vento Solar'}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planet & Field Visualizer Canvas */}
        <div className="lg:col-span-2 bg-slate-950/90 rounded-xl border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
          {/* Solar Wind Particle Stream when active */}
          <AnimatePresence>
            {solarWindActive && (
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-20 flex items-center"
              >
                <div className="w-full h-full relative">
                  {/* Solar stream particles */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, 220, 260],
                        y: [
                          40 + i * 20,
                          i < 8 ? 85 : 315, // Channeled toward poles!
                          i < 8 ? 75 : 325,
                        ],
                        opacity: [0, 1, 0],
                        scale: [1, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: 2,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                      className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-300"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Planetary System & Field Lines */}
          <svg className="w-full max-w-[500px] h-[360px]" viewBox="0 0 500 400">
            <defs>
              <radialGradient id="earthGrad" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#082f49" />
              </radialGradient>
              <linearGradient id="auroraNorthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="auroraSouthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Earth Field Lines (Loops from South to North) */}
            {showFieldLines && (
              <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.45" strokeDasharray="4 3">
                {/* Left side loops */}
                <path d="M 250 320 C 100 320, 80 80, 250 80" />
                <path d="M 250 310 C 140 310, 130 90, 250 90" />
                {/* Right side loops */}
                <path d="M 250 320 C 400 320, 420 80, 250 80" />
                <path d="M 250 310 C 360 310, 370 90, 250 90" />
                {/* Arrows on lines (externamente saem do Norte magnético no polo sul e entram no Sul magnético no polo norte) */}
                <path d="M 98 200 L 98 190" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
                <path d="M 402 200 L 402 190" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
              </g>
            )}

            {/* Earth Sphere */}
            <circle cx="250" cy="200" r="100" fill="url(#earthGrad)" stroke="#38bdf8" strokeWidth="2" />

            {/* Continents stylized */}
            <path
              d="M 210 160 Q 230 140 260 150 Q 275 170 240 190 Q 220 180 210 160 Z"
              fill="#22c55e"
              opacity="0.6"
            />
            <path
              d="M 230 220 Q 255 210 270 235 Q 260 270 240 280 Q 225 250 230 220 Z"
              fill="#22c55e"
              opacity="0.6"
            />

            {/* Inner Earth Bar Magnet (Dipole) */}
            <g transform="translate(236, 125)">
              {/* Top half: SUL MAGNÉTICO (no norte geográfico) */}
              <rect x="0" y="0" width="28" height="75" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="14" y="42" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">S</text>
              <text x="14" y="60" fill="#bae6fd" fontSize="9" textAnchor="middle">Mag</text>

              {/* Bottom half: NORTE MAGNÉTICO (no sul geográfico) */}
              <rect x="0" y="75" width="28" height="75" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
              <text x="14" y="115" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">N</text>
              <text x="14" y="133" fill="#fee2e2" fontSize="9" textAnchor="middle">Mag</text>
            </g>

            {/* Geographic Labels */}
            <text x="250" y="55" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              ▲ Polo Norte Geográfico
            </text>
            <text x="250" y="68" fill="#38bdf8" fontSize="10" textAnchor="middle">
              (Abriga o Polo SUL Magnético)
            </text>

            <text x="250" y="348" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              ▼ Polo Sul Geográfico
            </text>
            <text x="250" y="361" fill="#f87171" fontSize="10" textAnchor="middle">
              (Abriga o Polo NORTE Magnético)
            </text>

            {/* Auroras Glow Over the Poles */}
            <g opacity={solarWindActive ? 1 : 0.35} className="transition-opacity duration-500">
              {/* Aurora Boreal (North) */}
              <ellipse cx="250" cy="98" rx="42" ry="12" fill="url(#auroraNorthGrad)" />
              <text x="250" y="93" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                Aurora Boreal
              </text>

              {/* Aurora Austral (South) */}
              <ellipse cx="250" cy="302" rx="42" ry="12" fill="url(#auroraSouthGrad)" />
              <text x="250" y="306" fill="#67e8f9" fontSize="9" fontWeight="bold" textAnchor="middle">
                Aurora Austral
              </text>
            </g>

            {/* Draggable/Movable Compass */}
            <g transform={`translate(${compassX}, ${compassY})`} className="cursor-pointer">
              {/* Compass Body */}
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" />

              {/* Needle rotating toward Magnetic South (Geographic North) */}
              <g transform={`rotate(${angleToMagneticSouth})`}>
                {/* Red North Needle (points to Geo North / Mag South) */}
                <polygon points="0,-18 5,0 -5,0" fill="#ef4444" />
                {/* White/Blue South Needle */}
                <polygon points="0,18 5,0 -5,0" fill="#94a3b8" />
              </g>
            </g>
          </svg>

          {/* Compass Slider Position Control */}
          <div className="w-full max-w-md mt-2 flex items-center gap-3">
            <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Posicionar Bússola na Órbita:
            </span>
            <input
              type="range"
              min="0"
              max="360"
              value={compassAngleDeg}
              onChange={(e) => handleCompassMove(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Conceptual Sidebar Explanations */}
        <div className="space-y-4">
          {/* Card: O Mistério da Bússola */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5" />
              Por que a Bússola Aponta para o Norte?
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A agulha da bússola é um pequeno ímã. Como polos de <strong>nomes diferentes se atraem</strong>, o polo <strong>Norte</strong> da agulha é atraído em direção ao <strong>Polo Sul Magnético</strong> da Terra, que fica localizado geograficamente no hemisfério Norte!
            </p>
            <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
              Norte da Agulha ➔ Atraído pelo ➔ Sul Magnético da Terra (Norte Geográfico)
            </div>
          </div>

          {/* Card: Como Nascem as Auroras */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Mecanismo Físico das Auroras
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O Sol emite continuamente o <strong>vento solar</strong> (partículas eletrizadas de alta velocidade). O campo magnético terrestre (magnetosfera) deflete essas cargas, canalizando-as pelos funis polares:
            </p>
            <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc marker:text-emerald-400">
              <li><strong className="text-emerald-300">Aurora Boreal:</strong> Ocorre no Hemisfério Norte.</li>
              <li><strong className="text-cyan-300">Aurora Austral:</strong> Ocorre no Hemisfério Sul.</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              O brilho verde e violeta surge da colisão dessas partículas com os átomos de oxigênio e nitrogênio na alta atmosfera.
            </p>
          </div>

          {/* Quick Tip */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong>Regra das Linhas B:</strong> As linhas saem externamente do Norte e entram no Sul, formando sempre circuitos fechados contínuos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Magnet, Zap, Globe, Hand, Calculator, Sparkles } from 'lucide-react';
import { MagnetLab } from './simulators/MagnetLab';
import { CircuitEnergyLab } from './simulators/CircuitEnergyLab';
import { EarthMagnetismLab } from './simulators/EarthMagnetismLab';
import { OerstedLab } from './simulators/OerstedLab';
import { FieldCalculatorLab } from './simulators/FieldCalculatorLab';

interface SimulatorsHubProps {
  onXpEarned: (xp: number, badgeNames: string[]) => void;
}

type SimulatorId = 'magnet' | 'circuit' | 'earth' | 'oersted' | 'field';

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({ onXpEarned }) => {
  const [activeSimulator, setActiveSimulator] = useState<SimulatorId>('magnet');

  return (
    <div className="space-y-6">
      {/* Header & Simulator Navigation Bar */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
              Bancada de Laboratório Virtual
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Simuladores de Física Interativa
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Experimente livremente as leis do eletromagnetismo e observe os fenômenos em tempo real
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interações concedem XP e desbloqueiam medalhas!</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveSimulator('magnet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeSimulator === 'magnet'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Magnet className="w-4 h-4 text-rose-400" />
            1. Laboratório de Ímãs
          </button>

          <button
            onClick={() => setActiveSimulator('circuit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeSimulator === 'circuit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            2. Circuito & Energia
          </button>

          <button
            onClick={() => setActiveSimulator('earth')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeSimulator === 'earth'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-400" />
            3. Terra & Auroras
          </button>

          <button
            onClick={() => setActiveSimulator('oersted')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeSimulator === 'oersted'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Hand className="w-4 h-4 text-emerald-400" />
            4. Oersted & Mão Direita
          </button>

          <button
            onClick={() => setActiveSimulator('field')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeSimulator === 'field'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            5. Calculadora de Campo (SI)
          </button>
        </div>
      </div>

      {/* Render Active Simulator */}
      <div>
        {activeSimulator === 'magnet' && <MagnetLab onXpEarned={onXpEarned} />}
        {activeSimulator === 'circuit' && <CircuitEnergyLab onXpEarned={onXpEarned} />}
        {activeSimulator === 'earth' && <EarthMagnetismLab onXpEarned={onXpEarned} />}
        {activeSimulator === 'oersted' && <OerstedLab onXpEarned={onXpEarned} />}
        {activeSimulator === 'field' && <FieldCalculatorLab onXpEarned={onXpEarned} />}
      </div>
    </div>
  );
};

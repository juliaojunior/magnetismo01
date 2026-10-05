import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Flame, RotateCw, BatteryCharging, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storage';

interface CircuitEnergyLabProps {
  onXpEarned?: (xp: number, badgeNames: string[]) => void;
}

type DeviceType = 'gerador' | 'receptor' | 'resistor';

export const CircuitEnergyLab: React.FC<CircuitEnergyLabProps> = ({ onXpEarned }) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('resistor');
  const [circuitClosed, setCircuitClosed] = useState(false);
  const [testedDevices, setTestedDevices] = useState<Set<DeviceType>>(new Set(['resistor']));

  const handleDeviceChange = (device: DeviceType) => {
    setSelectedDevice(device);
    setCircuitClosed(false);
    const updated = new Set(testedDevices).add(device);
    setTestedDevices(updated);

    if (updated.size === 3) {
      storageService.recordSimulationAction('circuit-lab', 'circuit-all-tested').then(res => {
        if (res.xpGained > 0 || res.newlyUnlockedBadges.length > 0) {
          onXpEarned?.(res.xpGained, res.newlyUnlockedBadges.map(b => b.title));
        }
      });
    }
  };

  const handleToggleCircuit = () => {
    const nextState = !circuitClosed;
    setCircuitClosed(nextState);
    if (nextState) {
      storageService.recordSimulationAction('circuit-lab', `turn-on-${selectedDevice}`).then(res => {
        if (res.xpGained > 0 || res.newlyUnlockedBadges.length > 0) {
          onXpEarned?.(res.xpGained, res.newlyUnlockedBadges.map(b => b.title));
        }
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Laboratório 2: Elementos de Circuito & Transformação de Energia
            </h3>
            <p className="text-xs text-slate-400">
              Diferencie na prática: Gerador (fornece), Receptor (trabalho útil) e Resistor (Efeito Joule exclusivo)
            </p>
          </div>
        </div>

        {/* Device Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => handleDeviceChange('resistor')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              selectedDevice === 'resistor' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            1. Resistor (Efeito Joule)
          </button>
          <button
            onClick={() => handleDeviceChange('receptor')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              selectedDevice === 'receptor' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            2. Receptor (Motor)
          </button>
          <button
            onClick={() => handleDeviceChange('gerador')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              selectedDevice === 'gerador' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            3. Gerador (Pilha/Fonte)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* Interactive Schematic Circuit Stage */}
        <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
          {/* Circuit Wire Diagram */}
          <div className="relative w-full max-w-2xl mx-auto py-6 px-4">
            {/* SVG Wires with animated electron current */}
            <svg className="w-full h-44" viewBox="0 0 600 180" fill="none">
              {/* Outer Loop Wire */}
              <rect
                x="40"
                y="30"
                width="520"
                height="120"
                rx="16"
                stroke="#334155"
                strokeWidth="4"
              />

              {/* Animated Current when closed */}
              {circuitClosed && (
                <rect
                  x="40"
                  y="30"
                  width="520"
                  height="120"
                  rx="16"
                  stroke={selectedDevice === 'resistor' ? '#f59e0b' : selectedDevice === 'receptor' ? '#0ea5e9' : '#10b981'}
                  strokeWidth="4"
                  strokeDasharray="12 12"
                  className="animate-pulse"
                />
              )}

              {/* Power Source Icon (Gerador Pilha) at Left */}
              <g transform="translate(18, 70)">
                <rect x="0" y="0" width="44" height="40" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <line x1="22" y1="10" x2="22" y2="30" stroke="#10b981" strokeWidth="3" />
                <line x1="12" y1="20" x2="32" y2="20" stroke="#10b981" strokeWidth="3" />
              </g>

              {/* Switch at Top */}
              <g transform="translate(260, 20)">
                <circle cx="10" cy="10" r="5" fill="#64748b" />
                <circle cx="70" cy="10" r="5" fill="#64748b" />
                {circuitClosed ? (
                  <line x1="10" y1="10" x2="70" y2="10" stroke="#22c55e" strokeWidth="4" />
                ) : (
                  <line x1="10" y1="10" x2="55" y2="-8" stroke="#ef4444" strokeWidth="4" />
                )}
              </g>

              {/* Tested Device at Right */}
              <g transform="translate(538, 65)">
                <rect x="0" y="0" width="44" height="50" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              </g>
            </svg>

            {/* Labels placed over the schematic */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                onClick={handleToggleCircuit}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition flex items-center gap-1.5 ${
                  circuitClosed
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500 text-rose-300'
                }`}
              >
                {circuitClosed ? 'Chave Fechada (Corrente i fluindo!)' : 'Chave Aberta (Circuito Desligado)'}
              </button>
            </div>

            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold block">Fonte (12V)</span>
            </div>

            {/* Device Representation Over Right Side */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-center w-28">
              {selectedDevice === 'resistor' && (
                <div className={`p-3 rounded-lg border transition-all ${
                  circuitClosed 
                    ? 'bg-amber-950/70 border-amber-500/80 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <Flame className={`w-8 h-8 mx-auto transition-transform ${
                    circuitClosed ? 'text-amber-400 scale-125 animate-bounce' : 'text-slate-500'
                  }`} />
                  <span className="text-[11px] font-bold text-white block mt-1">Resistor</span>
                  <span className="text-[9px] text-amber-300/80 font-mono block">
                    {circuitClosed ? '🔥 Aquecendo!' : 'Em repouso'}
                  </span>
                </div>
              )}

              {selectedDevice === 'receptor' && (
                <div className={`p-3 rounded-lg border transition-all ${
                  circuitClosed 
                    ? 'bg-sky-950/70 border-sky-500/80 shadow-lg shadow-sky-500/20' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <RotateCw className={`w-8 h-8 mx-auto transition-transform ${
                    circuitClosed ? 'text-sky-400 animate-spin' : 'text-slate-500'
                  }`} />
                  <span className="text-[11px] font-bold text-white block mt-1">Motor Elétrico</span>
                  <span className="text-[9px] text-sky-300/80 font-mono block">
                    {circuitClosed ? '⚙️ Girando rotor!' : 'Parado'}
                  </span>
                </div>
              )}

              {selectedDevice === 'gerador' && (
                <div className={`p-3 rounded-lg border transition-all ${
                  circuitClosed 
                    ? 'bg-emerald-950/70 border-emerald-500/80 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <BatteryCharging className={`w-8 h-8 mx-auto transition-transform ${
                    circuitClosed ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                  }`} />
                  <span className="text-[11px] font-bold text-white block mt-1">Bateria Primária</span>
                  <span className="text-[9px] text-emerald-300/80 font-mono block">
                    {circuitClosed ? '⚡ Fornecendo V' : 'Circuito aberto'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Energy Conversion Flow Diagram */}
          <div className="mt-4 p-4 bg-slate-900/90 rounded-lg border border-slate-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Equação Conceitual de Transformação de Energia:
            </div>

            {selectedDevice === 'resistor' && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded font-semibold border border-amber-500/30">
                  Energia Elétrica
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="px-2.5 py-1 bg-red-500/20 text-red-300 rounded font-semibold border border-red-500/30">
                  EXCLUSIVAMENTE Térmica (Calor)
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  — Regido pelo <strong>Efeito Joule</strong> puro. Exemplos: Chuveiro, torradeira, filamento térmico.
                </span>
              </div>
            )}

            {selectedDevice === 'receptor' && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 rounded font-semibold border border-sky-500/30">
                  Energia Elétrica
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded font-semibold border border-indigo-500/30">
                  Outra energia NÃO exclusivamente térmica (Mecânica / Química)
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  — Exemplos: Motores elétricos (ventilador, furadeira) e baterias em processo de recarga.
                </span>
              </div>
            )}

            {selectedDevice === 'gerador' && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                  Qualquer forma de energia (Química, Mecânica, Solar)
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded font-semibold border border-amber-500/30">
                  Energia Elétrica
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  — Exemplos: Pilhas galvânicas, baterias automotivas, dínamos de bicicleta, usinas geradoras.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Warning Callout for Exam (06/10) */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Atenção para a Prova (06/10):</strong> Todo motor esquenta um pouco devido a atrito e resistência interna, mas ele NUNCA é classificado como resistor na prova, pois seu objetivo é converter energia elétrica em <em>mecânica de movimento</em>!
          </div>
        </div>

        {/* Checklist of tested devices */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <span>Progresso de Exploração dos 3 Dispositivos:</span>
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 ${testedDevices.has('resistor') ? 'text-emerald-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Resistor
            </span>
            <span className={`flex items-center gap-1 ${testedDevices.has('receptor') ? 'text-emerald-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Receptor
            </span>
            <span className={`flex items-center gap-1 ${testedDevices.has('gerador') ? 'text-emerald-400' : 'text-slate-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Gerador
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

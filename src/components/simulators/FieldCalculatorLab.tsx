import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { storageService } from '../../services/storage';

interface FieldCalculatorLabProps {
  onXpEarned?: (xp: number, badgeNames: string[]) => void;
}

type ConductorType = 'fio-reto' | 'espira' | 'bobina-chata' | 'solenoide';

export const FieldCalculatorLab: React.FC<FieldCalculatorLabProps> = ({ onXpEarned }) => {
  const [conductorType, setConductorType] = useState<ConductorType>('fio-reto');
  
  // Variables with beginner-friendly defaults
  const [currentA, setCurrentA] = useState<number>(5); // 5 A
  const [dimensionValue, setDimensionValue] = useState<number>(10); // 10 cm default to trigger educational conversion
  const [dimensionUnit, setDimensionUnit] = useState<'m' | 'cm' | 'mm'>('cm');
  const [turnCountN, setTurnCountN] = useState<number>(50); // N espiras
  const [solenoidLengthValue, setSolenoidLengthValue] = useState<number>(25); // 25 cm default
  const [solenoidLengthUnit, setSolenoidLengthUnit] = useState<'m' | 'cm'>('cm');

  // μ0 constant = 4π * 10^-7 T·m/A
  const MU0 = 4 * Math.PI * 1e-7;

  // Convert distance/radius R to meters
  const rMeters = dimensionUnit === 'm' 
    ? dimensionValue 
    : dimensionUnit === 'cm' 
    ? dimensionValue / 100 
    : dimensionValue / 1000;

  // Convert solenoid length L to meters
  const lMeters = solenoidLengthUnit === 'm' 
    ? solenoidLengthValue 
    : solenoidLengthValue / 100;

  // Calculate B (Tesla)
  let calculatedB = 0;
  let formulaDisplay = '';
  let denominatorDisplay = '';
  let stepCalculationNote = '';

  if (conductorType === 'fio-reto') {
    calculatedB = (MU0 * currentA) / (2 * Math.PI * Math.max(0.0001, rMeters));
    formulaDisplay = 'B = (μ₀ · i) / (2πR)';
    denominatorDisplay = `2 · π · ${rMeters.toFixed(4)} m`;
    stepCalculationNote = `Como μ₀ = 4π × 10⁻⁷, o termo 4π simplifica com o 2π do denominador deixando 2! B = 2 × 10⁻⁷ · (${currentA} / ${rMeters.toFixed(4)})`;
  } else if (conductorType === 'espira') {
    calculatedB = (MU0 * currentA) / (2 * Math.max(0.0001, rMeters));
    formulaDisplay = 'B = (μ₀ · i) / (2R)';
    denominatorDisplay = `2 · ${rMeters.toFixed(4)} m (SEM π!)`;
    stepCalculationNote = `Atenção: NÃO há π no denominador na espira circular! B = (4π × 10⁻⁷ · ${currentA}) / (2 · ${rMeters.toFixed(4)})`;
  } else if (conductorType === 'bobina-chata') {
    calculatedB = (MU0 * currentA * turnCountN) / (2 * Math.max(0.0001, rMeters));
    formulaDisplay = 'B = (μ₀ · i · N) / (2R)';
    denominatorDisplay = `2 · ${rMeters.toFixed(4)} m (SEM π!)`;
    stepCalculationNote = `Multiplica-se pelo número de espiras N = ${turnCountN}. Cada espira soma sua contribuição.`;
  } else if (conductorType === 'solenoide') {
    calculatedB = (MU0 * currentA * turnCountN) / Math.max(0.0001, lMeters);
    formulaDisplay = 'B = (μ₀ · i · N) / L';
    denominatorDisplay = `${lMeters.toFixed(4)} m (comprimento L)`;
    stepCalculationNote = `O campo interno é praticamente uniforme e axial. O divisor é o comprimento L = ${lMeters.toFixed(4)} m.`;
  }

  // Formatting for scientific notation
  const bScientific = calculatedB.toExponential(3);
  const bMicroTesla = (calculatedB * 1e6).toFixed(2);

  const handleCompute = async () => {
    const { newlyUnlockedBadges, xpGained } = await storageService.recordSimulationAction('conductor-lab', 'conductor-calculated');
    if (xpGained > 0 || newlyUnlockedBadges.length > 0) {
      onXpEarned?.(xpGained, newlyUnlockedBadges.map(b => b.title));
    }
  };

  const isConvertingUnits = dimensionUnit !== 'm' || (conductorType === 'solenoide' && solenoidLengthUnit !== 'm');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Laboratório 5 & 6: Cálculo do Módulo do Campo Magnético & Unidades SI
            </h3>
            <p className="text-xs text-slate-400">
              Fórmula passo a passo das 4 geometrias, conversor de unidades e alerta da Prova (06/10)
            </p>
          </div>
        </div>

        {/* Conductor Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => { setConductorType('fio-reto'); handleCompute(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              conductorType === 'fio-reto' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Fio Reto (2πR)
          </button>
          <button
            onClick={() => { setConductorType('espira'); handleCompute(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              conductorType === 'espira' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Espira (2R)
          </button>
          <button
            onClick={() => { setConductorType('bobina-chata'); handleCompute(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              conductorType === 'bobina-chata' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Bobina Chata (N/2R)
          </button>
          <button
            onClick={() => { setConductorType('solenoide'); handleCompute(); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              conductorType === 'solenoide' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Solenoide (N/L)
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Interactive Controls & Formula Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Parameter Sliders & Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Parâmetros Físicos do Condutor
              </span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                μ₀ = 4π × 10⁻⁷ T·m/A
              </span>
            </div>

            {/* Parameter 1: Corrente Elétrica i (A) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Corrente Elétrica (<strong className="text-indigo-400">i</strong>):</span>
                <span className="font-mono text-emerald-400 font-bold">{currentA} A (Ampères)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={currentA}
                onChange={(e) => setCurrentA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 A</span>
                <span>12.5 A</span>
                <span>25 A</span>
              </div>
            </div>

            {/* Parameter 2: Raio ou Distância R */}
            {conductorType !== 'solenoide' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>
                    {conductorType === 'fio-reto' ? 'Distância ao fio (' : 'Raio da espira ('}
                    <strong className="text-indigo-400">R</strong>):
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="font-bold text-white">{dimensionValue}</span>
                    <select
                      value={dimensionUnit}
                      onChange={(e) => setDimensionUnit(e.target.value as 'm' | 'cm' | 'mm')}
                      className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-indigo-300 focus:outline-none"
                    >
                      <option value="cm">cm (centímetros)</option>
                      <option value="m">m (metros)</option>
                      <option value="mm">mm (milímetros)</option>
                    </select>
                  </div>
                </div>
                <input
                  type="range"
                  min={dimensionUnit === 'm' ? 0.01 : dimensionUnit === 'cm' ? 1 : 10}
                  max={dimensionUnit === 'm' ? 2 : dimensionUnit === 'cm' ? 100 : 1000}
                  step={dimensionUnit === 'm' ? 0.01 : 1}
                  value={dimensionValue}
                  onChange={(e) => setDimensionValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded flex items-center justify-between">
                  <span>Conversão obrigatória para o SI:</span>
                  <span className="text-amber-400 font-bold">R = {rMeters.toFixed(4)} m</span>
                </div>
              </div>
            )}

            {/* Parameter 3: Número de Espiras N (Bobina e Solenoide) */}
            {(conductorType === 'bobina-chata' || conductorType === 'solenoide') && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Número de Espiras (<strong className="text-indigo-400">N</strong>):</span>
                  <span className="font-mono text-sky-400 font-bold">{turnCountN} espiras (adimensional)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="5"
                  value={turnCountN}
                  onChange={(e) => setTurnCountN(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            )}

            {/* Parameter 4: Comprimento do Solenoide L */}
            {conductorType === 'solenoide' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Comprimento do Solenoide (<strong className="text-indigo-400">L</strong>):</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="font-bold text-white">{solenoidLengthValue}</span>
                    <select
                      value={solenoidLengthUnit}
                      onChange={(e) => setSolenoidLengthUnit(e.target.value as 'm' | 'cm')}
                      className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-indigo-300 focus:outline-none"
                    >
                      <option value="cm">cm (centímetros)</option>
                      <option value="m">m (metros)</option>
                    </select>
                  </div>
                </div>
                <input
                  type="range"
                  min={solenoidLengthUnit === 'm' ? 0.05 : 5}
                  max={solenoidLengthUnit === 'm' ? 2 : 200}
                  step={solenoidLengthUnit === 'm' ? 0.01 : 1}
                  value={solenoidLengthValue}
                  onChange={(e) => setSolenoidLengthValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded flex items-center justify-between">
                  <span>Conversão no SI:</span>
                  <span className="text-amber-400 font-bold">L = {lMeters.toFixed(4)} m</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Stage & Step-by-step Result (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Conductor Geometry Graphic */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
              {conductorType === 'fio-reto' && (
                <div className="text-center space-y-2">
                  <div className="relative w-40 h-28 mx-auto flex items-center justify-center">
                    <div className="w-1.5 h-full bg-amber-500 rounded" />
                    <div className="absolute w-24 h-16 rounded-full border border-dashed border-sky-400" />
                    <div className="absolute w-36 h-24 rounded-full border border-dashed border-sky-400/50" />
                    <span className="absolute right-2 top-4 text-[9px] font-mono text-sky-300">Ponto (R)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Condutor Retilíneo Infinito</span>
                </div>
              )}

              {conductorType === 'espira' && (
                <div className="text-center space-y-2">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center relative mx-auto shadow-lg shadow-amber-500/10">
                    <span className="text-xs font-bold text-sky-400 font-mono">B (Centro)</span>
                    <span className="absolute -bottom-4 text-[9px] font-mono text-slate-400">R = {rMeters.toFixed(2)} m</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Espira Circular Plana (No Centro)</span>
                </div>
              )}

              {conductorType === 'bobina-chata' && (
                <div className="text-center space-y-2">
                  <div className="w-24 h-24 rounded-full border-8 border-amber-600 flex items-center justify-center relative mx-auto shadow-lg shadow-amber-500/20">
                    <span className="text-xs font-bold text-sky-400 font-mono">B total (×{turnCountN})</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Bobina Chata ({turnCountN} espiras sobrepostas)</span>
                </div>
              )}

              {conductorType === 'solenoide' && (
                <div className="text-center space-y-2">
                  <div className="w-44 h-16 border-y-2 border-dashed border-sky-500 flex items-center justify-center relative mx-auto bg-sky-950/20 rounded px-2">
                    <span className="text-xs font-mono font-bold text-sky-300">Campo B Uniforme Axial ➔</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Interior do Solenoide ({turnCountN} espiras / {lMeters.toFixed(2)}m)</span>
                </div>
              )}
            </div>

            {/* Result Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-2 shadow-xl">
              <div className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider flex items-center justify-between">
                <span>Resultado do Campo (B):</span>
                <span className="font-mono text-slate-400 text-[10px]">{formulaDisplay}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-white tracking-tight">
                  {bScientific}
                </span>
                <span className="text-sm font-bold text-indigo-300">Tesla (T)</span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Equivalente a: <strong className="text-emerald-400">{bMicroTesla} μT</strong> (microTeslas)
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div><strong>Denominador:</strong> <span className="font-mono text-slate-300">{denominatorDisplay}</span></div>
                <div className="text-[10px] text-indigo-300">{stepCalculationNote}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Alert Section (06/10) */}
        {isConvertingUnits && (
          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-300 font-semibold block">
                Alerta de Gabarito para a Prova (06/10/2026):
              </strong>
              <p>
                Você informou grandezas em <strong>{dimensionUnit}</strong>. Na prova, jamais substitua diretamente centímetros ou milímetros! Converta sempre para metros:
              </p>
              <div className="font-mono text-[11px] text-amber-100 bg-amber-950/60 p-1.5 rounded">
                • {dimensionValue} {dimensionUnit} = {rMeters.toFixed(4)} m (dividido por {dimensionUnit === 'cm' ? '100' : '1000'})
              </div>
            </div>
          </div>
        )}

        {/* Quick Comparative Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Configuração</th>
                <th className="py-2.5 px-3">Fórmula do Módulo (B)</th>
                <th className="py-2.5 px-3">Denominador</th>
                <th className="py-2.5 px-3">Diferencial Crítico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              <tr className={conductorType === 'fio-reto' ? 'bg-indigo-950/40' : 'bg-slate-900/60'}>
                <td className="py-2 px-3 font-sans font-semibold text-white">Fio Reto Longo</td>
                <td className="py-2 px-3 text-indigo-300">B = (μ₀ · i) / (2πR)</td>
                <td className="py-2 px-3 text-amber-400">2πR</td>
                <td className="py-2 px-3 font-sans text-slate-400">Único que tem 2πR (comprimento da circunferência)</td>
              </tr>
              <tr className={conductorType === 'espira' ? 'bg-indigo-950/40' : 'bg-slate-900/60'}>
                <td className="py-2 px-3 font-sans font-semibold text-white">Espira Circular</td>
                <td className="py-2 px-3 text-indigo-300">B = (μ₀ · i) / (2R)</td>
                <td className="py-2 px-3 text-emerald-400">2R</td>
                <td className="py-2 px-3 font-sans text-slate-400">NÃO tem π no denominador</td>
              </tr>
              <tr className={conductorType === 'bobina-chata' ? 'bg-indigo-950/40' : 'bg-slate-900/60'}>
                <td className="py-2 px-3 font-sans font-semibold text-white">Bobina Chata</td>
                <td className="py-2 px-3 text-indigo-300">B = (μ₀ · i · N) / (2R)</td>
                <td className="py-2 px-3 text-emerald-400">2R</td>
                <td className="py-2 px-3 font-sans text-slate-400">Multiplica pelo número de espiras N</td>
              </tr>
              <tr className={conductorType === 'solenoide' ? 'bg-indigo-950/40' : 'bg-slate-900/60'}>
                <td className="py-2 px-3 font-sans font-semibold text-white">Solenoide</td>
                <td className="py-2 px-3 text-indigo-300">B = (μ₀ · i · N) / L</td>
                <td className="py-2 px-3 text-sky-400">L (metros)</td>
                <td className="py-2 px-3 font-sans text-slate-400">Campo interno uniforme axial dividido pelo comprimento L</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

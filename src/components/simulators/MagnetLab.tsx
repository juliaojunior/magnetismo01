import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Flame, Hammer, Magnet, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { storageService } from '../../services/storage';

interface MagnetPiece {
  id: string;
  northLabel: string;
  southLabel: string;
  width: number;
}

interface MagnetLabProps {
  onXpEarned?: (xp: number, badgeNames: string[]) => void;
}

export const MagnetLab: React.FC<MagnetLabProps> = ({ onXpEarned }) => {
  const [activeTab, setActiveTab] = useState<'interacao' | 'corte' | 'desmagnetizacao' | 'inducao' | 'origens'>('interacao');

  // Interação state
  const [magnet1Flipped, setMagnet1Flipped] = useState(false);
  const [magnet2Flipped, setMagnet2Flipped] = useState(false);
  const [distance, setDistance] = useState(140); // px

  // Corte state (inseparabilidade)
  const [cutPieces, setCutPieces] = useState<MagnetPiece[]>([
    { id: '1', northLabel: 'N', southLabel: 'S', width: 240 }
  ]);
  const [hasCutOnce, setHasCutOnce] = useState(false);

  // Desmagnetização state
  const [temperature, setTemperature] = useState(25); // Celsius
  const [impacts, setImpacts] = useState(0);

  // Imantação temporária (pregos)
  const [nailCount, setNailCount] = useState(0);
  const [magnetAttached, setMagnetAttached] = useState(true);

  // Origins state
  const [selectedMaterial, setSelectedMaterial] = useState<'natural' | 'artificial'>('natural');

  // Trigger feedback
  const triggerAction = async (simKey: string) => {
    const { newlyUnlockedBadges, xpGained } = await storageService.recordSimulationAction('magnet-lab', simKey);
    if (xpGained > 0 || newlyUnlockedBadges.length > 0) {
      onXpEarned?.(xpGained, newlyUnlockedBadges.map(b => b.title));
    }
  };

  // Cutting logic
  const handleCut = () => {
    if (cutPieces.length >= 8) return;
    const newPieces: MagnetPiece[] = [];
    cutPieces.forEach((piece) => {
      const halfWidth = Math.max(38, Math.floor(piece.width / 2) - 4);
      newPieces.push({
        id: `${piece.id}-a`,
        northLabel: 'N',
        southLabel: 'S',
        width: halfWidth,
      });
      newPieces.push({
        id: `${piece.id}-b`,
        northLabel: 'N',
        southLabel: 'S',
        width: halfWidth,
      });
    });
    setCutPieces(newPieces);
    setHasCutOnce(true);
    triggerAction('magnet-cut');
  };

  const handleResetCut = () => {
    setCutPieces([{ id: '1', northLabel: 'N', southLabel: 'S', width: 240 }]);
    setHasCutOnce(false);
  };

  // Interaction logic
  const facing1 = magnet1Flipped ? 'N' : 'S'; // Right side of magnet 1
  const facing2 = magnet2Flipped ? 'S' : 'N'; // Left side of magnet 2
  const isAttracting = facing1 !== facing2;
  const forceMagnitude = Math.round(10000 / Math.pow(Math.max(40, distance), 1.5));

  // Magnetization calculation based on heat & mechanical impacts
  const thermalDisorder = Math.min(100, Math.max(0, (temperature - 25) * 0.35));
  const impactDisorder = Math.min(100, impacts * 12);
  const totalDisorder = Math.min(100, Math.round(thermalDisorder + impactDisorder));
  const remainingMagnetism = Math.max(0, 100 - totalDisorder);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Simulation Header & Tabs */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Magnet className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Laboratório 1: Propriedades Fundamentais dos Ímãs
            </h3>
            <p className="text-xs text-slate-400">
              Interação dipolar, corte sem monopolos, desmagnetização e indução em pregos
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('interacao')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'interacao' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bipolaridade
          </button>
          <button
            onClick={() => setActiveTab('corte')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'corte' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inseparabilidade (Corte)
          </button>
          <button
            onClick={() => setActiveTab('desmagnetizacao')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'desmagnetizacao' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Desmagnetização
          </button>
          <button
            onClick={() => setActiveTab('inducao')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'inducao' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Imantação Temporária
          </button>
          <button
            onClick={() => setActiveTab('origens')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'origens' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Naturais vs Artificiais
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="p-6 min-h-[380px] flex flex-col justify-between">
        {/* TAB 1: INTERAÇÃO E BIPOLARIDADE */}
        {activeTab === 'interacao' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Lei Fundamental da Bipolaridade
              </span>
              <p className="text-sm text-slate-300 mt-0.5">
                Polos de mesmo nome se <span className="text-amber-400 font-semibold">repelem</span>; polos de nomes diferentes se <span className="text-emerald-400 font-semibold">atraem</span>.
              </p>
            </div>

            {/* Visual Magnets Stage */}
            <div className="relative py-10 px-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Field Lines representation */}
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  <path d="M 120 100 C 180 30, 420 30, 480 100" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
                  <path d="M 120 100 C 180 170, 420 170, 480 100" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Force indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center">
                <div className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded border ${
                  isAttracting 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  {isAttracting ? '➔ ➔ FORÇA DE ATRAÇÃO (Polos Opostos) ⬅ ⬅' : '⬅ ⬅ FORÇA DE REPULSÃO (Polos Iguais) ➔ ➔'}
                  <span className="ml-2 opacity-80">| F ≈ {forceMagnitude} N (relativo)</span>
                </div>
              </div>

              {/* Magnet 1 */}
              <div className="flex items-center gap-1 z-10">
                <div className="flex rounded-md overflow-hidden shadow-lg border border-slate-700">
                  <div className={`w-18 h-14 flex items-center justify-center font-bold text-white transition-colors ${
                    magnet1Flipped ? 'bg-sky-600' : 'bg-red-600'
                  }`}>
                    {magnet1Flipped ? 'SUL' : 'NORTE'}
                  </div>
                  <div className={`w-18 h-14 flex items-center justify-center font-bold text-white transition-colors ${
                    magnet1Flipped ? 'bg-red-600' : 'bg-sky-600'
                  }`}>
                    {magnet1Flipped ? 'NORTE' : 'SUL'}
                  </div>
                </div>
              </div>

              {/* Distance gap with force arrows */}
              <div 
                style={{ width: `${distance}px` }} 
                className="h-14 flex items-center justify-center relative transition-all duration-150"
              >
                <div className="w-full border-t border-dashed border-slate-600 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1 text-[10px] font-mono text-slate-400">
                    d = {(distance / 10).toFixed(1)} cm
                  </span>
                </div>
              </div>

              {/* Magnet 2 */}
              <div className="flex items-center gap-1 z-10">
                <div className="flex rounded-md overflow-hidden shadow-lg border border-slate-700">
                  <div className={`w-18 h-14 flex items-center justify-center font-bold text-white transition-colors ${
                    magnet2Flipped ? 'bg-red-600' : 'bg-sky-600'
                  }`}>
                    {magnet2Flipped ? 'NORTE' : 'SUL'}
                  </div>
                  <div className={`w-18 h-14 flex items-center justify-center font-bold text-white transition-colors ${
                    magnet2Flipped ? 'bg-sky-600' : 'bg-red-600'
                  }`}>
                    {magnet2Flipped ? 'SUL' : 'NORTE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Ímã Esquerdo:</span>
                <button
                  onClick={() => {
                    setMagnet1Flipped(!magnet1Flipped);
                    triggerAction('flip-magnet');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  Girar 180°
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Aproximar / Afastar:</span>
                  <span className="font-mono text-indigo-400">{(distance / 10).toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="220"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Ímã Direito:</span>
                <button
                  onClick={() => {
                    setMagnet2Flipped(!magnet2Flipped);
                    triggerAction('flip-magnet');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  Girar 180°
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INSEPARABILIDADE DOS POLOS (CORTE) */}
        {activeTab === 'corte' && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                Princípio da Inseparabilidade dos Polos
              </span>
              <p className="text-sm text-slate-300 mt-1 max-w-xl mx-auto">
                Não existem monopolos magnéticos isolados na natureza! Use a serra para cortar o ímã ao meio e observe a formação instantânea de novos polos N e S.
              </p>
            </div>

            {/* Stage */}
            <div className="p-8 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[190px]">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <AnimatePresence>
                  {cutPieces.map((piece) => (
                    <motion.div
                      key={piece.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex rounded-md overflow-hidden shadow-md border border-slate-700/80"
                      style={{ width: `${piece.width}px`, height: '52px' }}
                    >
                      <div className="w-1/2 bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                        {piece.northLabel}
                      </div>
                      <div className="w-1/2 bg-sky-600 flex items-center justify-center text-xs font-bold text-white">
                        {piece.southLabel}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {hasCutOnce && (
                <div className="mt-5 text-center text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded">
                  <Sparkles className="w-3.5 h-3.5" />
                  Total de ímãs independentes: {cutPieces.length} | Monopolos obtidos: ZERO (0)!
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCut}
                disabled={cutPieces.length >= 8}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <Scissors className="w-4 h-4" />
                {cutPieces.length >= 8 ? 'Limite de Corte Atingido' : 'Cortar Ímã(s) ao Meio com Serra'}
              </button>

              {hasCutOnce && (
                <button
                  onClick={handleResetCut}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restaurar Ímã Original
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DESMAGNETIZAÇÃO */}
        {activeTab === 'desmagnetizacao' && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Desordem dos Domínios Magnéticos
              </span>
              <p className="text-sm text-slate-300 mt-1 max-w-xl mx-auto">
                Impactos mecânicos repetidos (quedas, marteladas) ou aquecimento térmico agitam os elétrons, desorientando os domínios internos e anulando a imantação.
              </p>
            </div>

            {/* Microscopic Domain Canvas Simulation */}
            <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Microscopic Domains Grid */}
              <div className="flex-1 w-full bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Domínios Magnéticos Microscópicos:</span>
                  <span className={`font-mono font-bold ${remainingMagnetism > 50 ? 'text-emerald-400' : remainingMagnetism > 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                    Imantação Útil: {remainingMagnetism}%
                  </span>
                </div>

                {/* 20 microscopic dipole arrows */}
                <div className="grid grid-cols-5 gap-2 p-3 bg-slate-950 rounded border border-slate-800/80">
                  {Array.from({ length: 20 }).map((_, idx) => {
                    // Calculate individual dipole angle based on disorder
                    const angleNoise = (totalDisorder / 100) * 180 * (Math.sin(idx * 7) > 0 ? 1 : -1);
                    return (
                      <div key={idx} className="h-8 flex items-center justify-center bg-slate-900 rounded border border-slate-800">
                        <div
                          style={{
                            transform: `rotate(${angleNoise}deg)`,
                            transition: 'transform 0.3s ease-out',
                          }}
                          className={`text-xs font-mono font-bold ${
                            remainingMagnetism > 30 ? 'text-red-500' : 'text-slate-600'
                          }`}
                        >
                          ➔
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disruption triggers */}
              <div className="w-full md:w-64 space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame className="w-3.5 h-3.5" /> Aquecimento:
                    </span>
                    <span className="font-mono">{temperature} °C</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="600"
                    step="25"
                    value={temperature}
                    onChange={(e) => {
                      setTemperature(Number(e.target.value));
                      triggerAction('heat-demagnetize');
                    }}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">Ponto Curie: ~580°C desmagnetiza por completo.</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-sky-400">
                      <Hammer className="w-3.5 h-3.5" /> Quedas / Pancadas:
                    </span>
                    <span className="font-mono">{impacts} batidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setImpacts(i => i + 1);
                        triggerAction('hammer-demagnetize');
                      }}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded transition flex items-center justify-center gap-1.5"
                    >
                      <Hammer className="w-3.5 h-3.5 text-amber-400" />
                      Martelar Ímã
                    </button>
                    {(temperature > 25 || impacts > 0) && (
                      <button
                        onClick={() => {
                          setTemperature(25);
                          setImpacts(0);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition"
                        title="Resfriar e Realinhar"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMANTAÇÃO TEMPORÁRIA POR INDUÇÃO */}
        {activeTab === 'inducao' && (
          <div className="space-y-5">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                Imantação Temporária por Indução
              </span>
              <p className="text-sm text-slate-300 mt-1 max-w-xl mx-auto">
                Objetos ferromagnéticos (pregos de ferro) em contato com um ímã tornam-se ímãs temporários por indução. A força decresce com a extensão da cadeia!
              </p>
            </div>

            {/* Stage */}
            <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
              {/* Permanent Magnet Header */}
              <div className="relative">
                <div className="flex rounded-md overflow-hidden shadow-lg border border-slate-700 w-36 h-10">
                  <div className="w-1/2 bg-red-600 flex items-center justify-center text-xs font-bold text-white">Norte</div>
                  <div className="w-1/2 bg-sky-600 flex items-center justify-center text-xs font-bold text-white">Sul</div>
                </div>

                {/* Vertical Chain of Induced Nails */}
                <div className="flex flex-col items-center mt-1">
                  {Array.from({ length: nailCount }).map((_, idx) => {
                    const relativeForce = Math.max(15, 100 - idx * 25);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: magnetAttached ? 1 : 0.2, y: magnetAttached ? 0 : 30 + idx * 10 }}
                        className="w-16 h-8 bg-slate-700 border-x-2 border-slate-500 rounded-sm flex items-center justify-between px-2 text-[10px] font-mono text-slate-200 my-0.5 shadow-sm"
                      >
                        <span className="text-red-400 font-bold">N</span>
                        <span className="text-[9px] text-slate-400">Prego {idx + 1}</span>
                        <span className="text-sky-400 font-bold">S</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {!magnetAttached && (
                <div className="mt-4 text-xs text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Ímã removido: os pregos perdem o magnetismo induzido e caem!
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setNailCount(c => Math.min(4, c + 1));
                  setMagnetAttached(true);
                  triggerAction('nail-chain');
                }}
                disabled={nailCount >= 4}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition"
              >
                + Adicionar Prego à Cadeia ({nailCount}/4)
              </button>

              <button
                onClick={() => {
                  setMagnetAttached(!magnetAttached);
                  triggerAction('detach-nail');
                }}
                disabled={nailCount === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg transition"
              >
                {magnetAttached ? 'Desconectar Ímã Principal' : 'Reconectar Ímã Principal'}
              </button>

              {nailCount > 0 && (
                <button
                  onClick={() => {
                    setNailCount(0);
                    setMagnetAttached(true);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NATURAIS VS ARTIFICIAIS */}
        {activeTab === 'origens' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSelectedMaterial('natural')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedMaterial === 'natural' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Ímãs Naturais (Magnetita - Fe3O4)
              </button>
              <button
                onClick={() => setSelectedMaterial('artificial')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedMaterial === 'artificial' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Ímãs Artificiais & Aplicações
              </button>
            </div>

            {selectedMaterial === 'natural' ? (
              <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-emerald-400">MINERAL NATURAL: MAGNETITA</div>
                  <h4 className="text-lg font-bold text-white">Pedra-Ímã Natural (Fe₃O₄)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Minerais de óxido de ferro com magnetismo próprio geológico. Já eram conhecidos na Grécia Antiga (província de Magnésia). Seu alinhamento magnético natural foi fixado pelo campo da Terra durante o resfriamento de magmas vulcânicos.
                  </p>
                  <div className="text-[11px] text-slate-400 border-l-2 border-indigo-500 pl-3">
                    Fórmula química fundamental citada no material: <strong className="text-white">Fe₃O₄</strong>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-lg border border-slate-800 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 via-stone-700 to-slate-900 border-2 border-stone-600 flex items-center justify-center shadow-inner">
                    <span className="text-2xl">🪨</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-2">Rocha de Magnetita Bruta</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4">
                <div className="text-xs font-mono text-indigo-400">MATERIAIS IMANTADOS INDUSTRIALMENTE</div>
                <h4 className="text-base font-bold text-white">Como São Produzidos e Onde São Usados</h4>
                <p className="text-xs text-slate-300">
                  Produzidos submetendo ligas ferromagnéticas (como neodímio, samário-cobalto ou alnico) a campos magnéticos intensos gerados por correntes elétricas ou por fricção mecânica.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xl mb-1">⚡</div>
                    <div className="text-xs font-bold text-white">Motores Elétricos</div>
                    <div className="text-[11px] text-slate-400 mt-1">Interação de ímãs para girar rotores mecânicos</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xl mb-1">🔊</div>
                    <div className="text-xs font-bold text-white">Alto-Falantes</div>
                    <div className="text-[11px] text-slate-400 mt-1">O ímã empurra a bobina vibratória gerando ondas sonoras</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xl mb-1">📡</div>
                    <div className="text-xs font-bold text-white">Captação de Sinais</div>
                    <div className="text-[11px] text-slate-400 mt-1">Captadores de guitarras elétricas, sensores de rotação</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Compass, RotateCw, Hand, HelpCircle, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { storageService } from '../../services/storage';

interface OerstedLabProps {
  onXpEarned?: (xp: number, badgeNames: string[]) => void;
}

export const OerstedLab: React.FC<OerstedLabProps> = ({ onXpEarned }) => {
  const [currentOn, setCurrentOn] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<'right' | 'left'>('right');
  const [compassPosition, setCompassPosition] = useState<'above' | 'below'>('above');
  const [activeTab, setActiveTab] = useState<'experimento' | 'mao-direita' | 'convencao-3d'>('experimento');

  // Interactive Right-Hand Rule demo state
  const [handCurrentDir, setHandCurrentDir] = useState<'up' | 'down'>('up');

  const triggerAction = async (simKey: string) => {
    const { newlyUnlockedBadges, xpGained } = await storageService.recordSimulationAction('oersted-lab', simKey);
    if (xpGained > 0 || newlyUnlockedBadges.length > 0) {
      onXpEarned?.(xpGained, newlyUnlockedBadges.map(b => b.title));
    }
  };

  const handleToggleCurrent = () => {
    const next = !currentOn;
    setCurrentOn(next);
    if (next) {
      triggerAction('oersted-switch-on');
    }
  };

  const handleTogglePolarity = () => {
    setCurrentDirection(prev => prev === 'right' ? 'left' : 'right');
    triggerAction('oersted-reverse-polarity');
  };

  // Compass deflection angle logic based on Right Hand Rule
  // If current is OFF: angle is 0 (pointing Geographic North / straight up)
  // If current is ON flowing RIGHT:
  // Above wire: field lines point out of screen / tangent -> deflects counter-clockwise
  // Below wire: deflects clockwise
  let deflectionAngle = 0;
  if (currentOn) {
    const baseDeflection = 55; // degrees
    const dirMultiplier = currentDirection === 'right' ? 1 : -1;
    const posMultiplier = compassPosition === 'above' ? -1 : 1;
    deflectionAngle = baseDeflection * dirMultiplier * posMultiplier;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header & Tabs */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Laboratório 4: O Eletromagnetismo de Oersted (1820) & Regra da Mão Direita
            </h3>
            <p className="text-xs text-slate-400">
              Cargas em movimento geram campo magnético B. Domine a regra da mão direita e a convenção ⊗ e ⊙
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('experimento')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'experimento' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Experimento (1820)
          </button>
          <button
            onClick={() => setActiveTab('mao-direita')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'mao-direita' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Regra da Mão Direita nº 1
          </button>
          <button
            onClick={() => setActiveTab('convencao-3d')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'convencao-3d' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Convenção 3D (⊗ e ⊙)
          </button>
        </div>
      </div>

      {/* Main Interactive Sandbox */}
      <div className="p-6">
        {/* TAB 1: EXPERIMENTO DE OERSTED */}
        {activeTab === 'experimento' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Hans Christian Oersted (1820)
              </span>
              <p className="text-sm text-slate-300 mt-0.5 max-w-xl mx-auto">
                Ligue o circuito e veja a agulha da bússola defletir instantaneamente! A corrente elétrica cria círculos de campo magnético ao redor do fio.
              </p>
            </div>

            {/* Circuit Bench Visualizer */}
            <div className="p-8 bg-slate-950/80 rounded-xl border border-slate-800 relative min-h-[320px] flex flex-col justify-between items-center">
              {/* Wire & Current flow */}
              <div className="w-full max-w-lg relative py-12 flex flex-col items-center">
                {/* Compass Container (Above or Below) */}
                <div className={`transition-all duration-300 z-20 ${compassPosition === 'above' ? 'mb-4' : 'mt-4 order-3'}`}>
                  <div className="relative flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">
                      Bússola posicionada {compassPosition === 'above' ? 'ACIMA' : 'ABAIXO'} do fio
                    </span>
                    {/* Compass Dial */}
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-amber-400/80 shadow-xl flex items-center justify-center relative">
                      {/* Compass Marks */}
                      <span className="absolute top-1 text-[9px] font-mono text-slate-500">N</span>
                      <span className="absolute bottom-1 text-[9px] font-mono text-slate-500">S</span>
                      <span className="absolute left-1 text-[9px] font-mono text-slate-500">O</span>
                      <span className="absolute right-1 text-[9px] font-mono text-slate-500">L</span>

                      {/* Rotating Magnetized Needle */}
                      <motion.div
                        animate={{ rotate: deflectionAngle }}
                        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                        className="w-full h-full flex items-center justify-center relative pointer-events-none"
                      >
                        {/* Red North Pole */}
                        <div className="absolute top-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[38px] border-b-red-500" />
                        {/* Silver/Blue South Pole */}
                        <div className="absolute bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[38px] border-t-slate-400" />
                        {/* Pivot Pin */}
                        <div className="w-3 h-3 rounded-full bg-amber-300 z-10 shadow" />
                      </motion.div>
                    </div>

                    <div className="text-[11px] font-mono mt-1 text-slate-300">
                      Deflexão: <span className={currentOn ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{deflectionAngle}°</span>
                    </div>
                  </div>
                </div>

                {/* Copper Wire Rod */}
                <div className="w-full h-4 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full shadow-md relative z-10 flex items-center justify-center order-2">
                  {currentOn && (
                    <motion.div
                      animate={{ x: currentDirection === 'right' ? [-200, 200] : [200, -200] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="flex items-center gap-6 text-white text-xs font-mono font-bold"
                    >
                      <span>i ➔</span>
                      <span>i ➔</span>
                      <span>i ➔</span>
                    </motion.div>
                  )}
                </div>

                {/* Battery Source in line */}
                <div className="w-full flex items-center justify-between mt-6 px-4 order-4">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Pólo Positivo (+) à {currentDirection === 'right' ? 'Esquerda' : 'Direita'}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Circuito: <strong className={currentOn ? 'text-emerald-400' : 'text-rose-400'}>{currentOn ? 'FECHADO (i > 0)' : 'ABERTO (i = 0)'}</strong>
                  </div>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 w-full max-w-xl text-center">
                {currentOn ? (
                  <span>
                    ⚡ A passagem de corrente <strong>i</strong> gerou um campo magnético <strong>B</strong> tangencial ao fio, forçando a agulha da bússola a se alinhar às linhas de indução!
                  </span>
                ) : (
                  <span>
                    ⚪ Circuito desligado: a bússola aponta naturalmente para o Norte geográfico da Terra (sem interferência).
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleToggleCurrent}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  currentOn
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                {currentOn ? 'Desligar Corrente Elétrica (i = 0)' : 'Ligar Corrente Elétrica (i > 0)'}
              </button>

              <button
                onClick={handleTogglePolarity}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                Inverter Sentido da Corrente ({currentDirection === 'right' ? '➔ Direita' : '⬅ Esquerda'})
              </button>

              <button
                onClick={() => setCompassPosition(p => p === 'above' ? 'below' : 'above')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Mover Bússola ({compassPosition === 'above' ? 'Passar para Baixo' : 'Passar para Cima'})
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REGRA DA MÃO DIREITA Nº 1 */}
        {activeTab === 'mao-direita' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                Regra da Mão Direita n.º 1 (Fundamental)
              </span>
              <p className="text-sm text-slate-300 mt-0.5 max-w-xl mx-auto">
                Posicione o <strong>polegar direito</strong> apontando no sentido da corrente elétrica (i). Os <strong>quatro dedos curvados</strong> indicam a orientação das linhas circulares do vetor campo magnético (B).
              </p>
            </div>

            <div className="p-8 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Graphic Wire with Rotating Concentric Circles */}
              <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 300 240">
                  {/* Concentric Ellipses (Field Lines) */}
                  <ellipse cx="150" cy="120" rx="90" ry="35" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
                  <ellipse cx="150" cy="120" rx="55" ry="22" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                  {/* Wire passing vertically through center */}
                  <line x1="150" y1="20" x2="150" y2="220" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />

                  {/* Arrow indicating current on the wire */}
                  {handCurrentDir === 'up' ? (
                    <g transform="translate(150, 40)">
                      <polygon points="0,-10 6,6 -6,6" fill="#ffffff" />
                      <text x="14" y="2" fill="#ffffff" fontSize="11" fontWeight="bold">i (para cima)</text>
                    </g>
                  ) : (
                    <g transform="translate(150, 195)">
                      <polygon points="0,10 6,-6 -6,-6" fill="#ffffff" />
                      <text x="14" y="2" fill="#ffffff" fontSize="11" fontWeight="bold">i (para baixo)</text>
                    </g>
                  )}

                  {/* Direction of B around the circle */}
                  {handCurrentDir === 'up' ? (
                    // Counter-clockwise from top view
                    <g fill="#38bdf8">
                      {/* Front arc: pointing right */}
                      <path d="M 145 142 L 155 142 L 150 148 Z" />
                      <text x="160" y="152" fill="#38bdf8" fontSize="10" fontWeight="bold">Vetor B</text>
                      {/* Back arc: pointing left */}
                      <path d="M 155 98 L 145 98 L 150 92 Z" />
                    </g>
                  ) : (
                    // Clockwise from top view
                    <g fill="#38bdf8">
                      <path d="M 155 142 L 145 142 L 150 148 Z" />
                      <text x="160" y="152" fill="#38bdf8" fontSize="10" fontWeight="bold">Vetor B</text>
                      <path d="M 145 98 L 155 98 L 150 92 Z" />
                    </g>
                  )}
                </svg>

                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400">
                  Fio Retilíneo Infinito · Linhas Circulares Concêntricas
                </div>
              </div>

              {/* Hand Rule Guidance */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Hand className="w-4 h-4" />
                    Como Aplicar no Papel ou Prova
                  </div>
                  <div className="text-xs text-slate-300 space-y-2">
                    <p>
                      <strong>1. Polegar:</strong> Estique o polegar da mão DIREITA no sentido que a corrente elétrica <em>i</em> está fluindo pelo fio.
                    </p>
                    <p>
                      <strong>2. Quatro dedos:</strong> Feche a mão como se estivesse segurando o fio condutor. O sentido de curvatura dos seus dedos dá o sentido exato do vetor <strong>B</strong>!
                    </p>
                    <p>
                      <strong>3. De um lado do fio:</strong> O campo está <strong>saindo</strong> da folha (⊙).
                      <br />
                      <strong>Do outro lado do fio:</strong> O campo está <strong>entrando</strong> na folha (⊗).
                    </p>
                  </div>
                </div>

                {/* Direction Switcher */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-300">Direção da Corrente no Fio:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHandCurrentDir('up')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        handCurrentDir === 'up' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" /> Para Cima
                    </button>
                    <button
                      onClick={() => setHandCurrentDir('down')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        handCurrentDir === 'down' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" /> Para Baixo
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-rose-950/30 border border-rose-500/30 rounded text-[11px] text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NÃO ESQUEÇA:</strong> Use a mão DIREITA! Alunos canhotos ou distraídos que usam a mão esquerda erram o sinal de todas as questões.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONVENÇÃO ESPACIAL 3D (⊗ e ⊙) */}
        {activeTab === 'convencao-3d' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                Convenção Espacial Tridimensional
              </span>
              <p className="text-sm text-slate-300 mt-0.5 max-w-xl mx-auto">
                Como desenhar vetores que atravessam perpendicularmente o papel ou a tela plana?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card ⊗ Entrando no plano */}
              <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-rose-500 font-mono text-5xl font-black shadow-inner">
                  ⊗
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">⊗ Entrando no Plano</h4>
                  <span className="text-xs text-rose-400 font-mono block mt-0.5">Afastando-se de você</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Analogia da Flecha:</strong> Imagine um arqueiro atirando uma flecha na parede à sua frente. Ao se afastar, você vê a <em>cauda da flecha</em>, que tem aletas cruzadas em formato de <strong>X</strong>.
                </p>
                <div className="w-full p-2.5 bg-slate-900 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                  Vetor mergulha para dentro da folha
                </div>
              </div>

              {/* Card ⊙ Saindo do plano */}
              <div className="p-6 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-emerald-400 font-mono text-5xl font-black shadow-inner">
                  ⊙
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">⊙ Saindo do Plano</h4>
                  <span className="text-xs text-emerald-400 font-mono block mt-0.5">Aproximando-se de você</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Analogia da Flecha:</strong> Se uma flecha estivesse vindo em sua direção, você enxergaria a ponta metálica afiada, representada por um pequeno <strong>ponto central</strong>.
                </p>
                <div className="w-full p-2.5 bg-slate-900 rounded text-[11px] font-mono text-slate-400 border border-slate-800">
                  Vetor emerge da folha em direção aos seus olhos
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

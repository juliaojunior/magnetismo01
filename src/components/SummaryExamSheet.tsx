import React, { useState } from 'react';
import { FileText, Printer, Check, Copy, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export const SummaryExamSheet: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `CADERNO DE REVISÃO TEÓRICA E FUNDAMENTOS ELETROMAGNÉTICOS (PROVA: 06/10/2026)
1. PROPRIEDADES FUNDAMENTAIS DOS ÍMÃS:
- Naturais: Magnetita (Fe3O4)
- Artificiais: Imantados por correntes ou atrito (motores, alto-falantes, captação).
- Bipolaridade: Norte (N) e Sul (S). Polos iguais repelem; polos diferentes atraem.
- Inseparabilidade: Ao cortar ao meio, NÃO existem monopolos! Surgem dois novos ímãs N e S.
- Desmagnetização: Quedas/batidas ou aquecimento desordenam os domínios magnéticos.
- Imantação Temporária: Pregos viram ímãs por indução, enfraquecendo na cadeia.

2. ELEMENTOS DE CIRCUITO:
- Gerador: Qualquer forma de energia -> Energia Elétrica (pilhas, baterias, usinas).
- Receptor: Energia Elétrica -> Outra energia não exclusivamente térmica (motores, recarga).
- Resistor: Energia Elétrica -> Exclusivamente Térmica / Efeito Joule (chuveiro, ferro).

3. CAMPO MAGNÉTICO TERRESTRE E AURORAS:
- Linhas de Indução: Saem do polo Norte e entram no polo Sul (circuitos fechados).
- Terra: Polo Norte Geográfico abriga o Polo SUL Magnético!
- Bússola: O Norte da agulha aponta para o Norte geográfico porque é atraído pelo Sul magnético terrestre.
- Auroras Polares: Vento solar (partículas do Sol) colide com a alta atmosfera, canalizado aos polos (Boreal no Norte; Austral no Sul).

4. EXPERIMENTO DE OERSTED (1820) E REGRA DA MÃO DIREITA:
- Cargas elétricas em movimento (corrente i) geram campo magnético B.
- ⊗ Entrando no plano (afastando-se de você).
- ⊙ Saindo do plano (aproximando-se de você).
- Regra da Mão Direita nº 1: Polegar direito no sentido de i, 4 dedos curvados indicam as linhas circulares de B.

5. FÓRMULAS DO CAMPO MAGNÉTICO EM CONDUTORES:
- Fio Retilíneo Infinito: B = (μ0 · i) / (2πR)
- Espira Circular (no centro): B = (μ0 · i) / (2R) [SEM π no denominador!]
- Bobina Chata: B = (μ0 · i · N) / (2R) [Multiplica por N!]
- Solenoide: B = (μ0 · i · N) / L [Comprimento L no denominador; campo uniforme axial!]

6. UNIDADES NO SI E CONSTANTES:
- B: Tesla (T)
- i: Ampère (A)
- N: adimensional
- R e L: metros (m)
- μ0 = 4π × 10^-7 T·m/A
ATENÇÃO PROVA 06/10: Converta sempre cm/mm para metros antes de calcular!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Caderno de Revisão Teórica e Fundamentos Eletromagnéticos
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Guia Completo para a Prova de 06/10/2026
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aulas: 15/09/26 • 22/09/26 · Física Fundamental e Eletrodinâmica Básica
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white rounded-lg transition"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Grid of the 6 Core Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Item 1 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400">01. Propriedades dos Ímãs</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Naturais:</strong> Magnetita (<span className="text-white font-mono">Fe₃O₄</span>).</li>
            <li><strong>Artificiais:</strong> Imantados por corrente ou atrito (motores, caixas de som).</li>
            <li><strong>Bipolaridade:</strong> Polos iguais se repelem; diferentes se atraem.</li>
            <li><strong>Inseparabilidade:</strong> Cortar ao meio cria 2 novos ímãs. Monopolos NÃO existem!</li>
            <li><strong>Desmagnetização:</strong> Quedas e calor desalinham os domínios.</li>
            <li><strong>Indução:</strong> Pregos em cadeia perdem força progressivamente.</li>
          </ul>
        </div>

        {/* Item 2 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">02. Dispositivos de Circuito</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Gerador:</strong> Qualquer energia ➔ Elétrica (pilhas, usinas).</li>
            <li><strong>Receptor:</strong> Elétrica ➔ Mecânica/Química não puramente térmica (motores).</li>
            <li><strong>Resistor:</strong> Elétrica ➔ EXCLUSIVAMENTE calor via <em>Efeito Joule</em> (chuveiro).</li>
          </ul>
        </div>

        {/* Item 3 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400">03. Terra & Auroras</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Linhas de Indução:</strong> Saem do Norte e entram no Sul externamente.</li>
            <li><strong>Inversão Terrestre:</strong> Norte Geográfico abriga o <em>Sul Magnético</em>!</li>
            <li><strong>Bússola:</strong> Polo Norte da agulha é atraído pelo Sul Magnético terrestre.</li>
            <li><strong>Auroras:</strong> Vento solar canalizado aos polos (Boreal no Norte; Austral no Sul).</li>
          </ul>
        </div>

        {/* Item 4 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">04. Experimento de Oersted (1820)</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Unificação:</strong> Toda corrente elétrica <em>i</em> gera campo magnético <em>B</em> ao redor.</li>
            <li><strong>⊗:</strong> Entrando no plano (afastando-se de você).</li>
            <li><strong>⊙:</strong> Saindo do plano (aproximando-se de você).</li>
            <li><strong>Regra da Mão Direita nº 1:</strong> Polegar na corrente <em>i</em>, 4 dedos fecham no sentido de <em>B</em>.</li>
          </ul>
        </div>

        {/* Item 5 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400">05. Fórmulas de Campo B</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="bg-slate-900 p-1.5 rounded">
              <span className="text-slate-400 block font-sans text-[10px]">Fio Retilíneo Infinito:</span>
              <strong className="text-white">B = (μ₀ · i) / (2πR)</strong>
            </div>
            <div className="bg-slate-900 p-1.5 rounded">
              <span className="text-slate-400 block font-sans text-[10px]">Espira Circular (Centro):</span>
              <strong className="text-emerald-300">B = (μ₀ · i) / (2R)</strong>
            </div>
            <div className="bg-slate-900 p-1.5 rounded">
              <span className="text-slate-400 block font-sans text-[10px]">Bobina Chata:</span>
              <strong className="text-sky-300">B = (μ₀ · i · N) / (2R)</strong>
            </div>
            <div className="bg-slate-900 p-1.5 rounded">
              <span className="text-slate-400 block font-sans text-[10px]">Solenoide (Bobina Longa):</span>
              <strong className="text-indigo-300">B = (μ₀ · i · N) / L</strong>
            </div>
          </div>
        </div>

        {/* Item 6 */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400">06. Grandezas SI & Constante</span>
          </div>
          <ul className="text-xs font-mono text-slate-300 space-y-1">
            <li><strong>B:</strong> Tesla (T)</li>
            <li><strong>i:</strong> Ampère (A)</li>
            <li><strong>N:</strong> adimensional (número de voltas)</li>
            <li><strong>R e L:</strong> metros (m)</li>
            <li className="pt-1 text-amber-300">
              <strong>μ₀ = 4π × 10⁻⁷ T·m/A</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Golden Exam Warning Callout */}
      <div className="p-5 bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/50 rounded-xl flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs text-amber-200">
          <h4 className="text-sm font-bold text-amber-300">
            Checklist Anti-Pegadinha do Professor para a Prova de 06/10:
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-slate-200">
            <li>
              <strong>Conversão Obrigatória:</strong> Distâncias e raios dados em centímetros (cm) ou milímetros (mm) devem ser convertidos para metros (m) antes de qualquer cálculo (ex: 10 cm = 0,1 m).
            </li>
            <li>
              <strong>Denominador das Fórmulas:</strong> Apenas no fio reto infinito há o termo <strong>2πR</strong>. Na espira e bobina chata o denominador é apenas <strong>2R</strong> (sem π)!
            </li>
            <li>
              <strong>Solenoide:</strong> O divisor é o comprimento <strong>L</strong>, e o campo em seu interior é uniforme e axial.
            </li>
            <li>
              <strong>Mão Direita:</strong> Use SEMPRE a mão direita para não inverter os sentidos de ⊗ e ⊙!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

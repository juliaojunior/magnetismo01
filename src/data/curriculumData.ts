/**
 * Curriculum Data for MagnaFísica
 * Faithfully represents every single item, definition, formula, and exam tip from the PDF summary:
 * "Física: Magnetismo & Campo Magnético" - Prova 06/10/2026
 */

import { QuizQuestion, SectionContent } from '../types/physics';

export const SECTIONS_DATA: SectionContent[] = [
  {
    id: 'propriedades-imas',
    number: 1,
    title: 'Propriedades Fundamentais dos Ímãs',
    subtitle: 'Origens, Bipolaridade, Inseparabilidade e Domínios Magnéticos',
    summary: 'Os ímãs dividem-se em naturais (magnetita Fe3O4) e artificiais (imantados por correntes ou atrito). São amplamente utilizados em motores, alto-falantes e captação de sinais.',
    keyPoints: [
      {
        title: 'Naturais vs. Artificiais',
        description: 'Ímãs naturais possuem magnetismo próprio da rocha magnetita (Fe3O4). Ímãs artificiais são produzidos pela ação humana usando correntes elétricas ou atrito.',
        tag: 'Origem',
      },
      {
        title: 'Bipolaridade e Interação',
        description: 'Todo ímã possui dois polos inseparáveis: Norte (N) e Sul (S). Polos de mesmo nome se repelem (N-N ou S-S); polos de nomes diferentes se atraem (N-S).',
        tag: 'Regra de Ouro',
      },
      {
        title: 'Inseparabilidade dos Polos',
        description: 'Ao seccionar (cortar) um ímã ao meio, JAMAIS se obtêm monopolos isolados! Em vez disso, surgem imediatamente dois novos ímãs menores, cada um com polo Norte e Sul próprios.',
        tag: 'Conceito Vital',
      },
      {
        title: 'Desmagnetização',
        description: 'Impactos mecânicos repetidos (quedas, batidas) ou aquecimento térmico desordenam os domínios magnéticos microscópicos internos, reduzindo ou anulando a imantação.',
        tag: 'Domínios',
      },
      {
        title: 'Imantação Temporária',
        description: 'Objetos ferromagnéticos (como pregos de ferro) em contato com um ímã tornam-se ímãs temporários por indução. A força útil enfraquece à medida que a cadeia de pregos se estende.',
        tag: 'Indução',
      },
    ],
    simulationType: 'magnet-lab',
  },
  {
    id: 'circuitos-energia',
    number: 2,
    title: 'Elementos de Circuito: Transformação de Energia',
    subtitle: 'Distinção Conceitual entre Gerador, Receptor e Resistor',
    summary: 'Nos circuitos elétricos, a forma como a energia elétrica é manipulada define categoricamente o dispositivo de potência.',
    keyPoints: [
      {
        title: 'Gerador Elétrico',
        description: 'Converte qualquer forma de energia (química, mecânica, solar, etc.) em Energia Elétrica. Exemplos práticos: pilhas químicas, baterias de automóveis, usinas hidrelétricas e geradores eólicos.',
        tag: 'Fonte',
      },
      {
        title: 'Receptor Elétrico',
        description: 'Converte Energia Elétrica em outra forma de energia NÃO exclusivamente térmica. Exemplos práticos: motores elétricos (transformam eletricidade em movimento mecânico) e baterias em processo de recarga.',
        tag: 'Trabalho Útil',
      },
      {
        title: 'Resistor Elétrico',
        description: 'Converte Energia Elétrica EXCLUSIVAMENTE em Energia Térmica através do Efeito Joule. Exemplos práticos: chuveiros elétricos, ferros de passar e filamentos de aquecedores.',
        tag: 'Efeito Joule',
      },
    ],
    simulationType: 'circuit-lab',
    examWarning: 'Cuidado na prova: Motores elétricos aquecem um pouco, mas são RECEPTORES porque seu objetivo principal é produzir movimento mecânico, não apenas calor!',
  },
  {
    id: 'terra-auroras',
    number: 3,
    title: 'Campo Magnético Terrestre, Linhas & Auroras',
    subtitle: 'Geografia vs Magnetismo, Bússola e o Espetáculo das Auroras',
    summary: 'As linhas de indução magnética saem externamente do polo Norte e entram no polo Sul do ímã (formando circuitos fechados). A Terra funciona como um imenso dipolo magnético.',
    keyPoints: [
      {
        title: 'Sentido das Linhas de Indução',
        description: 'Externamente, as linhas saem do polo Norte (divergem) e entram no polo Sul (convergem). Por dentro do ímã, continuam do Sul para o Norte, formando loops sempre fechados.',
        tag: 'Linhas B',
      },
      {
        title: 'Geografia versus Magnetismo Terrestre',
        description: 'O Polo Norte Geográfico da Terra abriga aproximadamente o Polo SUL Magnético! E o Polo Sul Geográfico abriga o Polo NORTE Magnético.',
        tag: 'Inversão',
      },
      {
        title: 'Como a Bússola Funciona',
        description: 'A agulha magnética é um pequeno ímã. O polo Norte da agulha aponta para o Norte geográfico porque é fisicamente atraído pelo Polo Sul Magnético da Terra que ali se encontra.',
        tag: 'Atração',
      },
      {
        title: 'Auroras Polares (Boreal e Austral)',
        description: 'Ocorrem pela colisão e interação do vento solar (partículas eletrizadas emitidas pelo Sol) com a alta atmosfera terrestre, canalizadas e concentradas pelas linhas do campo magnético aos polos (Boreal no Norte; Austral no Sul).',
        tag: 'Fenômeno',
      },
    ],
    simulationType: 'earth-lab',
  },
  {
    id: 'oersted-mao-direita',
    number: 4,
    title: 'Experimento de Oersted & Regra da Mão Direita',
    subtitle: 'A Unificação Histórica de 1820 e a Convenção Tridimensional',
    summary: 'Hans Christian Oersted (1820) comprovou a unificação entre Eletricidade e Magnetismo: toda carga elétrica em movimento (corrente elétrica i) gera ao seu redor um campo magnético (B).',
    keyPoints: [
      {
        title: 'Descoberta de Oersted (1820)',
        description: 'Ao aproximar uma bússola de um fio percorrido por corrente elétrica, a agulha deflete perpendicularmente ao fio. Cargas em repouso geram apenas campo elétrico; cargas em movimento geram também campo magnético!',
        tag: 'Marco Histórico',
      },
      {
        title: 'Convenção Espacial Tridimensional',
        description: '⊗ (Círculo com X): Vetor ENTRANDO no plano da folha/tela (afastando-se de você, como a cauda de uma flecha). ⊙ (Círculo com Ponto): Vetor SAINDO do plano (aproximando-se de você, como a ponta da flecha).',
        tag: 'Representação 3D',
      },
      {
        title: 'Regra da Mão Direita n.º 1',
        description: 'Posicione o polegar da mão DIREITA esticado no sentido da corrente elétrica (i). Os quatro dedos curvados indicam a rotação e orientação das linhas circulares do vetor campo magnético (B).',
        tag: 'Mão Direita',
      },
    ],
    simulationType: 'oersted-lab',
    examWarning: 'Regra de ouro: use SEMPRE a mão DIREITA! Se usar a mão esquerda por engano na prova, o sentido do campo magnético sairá invertido.',
  },
  {
    id: 'calculo-condutores',
    number: 5,
    title: 'Cálculo do Módulo do Campo Magnético',
    subtitle: 'As 4 Geometrias Essenciais: Fio Reto, Espira, Bobina Chata e Solenoide',
    summary: 'A intensidade do campo magnético (B) depende da intensidade da corrente elétrica (i), do meio permeável (μ0) e da geometria espacial do condutor.',
    keyPoints: [
      {
        title: '1. Condutor Retilíneo (Fio Longo)',
        description: 'Fórmula: B = (μ0 · i) / (2πR). As linhas de indução são círculos concêntricos ao redor do fio. R é a distância perpendicular do ponto em metros.',
        tag: 'Denominador 2πR',
      },
      {
        title: '2. Espira Circular (no Centro)',
        description: 'Fórmula: B = (μ0 · i) / (2R). R é o raio da espira em metros. Note a AUSÊNCIA do fator π no denominador em comparação com o fio reto!',
        tag: 'Denominador 2R',
      },
      {
        title: '3. Bobina Chata (N espiras justapostas)',
        description: 'Fórmula: B = (μ0 · i · N) / (2R). N é o número de espiras sobrepostas. Como cada espira soma seu campo no centro, basta multiplicar a fórmula da espira por N.',
        tag: 'Multiplicador N',
      },
      {
        title: '4. Solenoide (Bobina Longa/Helicoidal)',
        description: 'Fórmula: B = (μ0 · i · N) / L. L é o comprimento do solenoide em metros. No interior do solenoide, o campo magnético é praticamente uniforme e axial (paralelo ao eixo).',
        tag: 'Comprimento L',
      },
    ],
    simulationType: 'conductor-lab',
    examWarning: 'ATENÇÃO MÁXIMA PARA A PROVA: Apenas no fio reto infinito há o termo 2πR no denominador (comprimento da circunferência). Na espira e bobina chata o denominador é apenas 2R!',
  },
  {
    id: 'grandezas-constantes',
    number: 6,
    title: 'Grandezas, Unidades no SI & Dicas da Prova',
    subtitle: 'Unidades Oficiais, Constante μ0 e Checklist Anti-Pegadinhas',
    summary: 'Revisão obrigatória de todas as grandezas físicas no Sistema Internacional (SI) e o alerta do professor para a prova de 06/10/2026.',
    keyPoints: [
      {
        title: 'B : Campo Magnético',
        description: 'Unidade no SI: Tesla (T). Mede a intensidade do fluxo magnético por área perpendicular.',
        tag: 'Tesla (T)',
      },
      {
        title: 'i : Corrente Elétrica',
        description: 'Unidade no SI: Ampère (A). Quantidade de carga elétrica que atravessa o condutor por segundo.',
        tag: 'Ampère (A)',
      },
      {
        title: 'N : Número de Espiras',
        description: 'Grandeza adimensional (número puro). Representa quantas voltas de fio foram enroladas.',
        tag: 'Número Puro',
      },
      {
        title: 'R e L : Distâncias e Raios',
        description: 'Unidade obrigatória no SI: metros (m). Jamais coloque centímetros ou milímetros diretamente na fórmula!',
        tag: 'Metros (m)',
      },
      {
        title: 'μ0 : Permeabilidade Magnética do Vácuo',
        description: 'Valor exato no vácuo: μ0 = 4π × 10^-7 T·m/A. Na maioria das contas com fio reto, o 2π ou 4π se cancela simplificando o cálculo!',
        tag: '4π × 10^-7',
      },
    ],
    simulationType: 'formula-lab',
    examWarning: 'Checklist da Prova (06/10): 1) Converta cm -> m (divida por 100) ou mm -> m (divida por 1000). 2) Verifique se o exercício pede no fio (2πR) ou na espira (2R). 3) Se for solenoide, divida por L!',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Section 1
  {
    id: 'q1-1',
    sectionId: 'propriedades-imas',
    question: 'Qual é o mineral natural responsável pelo magnetismo primitivo conhecido desde a antiguidade?',
    options: [
      'Pirita (FeS2)',
      'Magnetita (Fe3O4)',
      'Bauxita (Al2O3)',
      'Hematita pura (Fe2O3)'
    ],
    correctIndex: 1,
    explanation: 'A magnetita (óxido de ferro Fe3O4) é o mineral com magnetismo natural característico citado no caderno de revisão.',
    hint: 'Trata-se de um composto de ferro e oxigênio com fórmula química Fe3O4.',
    difficulty: 'iniciante',
  },
  {
    id: 'q1-2',
    sectionId: 'propriedades-imas',
    question: 'Se você pegar uma serra e serrar exatamente ao meio um ímã em barra, o que acontece fisicamente?',
    options: [
      'Obtêm-se dois monopolos isolados: um pedaço apenas Norte e outro apenas Sul.',
      'O ímã perde instantaneamente todo o seu magnetismo e vira metal neutro.',
      'Surgem dois novos ímãs completos menores, cada um contendo polos Norte e Sul próprios.',
      'Os polos mudam de nome para polo Positivo e polo Negativo.'
    ],
    correctIndex: 2,
    explanation: 'De acordo com o princípio da Inseparabilidade dos Polos, não existem monopolos magnéticos isolados na natureza. Ao cortar o ímã, novos polos complementares se formam nas extremidades cortadas.',
    hint: 'Lembre-se do princípio de inseparabilidade dos polos!',
    difficulty: 'iniciante',
  },
  {
    id: 'q1-3',
    sectionId: 'propriedades-imas',
    question: 'O que pode provocar a desmagnetização de um ímã permanente?',
    options: [
      'Pintar o ímã com tinta condutora.',
      'Impactos mecânicos repetidos (quedas, batidas) ou aquecimento excessivo.',
      'Guardar o ímã em um local escuro.',
      'Aproximar o ímã de um copo de água pura.'
    ],
    correctIndex: 1,
    explanation: 'Batidas fortes ou calor agitam e desordenam os domínios magnéticos microscópicos internos do material, desfazendo o alinhamento que gera o campo magnético macroscópico.',
    hint: 'Pense em energia térmica ou vibrações desordenando o interior da matéria.',
    difficulty: 'iniciante',
  },

  // Section 2
  {
    id: 'q2-1',
    sectionId: 'circuitos-energia',
    question: 'Um chuveiro elétrico comum transforma energia elétrica exclusivamente em energia térmica (calor). Como esse dispositivo é classificado?',
    options: [
      'Gerador elétrico',
      'Receptor elétrico',
      'Resistor elétrico (Efeito Joule)',
      'Indutor ideal'
    ],
    correctIndex: 2,
    explanation: 'Dispositivos que transformam energia elétrica exclusivamente em energia térmica através do Efeito Joule são chamados de Resistores.',
    hint: 'Exclusivamente calor = Efeito Joule!',
    difficulty: 'iniciante',
  },
  {
    id: 'q2-2',
    sectionId: 'circuitos-energia',
    question: 'Qual a diferença crucial de conversão de energia entre um Gerador e um Receptor elétrico?',
    options: [
      'O gerador converte energia elétrica em mecânica; o receptor produz eletricidade.',
      'O gerador converte qualquer energia em elétrica; o receptor consome elétrica gerando outra não exclusivamente térmica.',
      'Ambos fazem exatamente a mesma transformação mas com fios diferentes.',
      'O gerador só funciona com corrente contínua e o receptor só com alternada.'
    ],
    correctIndex: 1,
    explanation: 'O gerador fornece energia ao circuito transformando energia química/mecânica em elétrica (ex: pilhas). O receptor consome eletricidade para realizar trabalho útil não puramente térmico (ex: motores elétricos).',
    hint: 'Gerador cria potencial elétrico a partir de outra fonte; receptor usa eletricidade para mover, girar ou carregar.',
    difficulty: 'iniciante',
  },
  {
    id: 'q2-3',
    sectionId: 'circuitos-energia',
    question: 'Um motor de ventilador gira as pás e, após horas de uso, fica ligeiramente morno ao toque. Por que ele é classificado como RECEPTOR e não como resistor?',
    options: [
      'Porque ele consome pouca corrente elétrica.',
      'Porque sua função primordial é gerar energia mecânica de rotação, não sendo exclusivamente térmico.',
      'Porque ele possui um fusível interno.',
      'Porque motores elétricos nunca obedecem à lei da conservação de energia.'
    ],
    correctIndex: 1,
    explanation: 'Um receptor transforma energia elétrica em outra forma NÃO exclusivamente térmica. O aquecimento no motor é apenas uma perda parasitária; o objetivo principal é energia mecânica.',
    hint: 'A energia térmica no motor é secundária; o principal é o trabalho mecânico.',
    difficulty: 'intermediario',
  },

  // Section 3
  {
    id: 'q3-1',
    sectionId: 'terra-auroras',
    question: 'Em relação ao magnetismo do planeta Terra, qual das afirmações é fisicamente CORRETA?',
    options: [
      'O Polo Norte Geográfico coincide exatamente com o Polo Norte Magnético.',
      'A Terra não possui campo magnético interno observável.',
      'O Polo Norte Geográfico abriga aproximadamente o Polo Sul Magnético da Terra.',
      'A agulha da bússola aponta para o Norte porque é repelida pelo Sul da Terra.'
    ],
    correctIndex: 2,
    explanation: 'Como polos opostos se atraem, o polo Norte magnético da agulha da bússola só pode ser atraído em direção ao Polo Sul Magnético do planeta, que fica no hemisfério Norte geográfico.',
    hint: 'Lembre-se: polos opostos se atraem! Para onde aponta o Norte da agulha?',
    difficulty: 'iniciante',
  },
  {
    id: 'q3-2',
    sectionId: 'terra-auroras',
    question: 'Externamente a um ímã permanente em barra, como se orientam as linhas de indução magnética?',
    options: [
      'Saem do polo Sul e entram no polo Norte.',
      'Saem do polo Norte e entram no polo Sul em circuitos fechados.',
      'Vão em linha reta infinita sem nunca se curvar.',
      'Nascem no centro do ímã e explodem radialmente.'
    ],
    correctIndex: 1,
    explanation: 'Por convenção universal, no meio exterior ao ímã as linhas de campo saem do polo Norte e convergem entrando no polo Sul.',
    hint: 'Pense: o Norte "emite" linhas que circulam e "entram" no Sul.',
    difficulty: 'iniciante',
  },
  {
    id: 'q3-3',
    sectionId: 'terra-auroras',
    question: 'Como surgem as Auroras Polares (Boreal no hemisfério Norte e Austral no hemisfério Sul)?',
    options: [
      'Pela reflexão da luz solar no gelo da Antártida.',
      'Pela combustão de gases poluentes na troposfera.',
      'Pela colisão de partículas eletrizadas do vento solar canalizadas pelo campo magnético terrestre até a alta atmosfera.',
      'Por relâmpagos submarinos nos oceanos árticos.'
    ],
    correctIndex: 2,
    explanation: 'O vento solar carrega elétrons e prótons velozes. O campo magnético terrestre atua como escudo, canalizando essas partículas até os polos, onde se chocam com gases da atmosfera e brilham!',
    hint: 'Vento solar + canalização magnética para as regiões polares.',
    difficulty: 'iniciante',
  },

  // Section 4
  {
    id: 'q4-1',
    sectionId: 'oersted-mao-direita',
    question: 'Qual foi o experimento crucial conduzido por Hans Christian Oersted em 1820?',
    options: [
      'Provou que a luz é uma onda sonora de alta frequência.',
      'Descobriu que uma corrente elétrica percorrendo um fio deflete a agulha de uma bússola próxima.',
      'Criou a primeira bateria a vapor.',
      'Demonstrou que ímãs atraem pedaços de plástico.'
    ],
    correctIndex: 1,
    explanation: 'Oersted unificou Eletricidade e Magnetismo ao demonstrar empiricamente que cargas elétricas em movimento (corrente i) geram um campo magnético B ao seu redor.',
    hint: 'Corrente elétrica defletindo agulha magnética.',
    difficulty: 'iniciante',
  },
  {
    id: 'q4-2',
    sectionId: 'oersted-mao-direita',
    question: 'Na convenção espacial tridimensional em física, o que significa o símbolo ⊗ (círculo com uma cruz no interior)?',
    options: [
      'O vetor está saindo da folha, vindo em sua direção.',
      'O vetor está paralelo à margem da folha apontando para cima.',
      'O vetor está entrando no plano da folha, afastando-se de você.',
      'O campo magnético naquele ponto é nulo.'
    ],
    correctIndex: 2,
    explanation: 'Pense em uma flecha se afastando de você: você enxerga a sua cauda com penas em forma de cruz (⊗). Portanto, ⊗ significa "entrando no plano".',
    hint: 'Analogia da flecha: você vê a cauda da flecha sumindo na parede.',
    difficulty: 'iniciante',
  },
  {
    id: 'q4-3',
    sectionId: 'oersted-mao-direita',
    question: 'Para aplicar a Regra da Mão Direita nº 1 em um condutor retilíneo, o que o polegar e os outros quatro dedos curvados representam?',
    options: [
      'Polegar: Força magnética; Dedos: Sentido da gravidade.',
      'Polegar: Corrente elétrica (i); Dedos curvados: Orientação das linhas circulares de campo magnético (B).',
      'Polegar: Campo elétrico; Dedos: Direção da temperatura.',
      'Polegar: Sentido dos elétrons; Dedos: Resistência elétrica.'
    ],
    correctIndex: 1,
    explanation: 'Polegar direito = sentido da corrente convencional (i); os quatro dedos se fecham abraçando o condutor no sentido das linhas de indução circulares do vetor B.',
    hint: 'Polegar aponta para onde a corrente vai; os dedos abraçam o fio.',
    difficulty: 'iniciante',
  },

  // Section 5
  {
    id: 'q5-1',
    sectionId: 'calculo-condutores',
    question: 'No cálculo do campo magnético gerado por uma espira circular plana no seu centro, qual fórmula deve ser usada?',
    options: [
      'B = (μ0 · i) / (2πR)',
      'B = (μ0 · i) / (2R)',
      'B = (μ0 · i · N) / L',
      'B = (μ0 · R) / (2i)'
    ],
    correctIndex: 1,
    explanation: 'Para uma espira circular no centro: B = (μ0 · i) / (2R). Lembre-se do alerta da prova: NÃO há o fator π no denominador, ao contrário do fio retilíneo!',
    hint: 'Na espira circular no centro, o denominador é simplesmente 2R (sem π).',
    examTip: 'Pegadinha comum: confundir 2R (espira) com 2πR (fio reto)!',
    difficulty: 'iniciante',
  },
  {
    id: 'q5-2',
    sectionId: 'calculo-condutores',
    question: 'Como é o campo magnético no interior de um solenoide (bobina helicoidal longa percorrida por corrente)?',
    options: [
      'Totalmente nulo em qualquer ponto interno.',
      'Praticamente uniforme, axial (paralelo ao eixo) e calculado por B = (μ0 · i · N) / L.',
      'Aleatório e turbulento.',
      'Mais fraco no centro e extremamente forte nas pontas.'
    ],
    correctIndex: 1,
    explanation: 'Dentro de um solenoide longo, as linhas de campo são retas paralelas e muito densas, configurando um campo magnético praticamente uniforme e axial de módulo (μ0 · i · N) / L.',
    hint: 'Linhas paralelas no interior = campo uniforme; depende do comprimento L.',
    difficulty: 'iniciante',
  },
  {
    id: 'q5-3',
    sectionId: 'calculo-condutores',
    question: 'Uma bobina chata possui 50 espiras sobrepostas (N = 50). Se a corrente e o raio se mantiverem constantes, o campo no centro dessa bobina será quantas vezes maior que o de uma única espira?',
    options: [
      'Exatamente 50 vezes maior, pois o campo é proporcional ao número de espiras N.',
      'Permanecerá igual, pois as espiras anulam seus campos mutuamente.',
      'Será 25 vezes menor.',
      'Será 50π vezes maior.'
    ],
    correctIndex: 0,
    explanation: 'Como cada espira contribui com o mesmo campo vetorial no centro, os campos se somam linearmente: B_bobina = N · B_espira = (μ0 · i · N) / (2R). Com N=50, o campo é 50 vezes mais intenso.',
    hint: 'Cada espira enrolada no mesmo lugar soma sua força magnética.',
    difficulty: 'iniciante',
  },

  // Section 6
  {
    id: 'q6-1',
    sectionId: 'grandezas-constantes',
    question: 'Qual é a unidade oficial do Sistema Internacional (SI) para a intensidade do Campo Magnético (B)?',
    options: [
      'Weber (Wb)',
      'Gauss (G)',
      'Tesla (T)',
      'Coulomb (C)'
    ],
    correctIndex: 2,
    explanation: 'No Sistema Internacional (SI), o campo magnético é medido em Tesla (T), em homenagem ao cientista Nikola Tesla.',
    hint: 'Começa com a letra T.',
    difficulty: 'iniciante',
  },
  {
    id: 'q6-2',
    sectionId: 'grandezas-constantes',
    question: 'Um exercício da prova de física fornece a distância de um fio como "R = 20 cm". Qual procedimento é OBRIGATÓRIO antes de jogar esse número na fórmula?',
    options: [
      'Multiplicar por 100 para transformar em milímetros.',
      'Converter para metros no SI: R = 0,20 m (ou 2 × 10^-1 m).',
      'Manter em centímetros, pois a constante μ0 já converte automaticamente.',
      'Elevar 20 ao quadrado.'
    ],
    correctIndex: 1,
    explanation: 'Alerta da prova de 06/10: Todas as grandezas métricas (R e L) devem ser convertidas obrigatoriamente para metros (m) no SI! 20 cm = 0,20 m.',
    hint: 'Sempre divida centímetros por 100 para obter metros.',
    examTip: 'Atenção para a Prova: errar a conversão de cm para m é o erro mais frequente!',
    difficulty: 'iniciante',
  },
  {
    id: 'q6-3',
    sectionId: 'grandezas-constantes',
    question: 'Qual o valor oficial da permeabilidade magnética do vácuo (μ0) dado no caderno de revisão?',
    options: [
      'μ0 = 9 × 10^9 N·m²/C²',
      'μ0 = 3 × 10^8 m/s',
      'μ0 = 4π × 10^-7 T·m/A',
      'μ0 = 1,6 × 10^-19 C'
    ],
    correctIndex: 2,
    explanation: 'A permeabilidade magnética do vácuo é fixada em μ0 = 4π × 10^-7 T·m/A (Tesla metro por Ampère).',
    hint: 'Contém 4π vezes dez elevado a menos sete.',
    difficulty: 'iniciante',
  },
];

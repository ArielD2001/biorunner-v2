/**
 * data.js – BioRunner | Tema: Contracción del Músculo Liso
 * Universidad del Sinú
 *
 * Nivel 1: Estructura del Músculo Liso
 * Nivel 2: Mecanismo de Contracción
 * Nivel 3: Regulación y Patologías
 */

const CELL_TYPE = Object.freeze({ GOOD: 'good', BAD: 'bad' });

// ═══════════════════════════════════════════════════════════════
// NIVEL 1 – Estructura del Músculo Liso
// ═══════════════════════════════════════════════════════════════

const LEVEL1_GOOD = [
  {
    id: 'musculo_involuntario',
    name: 'Músculo Liso Involuntario',
    type: CELL_TYPE.GOOD,
    icon: '🧬',
    color: '#00897b',
    points: 80,
    description: 'El músculo liso es un tipo de tejido muscular involuntario: actúa sin que el individuo lo controle conscientemente. Responde a distintos estímulos (nerviosos, hormonales, mecánicos y químicos) bajo el gobierno del Sistema Nervioso Autónomo (SNA), tanto la rama simpática como la parasimpática.',
    fact: 'A diferencia del músculo estriado esquelético (voluntario) y cardíaco, el músculo liso no presenta estriaciones visibles al microscopio óptico, pues sus filamentos de actina y miosina no están organizados en sarcómeros regulares.'
  },
  {
    id: 'tipos_musculo_liso',
    name: 'Tipos de Músculo Liso',
    type: CELL_TYPE.GOOD,
    icon: '🔬',
    color: '#1565c0',
    points: 80,
    description: 'Existen dos tipos principales de músculo liso: el Unitario (o visceral) y el Multiunitario. El unitario conecta sus células mediante uniones en hendidura (gap junctions) y se contrae como una sola unidad coordinada, como en el intestino. El multiunitario tiene cada fibra con inervación independiente, permitiendo contracciones muy finas y precisas, como en el iris del ojo o los músculos ciliares.',
    fact: 'El músculo liso unitario es capaz de generar actividad eléctrica espontánea (marcapasos endógenos), lo que explica el peristaltismo intestinal que ocurre incluso sin estímulo nervioso externo.'
  },
  {
    id: 'actina',
    name: 'Filamento de Actina',
    type: CELL_TYPE.GOOD,
    icon: '🔴',
    color: '#e53935',
    points: 100,
    description: 'La actina (F-actina) forma filamentos delgados en el músculo liso. A diferencia del músculo estriado, los filamentos de actina se anclan en cuerpos densos distribuidos por el citoplasma y en la membrana plasmática, formando una red tridimensional.',
    fact: 'En el músculo liso, la proporción actina:miosina es de 12:1, mucho mayor que en el músculo estriado (2:1), lo que permite una mayor eficiencia contráctil.'
  },
  {
    id: 'miosina_ii',
    name: 'Miosina II (Filamento Grueso)',
    type: CELL_TYPE.GOOD,
    icon: '🟠',
    color: '#f57c00',
    points: 150,
    powerUp: 'speed-boost',
    description: 'La miosina II del músculo liso forma filamentos gruesos pero de manera dinámica, ensamblándose y desensamblándose según el estado de fosforilación de las cadenas ligeras reguladoras (MLC). Su cabeza hidroliza ATP para generar fuerza sobre los filamentos de actina.',
    fact: 'La miosina del músculo liso puede mantener contracción por largos periodos con muy poco consumo de ATP (el fenómeno "latch"), ideal para órganos como el útero o la vejiga.'
  },
  {
    id: 'cuerpos_densos',
    name: 'Cuerpos Densos',
    type: CELL_TYPE.GOOD,
    icon: '🟤',
    color: '#6d4c41',
    points: 120,
    description: 'Los cuerpos densos son estructuras proteicas análogas a las líneas Z del músculo estriado. Están compuestos principalmente de alfa-actinina y anclan los filamentos delgados de actina, transmitiéndoles la tensión generada durante la contracción a toda la célula.',
    fact: 'Los cuerpos densos asociados a la membrana plasmática permiten que la contracción celular se transmita a la matriz extracelular y células vecinas, generando tensión en el tejido completo.'
  }
];

const LEVEL1_BAD = [
  {
    id: 'espasmo_coronario',
    name: 'Vasoespasmo Coronario',
    type: CELL_TYPE.BAD,
    icon: '💥',
    color: '#b71c1c',
    enemy_type: 'virus',
    description: 'El vasoespasmo coronario es una contracción súbita y severa del músculo liso de la pared arterial coronaria. Ocurre por hiperreactividad del músculo liso vascular, frecuentemente por desequilibrio entre vasoconstrictores (endotelina-1, tromboxano A2) y vasodilatadores (NO, prostaciclina).',
    fact: 'El vasoespasmo puede causar el "angina de Prinzmetal" o variante, que ocurre en reposo y es reversible, a diferencia del infarto clásico por aterosclerosis.'
  },
  {
    id: 'histamina',
    name: 'Histamina (broncoespasmo)',
    type: CELL_TYPE.BAD,
    icon: '⚡',
    color: '#7b1fa2',
    enemy_type: 'bacteria',
    description: 'La histamina liberada por mastocitos activa receptores H1 en el músculo liso bronquial, desencadenando contracción sostenida (broncoespasmo). Aumenta el IP3 y el calcio intracelular, provocando una respuesta contráctil intensa que estrecha las vías aéreas.',
    fact: 'En el asma alérgica, el músculo liso bronquial sufre hipertrofia e hiperplasia crónica, aumentando su masa y reactividad. Los broncodilatadores (β2-agonistas) relajan el músculo liso actuando vía AMPc.'
  }
];

// ═══════════════════════════════════════════════════════════════
// NIVEL 2 – Mecanismo de Contracción
// ═══════════════════════════════════════════════════════════════

const LEVEL2_GOOD = [
  {
    id: 'calcio',
    name: 'Ión Calcio (Ca²⁺)',
    type: CELL_TYPE.GOOD,
    icon: '⚪',
    color: '#29b6f6',
    points: 200,
    powerUp: 'shield',
    description: 'El Ca²⁺ es el segundo mensajero central en la contracción del músculo liso. Puede entrar por canales de la membrana (VOC, receptor-operados) o ser liberado del retículo sarcoplásmico vía IP3 o rianodina. El aumento de Ca²⁺ citosólico de ~100 nM a ~1 µM desencadena la cascada contráctil.',
    fact: 'El calcio se une a la calmodulina en una proporción 4:1 (4 Ca²⁺ por calmodulina), lo que activa la quinasa de cadena ligera de miosina (MLCK) e inicia la contracción.'
  },
  {
    id: 'calmodulina',
    name: 'Calmodulina (CaM)',
    type: CELL_TYPE.GOOD,
    icon: '🟡',
    color: '#fdd835',
    points: 200,
    description: 'La calmodulina es una proteína sensor de calcio ubicua. Al unirse a 4 iones Ca²⁺ sufre un cambio conformacional y el complejo Ca²⁺-CaM activa a la MLCK (Miosina Light Chain Kinase), que fosforila la cadena ligera reguladora de la miosina (MLC20) en la Ser19, un paso esencial para iniciar la contracción.',
    fact: 'La calmodulina también activa la calcineurina (fosfatasa) y la eNOS. Su versatilidad la convierte en uno de los reguladores intracelulares más importantes del organismo.'
  },
  {
    id: 'mlck',
    name: 'MLCK (Quinasa de Miosina)',
    type: CELL_TYPE.GOOD,
    icon: '🟢',
    color: '#43a047',
    points: 250,
    description: 'La MLCK (Myosin Light Chain Kinase) es activada por el complejo Ca²⁺-calmodulina. Fosforila la cadena ligera reguladora de la miosina II (MLC20) en la Ser19, lo que aumenta la actividad ATPasa de la cabeza de miosina y permite el ciclo de puentes cruzados con la actina.',
    fact: 'La MLCK es inhibida por la PKA (fosforilación en sitios distintos), lo que explica la relajación del músculo liso vascular por los agonistas β2 que elevan AMPc.'
  }
];

const LEVEL2_BAD = [
  {
    id: 'angiotensina',
    name: 'Angiotensina II (AT1)',
    type: CELL_TYPE.BAD,
    icon: '🔴',
    color: '#d32f2f',
    enemy_type: 'virus',
    description: 'La Angiotensina II activa receptores AT1 en el músculo liso vascular, activando la fosfolipasa C vía Gq, generando IP3 y DAG. El IP3 libera Ca²⁺ del retículo sarcoplásmico y el DAG activa la PKC, ambos promoviendo contracción sostenida y vasoconstricción.',
    fact: 'Los IECA (Enalapril) y los ARA-II (Losartán) bloquean esta vía, reduciendo la presión arterial en hipertensión. Son de primera línea en hipertensión y protección renal.'
  },
  {
    id: 'rho_kinasa',
    name: 'RhoA/ROCK (Hiperactivada)',
    type: CELL_TYPE.BAD,
    icon: '🟣',
    color: '#6a1b9a',
    enemy_type: 'cancer',
    description: 'La vía RhoA/ROCK aumenta la sensibilidad al calcio del músculo liso. ROCK inhibe a la fosfatasa de cadena ligera de miosina (MLCP), manteniendo la MLC fosforilada (y la miosina activa) incluso con bajos niveles de Ca²⁺. La hiperactivación de esta vía es clave en el vasoespasmo y la hipertensión.',
    fact: 'Los inhibidores de ROCK (fasudil, Y-27632) son herramientas farmacológicas importantes para estudiar la vía. El fasudil está aprobado en Japón para el vasoespasmo cerebral post-hemorragia subaracnoidea.'
  },
  {
    id: 'endotelina1',
    name: 'Endotelina-1 (ET-1)',
    type: CELL_TYPE.BAD,
    icon: '🔵',
    color: '#1565c0',
    enemy_type: 'bacteria',
    description: 'La Endotelina-1 es el vasoconstrictor más potente conocido. Producida por células endoteliales, activa receptores ETA en el músculo liso vascular activando Gq → PLC → IP3 → Ca²⁺, y también activa RhoA/ROCK, generando vasoconstricción intensa y prolongada.',
    fact: 'Los antagonistas de endotelina (bosentán, ambrisentán) se usan en hipertensión arterial pulmonar, una enfermedad grave donde el músculo liso pulmonar se contrae de forma crónica reduciendo el flujo sanguíneo.'
  }
];

// ═══════════════════════════════════════════════════════════════
// NIVEL 3 – Regulación y Patologías
// ═══════════════════════════════════════════════════════════════

const LEVEL3_GOOD = [
  {
    id: 'oxido_nitrico',
    name: 'Óxido Nítrico (NO)',
    type: CELL_TYPE.GOOD,
    icon: '💨',
    color: '#26c6da',
    points: 300,
    powerUp: 'speed-boost',
    description: 'El NO es producido por la eNOS (endotelial NOS) en respuesta a acetilcolina, flujo laminar y otros estímulos. Difunde al músculo liso, activa la guanilato ciclasa soluble elevando GMPc, que activa la PKG. La PKG fosforila canales de K⁺ (hiperpolarización) y la MLCP (desfosforilación de MLC → relajación).',
    fact: 'La nitroglicerina y otros nitratos usan este mecanismo: se metabolizan a NO y producen relajación del músculo liso vascular, aliviando el dolor en angina de pecho.'
  },
  {
    id: 'prostaciclina',
    name: 'Prostaciclina (PGI₂)',
    type: CELL_TYPE.GOOD,
    icon: '🌿',
    color: '#66bb6a',
    points: 250,
    powerUp: 'shield',
    description: 'La PGI₂ es sintetizada por las células endoteliales a partir del ácido araquidónico vía ciclooxigenasa. Activa receptores IP en el músculo liso vascular, elevando AMPc vía Gs → adenilato ciclasa. El AMPc activa PKA, que fosforila e inhibe la MLCK y activa canales de K⁺ → relajación.',
    fact: 'El balance entre prostaciclina (vasodilatadora, antiagregante) y tromboxano A2 (vasoconstrictor, proagregante) es crítico para la homeostasis vascular. La aspirina a dosis bajas inhibe preferentemente el TXA2 plaquetario, desplazando este equilibrio hacia la prostaciclina.'
  },
  {
    id: 'mlcp',
    name: 'MLCP (Fosfatasa de Miosina)',
    type: CELL_TYPE.GOOD,
    icon: '🔷',
    color: '#42a5f5',
    points: 280,
    description: 'La MLCP (Myosin Light Chain Phosphatase) desfosforila la MLC20, inactivando la miosina y promoviendo la relajación del músculo liso. Es un regulador opuesto a la MLCK. La MLCP es inhibida por la vía RhoA/ROCK y activada por el GMPc/PKG, siendo el punto de convergencia de múltiples vías de relajación.',
    fact: 'La sensibilización al calcio, característica del músculo liso, se explica principalmente por la inhibición de la MLCP: permite contracción sostenida con Ca²⁺ moderado, ahorrando energía.'
  }
];

const LEVEL3_BAD = [
  {
    id: 'hipertension_pulmonar',
    name: 'Hipertensión Pulmonar',
    type: CELL_TYPE.BAD,
    icon: '🫁',
    color: '#c62828',
    enemy_type: 'cancer',
    description: 'La hipertensión arterial pulmonar (HAP) se caracteriza por remodelado patológico del músculo liso de las arterias pulmonares: hipertrofia, hiperplasia y contracción crónica. Aumenta la resistencia vascular pulmonar, sobrecargando el ventrículo derecho hasta llegar a insuficiencia cardíaca derecha.',
    fact: 'Las mutaciones en BMPR2 (receptor de proteína morfogenética ósea) están presentes en el 70% de la HAP familiar. BMPR2 normalmente inhibe la proliferación del músculo liso vascular.'
  },
  {
    id: 'tetanospasmin',
    name: 'Tetanospasmina (C. tetani)',
    type: CELL_TYPE.BAD,
    icon: '☠️',
    color: '#37474f',
    enemy_type: 'bacteria',
    description: 'La tetanospasmina es la neurotoxina del Clostridium tetani. Bloquea la liberación de GABA e inhibida la glicina en las interneuronas inhibidoras de la médula espinal, lo que provoca espasmos musculares sostenidos e incontrolables del músculo liso y estriado, incluyendo el "trismus" (bloqueo mandibular) y el opistótonos.',
    fact: 'La toxina tetánica es una de las más potentes conocidas: la dosis letal para humanos es de ~2.5 ng/kg. La vacuna DPT previene el tétanos mediante anticuerpos que neutralizan la toxina antes de que entre al SNC.'
  },
  {
    id: 'isquemia_intestinal',
    name: 'Isquemia Intestinal',
    type: CELL_TYPE.BAD,
    icon: '💀',
    color: '#bf360c',
    enemy_type: 'virus',
    description: 'La isquemia intestinal causa vasoespasmo del músculo liso mesentérico, reduciendo el flujo sanguíneo al intestino. El daño por reperfusión genera radicales libres adicionales. El músculo liso intestinal en isquemia sufre disfunción contráctil: inicialmente hipercontráctil y luego atónico, llevando a íleo paralítico.',
    fact: 'La isquemia mesentérica aguda tiene una mortalidad del 60-80% si no se diagnostica a tiempo. Los niveles de lactato en sangre y la TAC con contraste son clave para el diagnóstico rápido.'
  }
];

// ═══════════════════════════════════════════════════════════════
// Agrupación por nivel
// ═══════════════════════════════════════════════════════════════

const LEVELS_DATA = [
  { good: LEVEL1_GOOD, bad: LEVEL1_BAD, name: 'Nivel 1 – Estructura',    bg: 'muscle',   region: 'Tracto Gastrointestinal' },
  { good: LEVEL2_GOOD, bad: LEVEL2_BAD, name: 'Nivel 2 – Contracción',   bg: 'sarco',    region: 'Vías Respiratorias' },
  { good: LEVEL3_GOOD, bad: LEVEL3_BAD, name: 'Nivel 3 – Regulación',    bg: 'vascular', region: 'Sistema Vascular' },
];

const ALL_CELLS  = [...LEVEL1_GOOD, ...LEVEL1_BAD, ...LEVEL2_GOOD, ...LEVEL2_BAD, ...LEVEL3_GOOD, ...LEVEL3_BAD];
const GOOD_CELLS = [...LEVEL1_GOOD, ...LEVEL2_GOOD, ...LEVEL3_GOOD];
const BAD_CELLS  = [...LEVEL1_BAD,  ...LEVEL2_BAD,  ...LEVEL3_BAD];

// ═══════════════════════════════════════════════════════════════
// QUIZ – 5 preguntas por nivel (Contracción Músculo Liso)
// ═══════════════════════════════════════════════════════════════

const QUIZ_BY_LEVEL = [
  // ── Nivel 1: Estructura ──────────────────────────────────────
  [
    {
      question: '¿Cuál es la característica principal del músculo liso respecto a su control?',
      options: ['A) Es voluntario y está controlado por el sistema nervioso somático', 'B) Es involuntario y responde a estímulos bajo el control del sistema nervioso autónomo', 'C) Solo responde a estímulos hormonales, no nerviosos'],
      correct: 1,
      explanation: 'El músculo liso es involuntario: opera de forma inconsciente controlado por el SNA (ramas simpática y parasimpática). También responde a hormonas, factores locales y estiramiento mecánico.'
    },
    {
      question: '¿Cuál es la diferencia entre el músculo liso unitario y el multiunitario?',
      options: ['A) El unitario actúa de forma independiente; el multiunitario se contrae en bloque', 'B) El unitario está conectado por gap junctions y se contrae coordinadamente; el multiunitario tiene inervación individual por fibra', 'C) No existen diferencias funcionales entre ambos tipos'],
      correct: 1,
      explanation: 'El músculo liso unitario (visceral) usa uniones en hendidura para contraerse como una unidad (ej. intestino). El multiunitario tiene cada fibra con su propia inervación, permitiendo control fino (ej. iris del ojo).'
    },
    {
      question: '¿Cuál es la función principal de los cuerpos densos en el músculo liso?',
      options: ['A) Síntesis de ATP para la contracción', 'B) Anclar los filamentos de actina y transmitir la tensión contráctil', 'C) Liberar Ca²⁺ al citoplasma'],
      correct: 1,
      explanation: 'Los cuerpos densos (ricos en alfa-actinina) son el equivalente a las líneas Z: anclan la actina y distribuyen la fuerza por toda la célula muscular lisa.'
    },
    {
      question: '¿Cuál es la proporción actina:miosina en el músculo liso comparado con el estriado?',
      options: ['A) Es igual (2:1) en ambos tipos musculares', 'B) Es menor (1:2) en músculo liso', 'C) Es mayor (12:1) en músculo liso, lo que mejora su eficiencia'],
      correct: 2,
      explanation: 'El músculo liso tiene ~12 filamentos de actina por cada 1 de miosina (vs 2:1 en estriado), permitiendo mayor eficiencia en la generación de fuerza.'
    },
    {
      question: '¿Qué característica única tiene la miosina II del músculo liso respecto a su ensamblaje?',
      options: ['A) Se ensambla permanentemente en la célula', 'B) Se ensambla y desensambla dinámicamente según la fosforilación de MLC', 'C) No puede interactuar con filamentos de actina'],
      correct: 1,
      explanation: 'La miosina del músculo liso forma filamentos solo cuando la MLC20 está fosforilada. Este ensamblaje dinámico es único y no ocurre en músculo estriado.'
    },
    {
      question: '¿Qué es el fenómeno "latch" del músculo liso?',
      options: ['A) Relajación rápida tras un estímulo', 'B) Contracción sostenida con muy bajo consumo de ATP', 'C) Contracción rítmica involuntaria del músculo liso'],
      correct: 1,
      explanation: 'El "latch" permite que el músculo liso mantenga tensión (como en la vejiga llena o uréteres) con mínimo consumo de ATP. Se debe a ciclos lentos de puentes cruzados con alta afinidad.'
    },
    {
      question: '¿Qué desencadena el vasoespasmo coronario?',
      options: ['A) Acumulación de actina libre en el citoplasma', 'B) Desequilibrio entre vasoconstrictores (ET-1, TXA2) y vasodilatadores (NO, PGI2)', 'C) Déficit de filamentos de miosina en la arteria'],
      correct: 1,
      explanation: 'El vasoespasmo ocurre cuando predominan vasoconstrictores sobre vasodilatadores endoteliales, causando la contracción súbita del músculo liso de la pared arterial coronaria (Angina de Prinzmetal).'
    }
  ],
  // ── Nivel 2: Mecanismo de Contracción ────────────────────────
  [
    {
      question: '¿Cuál es el primer paso clave de la contracción en músculo liso?',
      options: ['A) La fosforilación directa de la actina por la PKC', 'B) El aumento de Ca²⁺ citosólico de ~100 nM a ~1 µM', 'C) La activación de la MLCP (fosfatasa de miosina)'],
      correct: 1,
      explanation: 'La señal iniciadora es el aumento de Ca²⁺ intracelular. Este calcio activa calmodulina → MLCK → fosforilación de MLC → contracción.'
    },
    {
      question: '¿Cuántos iones calcio se une a la calmodulina para activar la MLCK?',
      options: ['A) 1 ión Ca²⁺', 'B) 2 iones Ca²⁺', 'C) 4 iones Ca²⁺'],
      correct: 2,
      explanation: 'La calmodulina tiene 4 dominios EF-hand que unen 4 Ca²⁺. Solo con los 4 sitios ocupados sufre el cambio conformacional que activa a la MLCK.'
    },
    {
      question: '¿En qué residuo y posición fosforila la MLCK a la cadena ligera de miosina?',
      options: ['A) Treonina 18', 'B) Serina 19 (Ser19) de la MLC20', 'C) Tirosina 45'],
      correct: 1,
      explanation: 'La MLCK fosforila específicamente la Ser19 de la cadena ligera reguladora de 20 kDa (MLC20). Esta fosforilación activa la ATPasa de la cabeza de miosina iniciando los ciclos de puentes cruzados.'
    },
    {
      question: '¿Cómo actúa la Angiotensina II para provocar vasoconstricción?',
      options: ['A) Bloquea los canales de Ca²⁺ en la membrana', 'B) Activa receptores AT1 → PLC → IP3 → liberación de Ca²⁺ del RS + activación de RhoA/ROCK', 'C) Inhibe la MLCK directamente'],
      correct: 1,
      explanation: 'AT-II activa receptores AT1 acoplados a Gq → fosfolipasa C → IP3 que libera Ca²⁺ del RS y DAG que activa PKC. Además activa RhoA/ROCK para sensibilización al Ca²⁺.'
    },
    {
      question: '¿Qué mecanismo explica la "sensibilización al calcio" mediada por RhoA/ROCK?',
      options: ['A) ROCK aumenta la producción de IP3 para liberar más Ca²⁺', 'B) ROCK inhibe la MLCP, manteniendo la MLC fosforilada incluso con Ca²⁺ bajo', 'C) ROCK activa directamente los canales VOC de calcio'],
      correct: 1,
      explanation: 'ROCK fosforila e inactiva la subunidad reguladora de MLCP (MYPT1). Sin fosfatasa activa, la MLC permanece fosforilada y la miosina activa aunque el Ca²⁺ haya bajado, manteniendo la contracción.'
    }
  ],
  // ── Nivel 3: Regulación ───────────────────────────────────────
  [
    {
      question: '¿Cuál es la vía principal de relajación del NO en el músculo liso?',
      options: ['A) NO → guanilato ciclasa → ↑GMPc → PKG → ↑MLCP + ↓Ca²⁺ → relajación', 'B) NO → adenilato ciclasa → ↑AMPc → PKA → contracción', 'C) NO inhibe directamente la cabeza de miosina'],
      correct: 0,
      explanation: 'El NO activa la guanilil ciclasa soluble elevando GMPc. La PKG activada fosforila canales de K⁺ (hiperpolarización), la MLCP (relajación) y SERCA (recaptación de Ca²⁺) → relajación completa.'
    },
    {
      question: '¿Por qué la nitroglicerina alivia el dolor en la angina de pecho?',
      options: ['A) Inhibe la MLCK en el corazón, reduciendo la fuerza de contracción', 'B) Se metaboliza a NO, relajando el músculo liso vascular y aumentando el flujo coronario', 'C) Bloquea los receptores AT1 de angiotensina'],
      correct: 1,
      explanation: 'La nitroglicerina se convierte en NO, que relaja el músculo liso vascular: dilata venas (↓precarga) y arterias coronarias (↑flujo), aliviando la isquemia miocárdica.'
    },
    {
      question: '¿Qué es la Hipertensión Arterial Pulmonar (HAP) y qué gen se asocia a su forma familiar?',
      options: ['A) Hipotensión en la arteria pulmonar, asociada a mutaciones en eNOS', 'B) Remodelado patológico del músculo liso pulmonar con ↑resistencia; se asocia a mutaciones en BMPR2', 'C) Vasodilatación excesiva de las arterias pulmonares por defecto en RhoA'],
      correct: 1,
      explanation: 'La HAP implica hiperprolifferación e hipercontractilidad del músculo liso pulmonar. Las mutaciones en BMPR2 (receptor antiproliferativo) se hallan en el 70% de los casos familiares.'
    },
    {
      question: '¿Cómo actúa la prostaciclina (PGI₂) para relajar el músculo liso vascular?',
      options: ['A) Activa Gi → ↓AMPc → inhibe PKA → relajación', 'B) Activa receptores IP → Gs → ↑AMPc → PKA → inhibe MLCK + activa canales K⁺ → relajación', 'C) Bloquea directamente los canales de Ca²⁺ VOC'],
      correct: 1,
      explanation: 'La PGI₂ activa receptores IP acoplados a Gs, elevando AMPc. La PKA fosforila la MLCK (inactivándola) y abre canales de K⁺ (hiperpolarización), dos mecanismos convergentes de relajación.'
    },
    {
      question: '¿Por qué la tetanospasmina provoca espasmos musculares?',
      options: ['A) Activa directamente la MLCK del músculo liso', 'B) Bloquea neuronas inhibidoras (GABA/glicina) en la médula espinal, eliminando el freno a la contracción', 'C) Destruye los filamentos de actina en el músculo liso'],
      correct: 1,
      explanation: 'La toxina tetánica bloquea la liberación de GABA y glicina en interneuronas espinales inhibidoras. Sin inhibición, las motoneuronas disparan continuamente causando espasmos sostenidos (trismus, opistótonos).'
    }
  ]
];

// Alias compatibilidad
const QUIZ_QUESTIONS = QUIZ_BY_LEVEL[0];

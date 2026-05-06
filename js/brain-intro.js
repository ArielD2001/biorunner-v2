/**
 * brain-intro.js – BioRunner v2 | Universidad del Sinú
 * Maneja la visibilidad y el contenido dinámico del modal de introducción de cada nivel.
 */

class LevelIntroAlert {
  constructor(levelIndex, onComplete) {
    this.levelIndex = levelIndex;
    this.onComplete = onComplete;
    this.container = document.getElementById('level-intro-modal');

    // Referencias a elementos internos
    this.elIcon = document.getElementById('li-icon');
    this.elTitle = document.getElementById('li-title');
    this.elBody = document.getElementById('li-body');
    this.elHint = document.getElementById('li-hint');
    this.btnStart = document.getElementById('btn-li-start');

    // Datos académicos por nivel
    this.levelsData = [
      {
        icon: '🧬',
        title: 'NIVEL 1 – Estructura del Músculo Liso',
        theory: 'El <strong>músculo liso</strong> es involuntario y actúa bajo el control del SNA. Carece de estriaciones y se encuentra en órganos internos.',
        cards: [
          { tag: '🔬 Unitario', text: 'Células conectadas (gap junctions) que se contraen en bloque (ej. intestinos).', color: '#8bc34a' },
          { tag: '🎯 Multiunitario', text: 'Fibras independientes para control muy preciso (ej. iris del ojo).', color: '#2196f3' }
        ],
        risks: [
          { icon: '💥', text: '<strong>Vasoespasmo:</strong> Contracción súbita del músculo liso arterial.' },
          { icon: '⚡', text: '<strong>Broncoespasmo:</strong> Contracción por agentes como la Histamina.' }
        ],
        hint: 'Recolecta 🧬🔬 para aprender • Esquiva 🔴💥 para sobrevivir'
      },
      {
        icon: '⚙️',
        title: 'NIVEL 2 – Mecanismo de Contracción',
        theory: 'La contracción depende del <strong>Ión Calcio (Ca²⁺)</strong>. Al unirse a la Calmodulina, activa la quinasa de cadena ligera de miosina (MLCK).',
        cards: [
          { tag: '🔋 ATPasa', text: 'La miosina utiliza ATP para generar fuerza y deslizar los filamentos de actina.', color: '#ff9800' },
          { tag: '🔗 Latch-Bridge', text: 'Permite mantener la tensión por periodos largos con mínimo gasto de energía.', color: '#9c27b0' }
        ],
        risks: [
          { icon: '🔵', text: '<strong>Endotelina-1:</strong> El vasoconstrictor más potente, causa contracción intensa.' },
          { icon: '⚠️', text: '<strong>Sobrecarga de Calcio:</strong> Puede causar hiperreactividad muscular.' }
        ],
        hint: 'Fíjate en el Calcio 🔋 • Controla la energía celular'
      },
      {
        icon: '⚖️',
        title: 'NIVEL 3 – Regulación y Patologías',
        theory: 'El equilibrio entre contracción y relajación es vital. El <strong>Óxido Nítrico (NO)</strong> es el principal agente relajante vascular.',
        cards: [
          { tag: '💨 Óxido Nítrico', text: 'Eleva el GMPc para activar la relajación del músculo liso vascular.', color: '#00bcd4' },
          { tag: '🛡️ Prostaciclina', text: 'PGI₂ eleva el AMPc, protegiendo contra la vasoconstricción excesiva.', color: '#4caf50' }
        ],
        risks: [
          { icon: '🫁', text: '<strong>H. Pulmonar:</strong> Remodelado y contracción crónica de arterias pulmonares.' },
          { icon: '☠️', text: '<strong>Tetanospasmina:</strong> Toxina que causa espasmos musculares sostenidos.' }
        ],
        hint: 'Usa el NO 💨 para relajación • Cuidado con la H. Pulmonar 🫁'
      }
    ];
  }

  show() {
    if (!this.container) return;

    const data = this.levelsData[this.levelIndex];
    if (!data) {
      if (this.onComplete) this.onComplete();
      return;
    }

    // Llenar contenido
    this.elIcon.textContent = data.icon;
    this.elTitle.textContent = data.title;
    this.elHint.textContent = data.hint;

    this.elBody.innerHTML = `
      <div style=" margin-bottom: 15px;background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
        <div style="font-size: 10px; color: #8bc34a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">📚 Introducción Teórica</div>
        <p class="info-text" style="font-size: 13px; line-height: 1.5;">${data.theory}</p>
      </div>

      <div style="margin-bottom: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        ${data.cards.map(c => `
          <div style="background: ${c.color}15; padding: 12px; border-radius: 10px; border: 1px solid ${c.color}33;">
            <strong style="display: block; font-size: 11px; color: ${c.color}; margin-bottom: 5px;">${c.tag}</strong>
            <span style="font-size: 11px; opacity: 0.8;">${c.text}</span>
          </div>
        `).join('')}
      </div>

      <div style=" margin-bottom: 15px; background: rgba(244, 67, 54, 0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(244, 67, 54, 0.2);">
        <div style="font-size: 10px; color: #f44336; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">⚠️ Riesgos en este Nivel</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${data.risks.map(r => `
            <div style="display: flex; gap: 10px; align-items: center;">
              <span style="font-size: 18px;">${r.icon}</span>
              <span style="font-size: 11px;">${r.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Mostrar modal
    this.container.classList.remove('hidden');
    this._bindControls();
  }

  _bindControls() {
    this.btnStart.onclick = () => this.hide();

    this._keyHandler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.hide();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  hide() {
    this.container.style.opacity = '0';
    this.container.style.transition = 'opacity 0.3s ease';
    window.removeEventListener('keydown', this._keyHandler);

    setTimeout(() => {
      this.container.classList.add('hidden');
      this.container.style.opacity = '';
      this.container.style.transition = '';
      if (this.onComplete) this.onComplete();
    }, 300);
  }
}

// Para mantener compatibilidad con game.js (si usa el nombre antiguo)
window.Level1Alert = LevelIntroAlert;
window.LevelIntroAlert = LevelIntroAlert;

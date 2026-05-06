/**
 * brain-intro.js – BioRunner v2 | Universidad del Sinú
 * Alerta educativa de introducción al Nivel 1.
 * Reemplaza la animación del cerebro con un panel informativo
 * sobre el músculo liso y los riesgos del nivel.
 */

class Level1Alert {
  /**
   * @param {Function} onComplete - Callback cuando el jugador acepta
   */
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.container  = null;
    this._keyHandler   = null;
    this._clickHandler = null;
  }

  show() {
    this.container = document.createElement('div');
    this.container.id = 'level1-alert-overlay';
    this.container.innerHTML = `
      <div class="l1a-box">

        <!-- Cabecera -->
        <div class="l1a-header">
          <span class="l1a-icon-main">🧬</span>
          <div>
            <div class="l1a-title">NIVEL 1 – Estructura del Músculo Liso</div>
            <div class="l1a-subtitle">Tracto Gastrointestinal · Universidad del Sinú</div>
          </div>
        </div>

        <div class="l1a-divider"></div>

        <!-- Sección educativa -->
        <div class="l1a-section">
          <div class="l1a-section-tag good-tag">📚 Introducción al Nivel</div>
          <p class="l1a-text">
            El <strong>músculo liso</strong> es un tejido muscular <strong>involuntario</strong> que actúa de forma inconsciente, 
            gobernado por el <strong>Sistema Nervioso Autónomo (SNA)</strong>. Responde a estímulos nerviosos, 
            hormonales, mecánicos y químicos.
          </p>
          <div class="l1a-info-grid">
            <div class="l1a-info-card">
              <span class="l1a-info-icon">🔬</span>
              <div>
                <strong>Tipo Unitario</strong>
                <span>Células conectadas por gap junctions — se contrae en bloque (ej. intestino)</span>
              </div>
            </div>
            <div class="l1a-info-card">
              <span class="l1a-info-icon">🎯</span>
              <div>
                <strong>Tipo Multiunitario</strong>
                <span>Inervación individual por fibra — control fino y preciso (ej. iris del ojo)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de advertencia -->
        <div class="l1a-section">
          <div class="l1a-section-tag warn-tag">⚠️ Alertas del Recorrido</div>
          <p class="l1a-text">
            Durante este nivel encontrarás <strong>agentes patógenos</strong> que alteran la función del músculo liso. 
            ¡Evítalos o perderás una vida!
          </p>
          <div class="l1a-threats">
            <div class="l1a-threat-item">
              <span>💥</span>
              <div>
                <strong>Vasoespasmo Coronario</strong>
                <span>Contracción súbita y severa del músculo liso arterial</span>
              </div>
            </div>
            <div class="l1a-threat-item">
              <span>⚡</span>
              <div>
                <strong>Histamina (Broncoespasmo)</strong>
                <span>Provoca contracción sostenida del músculo liso bronquial</span>
              </div>
            </div>
          </div>
        </div>

        <div class="l1a-divider"></div>

        <!-- Footer -->
        <div class="l1a-footer">
          <span class="l1a-hint">Recolecta las células 🧬🔬 para aprender • Esquiva los patógenos 💥⚡</span>
          <button class="l1a-start-btn" id="btn-level1-start">
            ¡Entendido — Empezar Nivel! →
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this._bindControls();

    // Animación de entrada
    requestAnimationFrame(() => {
      this.container.classList.add('l1a-visible');
    });
  }

  _bindControls() {
    const startBtn = this.container.querySelector('#btn-level1-start');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._finish();
      });
    }

    this._keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this._finish();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  _finish() {
    document.removeEventListener('keydown', this._keyHandler);
    if (this.container) {
      this.container.classList.add('l1a-fadeout');
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 400);
    }
  }

  destroy() {
    document.removeEventListener('keydown', this._keyHandler);
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// ── Compatibilidad: Alias en caso de que algún lugar aún referencie BrainIntro ──
// (No se usa, pero evita errores si quedara alguna referencia)
const BrainIntro = Level1Alert;

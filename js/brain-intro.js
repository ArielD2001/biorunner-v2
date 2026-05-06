/**
 * brain-intro.js – BioRunner v2 | Universidad del Sinú
 * Maneja la visibilidad del modal informativo del Nivel 1 con el estilo estándar del juego.
 */

class Level1Alert {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.container = document.getElementById('level1-alert-overlay');
  }

  show() {
    if (!this.container) {
      console.error("No se encontró el modal #level1-alert-overlay en el HTML.");
      if (this.onComplete) this.onComplete();
      return;
    }

    // Mostrar usando el sistema estándar de clases .hidden
    this.container.classList.remove('hidden');

    this._bindControls();
  }

  _bindControls() {
    const btn = document.getElementById('btn-level1-start');
    if (btn) {
      btn.onclick = () => this.hide();
    }

    // Atajos de teclado
    this._keyHandler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.hide();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  hide() {
    if (this.container) {
      // Animación de salida (opcional, integrada en el sistema de modales)
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
}

window.BrainIntro = Level1Alert;

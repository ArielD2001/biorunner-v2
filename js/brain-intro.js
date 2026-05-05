/**
 * brain-intro.js – BioRunner v2 | Universidad del Sinú
 * Intro dramática para el Nivel 1.
 * Presenta al Cerebro como narrador dominante con estilo moderno.
 */

class BrainIntro {
  /**
   * @param {Function} onComplete - Callback cuando termina la intro
   */
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.dialogues = [
      {
        title: 'Soy el Cerebro',
        line: 'Controlando cada decisión, cada reflejo y cada impulso.',
        duration: 4000
      },
      {
        title: 'Te daré la misión',
        line: 'El músculo liso es mi territorio. Tú solo eres el ejecutor.',
        duration: 4000  
      },
      {
        title: 'El reto es real',
        line: 'Recolecta las células correctas y evita los males que atacan.',
        duration: 4000  
      },
      {
        title: 'Aprecia mi dominio',
        line: 'Yo orquesta la contracción y la relajación. Tú debes aprenderlo.',
        duration: 4000
      },
      {
        title: '¿Estás listo?',
        line: 'La partida empieza en 3... 2... 1... ¡Activa tu poder!',
        duration: 4000
      }
    ];
    this.currentIndex = 0;
    this.container = null;
    this.isTyping = false;
    this.typeTimeout = null;
    this.nextTimeout = null;
  }

  start() {
    this.container = document.createElement('div');
    this.container.id = 'brain-intro-overlay';
    this._render();
    document.body.appendChild(this.container);
    this._bindControls();
    this._showCurrentDialogue();
  }

  _render() {
    this.container.innerHTML = `
      <div class="brain-intro-content">
        <div class="brain-intro-emoji">🧠</div>
        <div class="brain-intro-title">EL DOMINANTE</div>
        <div class="brain-intro-line" id="brain-title"></div>
        <div class="brain-intro-line" id="brain-text"></div>
        <div class="brain-intro-footer">
          <button class="brain-intro-skip-btn" id="brain-skip-btn">⏭ SALTAR</button>
          <span class="brain-intro-chip">ESPACIO / CLICK para avanzar</span>
          <span class="brain-intro-chip">NIVEL 1: Músculo Liso</span>
        </div>
      </div>
    `;
  }

  _showCurrentDialogue() {
    if (this.currentIndex >= this.dialogues.length) {
      this._finish();
      return;
    }

    const dialogue = this.dialogues[this.currentIndex];
    const titleEl = document.getElementById('brain-title');
    const textEl = document.getElementById('brain-text');
    titleEl.textContent = '';
    textEl.textContent = '';

    this._typeWriter(titleEl, dialogue.title, 40, () => {
      this._typeWriter(textEl, dialogue.line, 24);
    });

    this.nextTimeout = setTimeout(() => {
      this.currentIndex += 1;
      this._showCurrentDialogue();
    }, dialogue.duration);
  }

  _typeWriter(element, text, speed, onComplete) {
    let index = 0;
    this.isTyping = true;
    const step = () => {
      if (index <= text.length) {
        element.textContent = text.slice(0, index);
        index += 1;
        this.typeTimeout = setTimeout(step, speed);
      } else {
        this.isTyping = false;
        if (typeof onComplete === 'function') onComplete();
      }
    };
    step();
  }

  _bindControls() {
    const advance = () => {
      if (!this.container) return;
      if (this.isTyping) {
        clearTimeout(this.typeTimeout);
        this.isTyping = false;
        const dialogue = this.dialogues[this.currentIndex];
        document.getElementById('brain-title').textContent = dialogue.title;
        document.getElementById('brain-text').textContent = dialogue.line;
        return;
      }
      clearTimeout(this.nextTimeout);
      this.currentIndex += 1;
      this._showCurrentDialogue();
    };

    this._keydownHandler = (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && this.container) {
        e.preventDefault();
        advance();
      }
    };

    this._clickHandler = (e) => {
      if (this.container && e.target.closest('#brain-intro-overlay')) {
        advance();
      }
    };

    document.addEventListener('keydown', this._keydownHandler);
    document.addEventListener('click', this._clickHandler);
    
    // Skip button handler
    const skipBtn = this.container.querySelector('#brain-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._finish();
      });
    }
  }

  _finish() {
    clearTimeout(this.typeTimeout);
    clearTimeout(this.nextTimeout);
    document.removeEventListener('keydown', this._keydownHandler);
    document.removeEventListener('click', this._clickHandler);
    if (this.container) {
      this.container.style.animation = 'fadeOutUp 0.45s ease-out forwards';
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 450);
    }
  }

  destroy() {
    clearTimeout(this.typeTimeout);
    clearTimeout(this.nextTimeout);
    document.removeEventListener('keydown', this._keydownHandler);
    document.removeEventListener('click', this._clickHandler);
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

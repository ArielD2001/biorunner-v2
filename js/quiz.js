/**
 * quiz.js – BioRunner v2 | Universidad del Sinú
 * Quiz adaptado al nivel completado (5 preguntas del nivel correspondiente).
 */

class Quiz {
  /**
   * @param {number}   levelIndex   0, 1 o 2
   * @param {Function} onComplete   Callback(correct, total)
   */
  constructor(levelIndex, onComplete) {
    this.questions  = QUIZ_BY_LEVEL[levelIndex] || QUIZ_BY_LEVEL[0];
    this.current    = 0;
    this.correct    = 0;
    this.onComplete = onComplete;

    this.elProgress = document.getElementById('quiz-progress');
    this.elPts      = document.getElementById('quiz-pts');
    this.elQuestion = document.getElementById('quiz-question');
    this.elOptions  = document.getElementById('quiz-options');
    this.elFeedback = document.getElementById('quiz-feedback');
    this.elNextBtn  = document.getElementById('btn-next-question');
    if (this.elNextBtn) {
      this.elNextBtn.onclick = () => {
        this.elNextBtn.classList.add('hidden');
        this._next();
      };
    }
  }

  start() {
    this.current = 0;
    this.correct = 0;
    this._show();
  }

  _show() {
    const q     = this.questions[this.current];
    const total = this.questions.length;

    this.elProgress.textContent = `Pregunta ${this.current + 1} / ${total}`;
    this.elPts.textContent      = `Pts: ${this.correct * 500}`;
    this.elQuestion.textContent = q.question;

    this.elOptions.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className   = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.id          = `qopt-${idx}`;
      btn.addEventListener('click', () => this._answer(idx, btn));
      this.elOptions.appendChild(btn);
    });

    this.elFeedback.className   = 'quiz-feedback hidden';
    this.elFeedback.textContent = '';
    
    if (this.elNextBtn) {
      this.elNextBtn.classList.add('hidden');
    }
  }

  _answer(idx, btn) {
    const q = this.questions[this.current];
    this.elOptions.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);

    const ok = idx === q.correct;
    if (ok) {
      this.correct++;
      btn.classList.add('correct');
      this.elFeedback.className   = 'quiz-feedback correct-fb';
      this.elFeedback.textContent = '✅ ' + q.explanation;
    } else {
      btn.classList.add('wrong');
      const cb = document.getElementById(`qopt-${q.correct}`);
      if (cb) cb.classList.add('correct');
      this.elFeedback.className   = 'quiz-feedback wrong-fb';
      this.elFeedback.textContent = '❌ ' + q.explanation;
    }

    if (this.elNextBtn) {
      this.elNextBtn.classList.remove('hidden');
    } else {
      setTimeout(() => this._next(), 2400);
    }
  }

  _next() {
    this.current++;
    if (this.current < this.questions.length) {
      this._show();
    } else {
      if (typeof this.onComplete === 'function') {
        this.onComplete(this.correct, this.questions.length);
      }
    }
  }
}

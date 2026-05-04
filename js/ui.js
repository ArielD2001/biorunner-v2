/**
 * ui.js – BioRunner v2 | Universidad del Sinú
 * Gestión de pantallas y modal educativo.
 */

class UI {
  constructor(game) {
    this.game = game;

    // HUD
    this.elScore     = document.getElementById('hud-score');
    this.elLives     = document.getElementById('hud-lives');
    this.elName      = document.getElementById('hud-name');
    this.elLevelName = document.getElementById('hud-level-name');

    // Modal
    this.modal      = document.getElementById('edu-modal');
    this.modalIcon  = document.getElementById('modal-icon');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBadge = document.getElementById('modal-badge');
    this.modalDesc  = document.getElementById('modal-description');
    this.modalFact  = document.getElementById('modal-fact');
    this.btnClose   = document.getElementById('btn-close-modal');

    // Pantallas
    this.screens = {
      start:    document.getElementById('screen-start'),
      select:   document.getElementById('screen-select'),
      game:     document.getElementById('screen-game'),
      pause:    document.getElementById('screen-pause'),
      gameover: document.getElementById('screen-gameover'),
      quiz:     document.getElementById('screen-quiz'),
      win:      document.getElementById('screen-win'),
    };

    this._bindModal();
  }

  // ── Pantallas ──────────────────────────────────────────────────────────────
  showScreen(name) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    if (this.screens[name]) this.screens[name].classList.add('active');
  }

  // ── HUD ───────────────────────────────────────────────────────────────────
  updateScore(s) {
    this.elScore.textContent = String(s).padStart(6, '0');
  }
  updateLives(lives, max) {
    this.elLives.innerHTML = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, max - lives));
  }
  setPlayerName(n) {
    this.elName.textContent = (n || 'PLAYER').toUpperCase();
  }
  setLevelName(name, region) {
    if (this.elLevelName) {
      if (region) {
        this.elLevelName.innerHTML = `${name}<br><span style="font-size:0.7em; opacity:0.8">${region}</span>`;
      } else {
        this.elLevelName.textContent = name;
      }
    }
  }

  // ── Modal educativo ───────────────────────────────────────────────────────
  showModal(cellData, onClose) {
    const isGood = cellData.type === 'good';

    this.modalIcon.textContent  = cellData.icon;
    this.modalTitle.textContent = cellData.name;
    this.modalDesc.textContent  = cellData.description;
    this.modalFact.textContent  = cellData.fact;

    this.modalBadge.textContent = isGood ? '✅ Célula Beneficiosa' : '⚠️ Agente Patógeno';
    this.modalBadge.className   = `modal-type-badge ${isGood ? 'good' : 'bad'}`;

    // Color de acento por célula
    document.querySelector('.modal-box').style.setProperty('--accent-color', cellData.color);

    this.modal.classList.remove('hidden');
    this._onClose = onClose || null;
  }

  _bindModal() {
    this.btnClose.addEventListener('click', () => this._closeModal());
    document.addEventListener('keydown', e => {
      if (!this.modal.classList.contains('hidden') &&
          (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); this._closeModal();
      }
    });
  }

  _closeModal() {
    this.modal.classList.add('hidden');
    if (typeof this._onClose === 'function') { this._onClose(); this._onClose = null; }
  }

  closeModal() { this._closeModal(); }

  // ── Game Over ─────────────────────────────────────────────────────────────
  showGameOver(score, levelIndex, quizResults) {
    document.getElementById('go-score').textContent = String(score).padStart(6, '0');
    
    // Mostrar nivel alcanzado
    document.getElementById('go-level-reached').querySelector('strong').textContent = levelIndex + 1;

    // Poblar lista de quices
    const list = document.getElementById('go-quiz-results');
    list.innerHTML = '';
    
    let totalCorrect = 0;
    let totalQuestions = 0;

    if (quizResults && quizResults.length > 0) {
      quizResults.forEach(res => {
        const item = document.createElement('div');
        item.className = 'quiz-result-row';
        item.innerHTML = `<span>Quiz Nivel ${res.level + 1}:</span> <strong>${res.correct}/${res.total}</strong>`;
        list.appendChild(item);
        totalCorrect += res.correct;
        totalQuestions += res.total;
      });
    } else {
      list.innerHTML = '<p style="font-size:10px; opacity:0.5; margin: 10px 0;">No se completaron evaluaciones.</p>';
    }

    // Calcular Calificación (A-F)
    const gradeEl = document.getElementById('go-final-grade');
    if (totalQuestions > 0) {
      const ratio = totalCorrect / totalQuestions;
      if (ratio >= 0.9) { gradeEl.textContent = 'EXCELENTE (A)'; gradeEl.style.color = '#4caf50'; }
      else if (ratio >= 0.7) { gradeEl.textContent = 'BUENO (B)'; gradeEl.style.color = '#8bc34a'; }
      else if (ratio >= 0.5) { gradeEl.textContent = 'REGULAR (C)'; gradeEl.style.color = '#ffeb3b'; }
      else { gradeEl.textContent = 'NECESITA REPASO (D)'; gradeEl.style.color = '#f44336'; }
    } else {
      gradeEl.textContent = 'SIN DATOS';
      gradeEl.style.color = 'rgba(255,255,255,0.3)';
    }

    this.showScreen('gameover');
  }

  // ── Win ───────────────────────────────────────────────────────────────────
  showWin(playerName, gameScore, quizCorrect, quizTotal) {
    document.getElementById('win-name').textContent       = playerName;
    document.getElementById('win-game-score').textContent = gameScore;
    document.getElementById('win-quiz-score').textContent = `${quizCorrect} / ${quizTotal}`;
    const bonus = quizCorrect * 500;
    document.getElementById('win-total').textContent      = gameScore + bonus;
    document.getElementById('win-emoji').textContent      =
      quizCorrect >= quizTotal * 0.8 ? '🏆' : quizCorrect >= 0.5 ? '🎉' : '😅';
    this.showScreen('win');
  }

  // ── CINEMÁTICA FINAL (OUTRO) ──────────────────────────────────────────────
  playEpicOutro(onComplete) {
    // Esconder pantalla de quiz para revelar la animación base
    this.screens.quiz.classList.remove('active');
    
    const fx = document.getElementById('fx-canvas');
    if (!fx) { onComplete(); return; }
    
    fx.classList.add('active');
    fx.width = window.innerWidth;
    fx.height = window.innerHeight;
    const ctx = fx.getContext('2d');
    
    let frame = 0;
    const duration = 220; // ~3.5 s con 60fps
    
    // Partículas doradas, rosas y blancas que explotan desde el centro (ADN / Neuronal burst)
    const particles = Array.from({length: 200}, () => ({
      x: fx.width / 2, 
      y: fx.height / 2,
      vx: (Math.random() - 0.5) * 35,
      vy: (Math.random() - 0.5) * 35,
      color: `hsl(${Math.random() * 50 + 320}, 100%, 65%)`, 
      size: Math.random() * 6 + 3
    }));

    if (typeof Audio !== 'undefined') Audio.playPowerUp();

    const loop = () => {
      frame++;
      
      // Fondo negro que se desvanece de a poco
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.04 + frame/1500, 0.35)})`;
      ctx.fillRect(0, 0, fx.width, fx.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Fricción radial
        p.vy *= 0.96;
        p.vy += 0.05; // Gravedad leve
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Conexiones de red entre partículas
        ctx.strokeStyle = p.color + '33';
        ctx.beginPath();
        ctx.moveTo(fx.width/2, fx.height/2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });

      if (frame < duration) {
        requestAnimationFrame(loop);
      } else {
        fx.classList.remove('active');
        onComplete();
      }
    };
    
    requestAnimationFrame(loop);
  }
}

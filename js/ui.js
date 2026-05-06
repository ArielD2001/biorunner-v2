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
      levelClear: document.getElementById('level-clear-overlay'),
    };

    this._bindModal();
  }

  // ── Pantallas ──────────────────────────────────────────────────────────────
  showScreen(name) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    if (this.screens[name]) this.screens[name].classList.add('active');
  }

  playLevelClearAnimation(levelName, callback) {
    const elName = document.getElementById('lc-level-name');
    if (elName) elName.textContent = levelName;

    this.showScreen('levelClear');
    
    // Duración de la animación en CSS es ~2.2s
    setTimeout(() => {
      if (callback) callback();
    }, 2500);
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

    this.modalBadge.textContent = isGood ? '✅  Beneficiosa' : '⚠️ Agente Patógeno';
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

  // ── Notificación de Power-Up ──────────────────────────────────────────────
  showPowerUpNotification(cellData) {
    const msg = document.createElement('div');
    msg.className = `powerup-notification ${cellData.powerUp}`;
    
    const powerUpText = cellData.powerUp === 'speed-boost' 
      ? '⚡ VELOCIDAD +50%' 
      : cellData.powerUp === 'shield'
      ? '🛡️ ESCUDO ACTIVADO'
      : '✨ PODER ACTIVADO';
    
    msg.textContent = powerUpText;
    document.body.appendChild(msg);
    
    setTimeout(() => msg.remove(), 2500);
  }

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
  showWin(playerName, gameScore, quizResults) {
    console.log("Mostrando pantalla de victoria:", { playerName, gameScore, quizResults });
    
    const elName = document.getElementById('win-name');
    const elScore = document.getElementById('win-game-score');
    const elTotal = document.getElementById('win-total');
    
    if (elName) elName.textContent = playerName;
    if (elScore) elScore.textContent = String(gameScore).padStart(6, '0');
    
    const list = document.getElementById('win-all-quizzes');
    let totalCorrect = 0;
    let totalQuestions = 0;

    if (list) {
      list.innerHTML = '';
      if (quizResults && quizResults.length > 0) {
        quizResults.forEach(res => {
          const row = document.createElement('div');
          row.className = 'stat-row';
          row.style.fontSize = '12px';
          row.style.margin = '5px 0';
          row.innerHTML = `<span>Quiz Nivel ${res.level + 1}:</span> <strong>${res.correct}/${res.total}</strong>`;
          list.appendChild(row);
          totalCorrect += res.correct;
          totalQuestions += res.total;
        });
      } else {
        list.innerHTML = '<p style="font-size:11px; opacity:0.6;">Evaluaciones completadas.</p>';
      }
    }

    const bonus = totalCorrect * 500;
    if (elTotal) elTotal.textContent = String(gameScore + bonus).padStart(6, '0');
    
    // Calcular Nota Académica (1.0 a 5.0)
    const elGrade = document.getElementById('win-final-grade');
    const elStatus = document.getElementById('win-grade-status');
    const elEmoji = document.getElementById('win-emoji');
    
    if (elGrade && elStatus) {
      const ratio = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
      const finalNote = (ratio * 4) + 1; // Escala 1.0 a 5.0
      elGrade.textContent = finalNote.toFixed(1);
      
      if (finalNote >= 4.8) {
        elStatus.textContent = "¡EXCELENCIA ACADÉMICA!";
        elStatus.style.color = "#4caf50";
        if (elEmoji) elEmoji.textContent = "👑";
      } else if (finalNote >= 4.0) {
        elStatus.textContent = "¡MUY BUEN DESEMPEÑO!";
        elStatus.style.color = "#8bc34a";
        if (elEmoji) elEmoji.textContent = "🌟";
      } else if (finalNote >= 3.0) {
        elStatus.textContent = "DESEMPEÑO SATISFACTORIO";
        elStatus.style.color = "#ffeb3b";
        if (elEmoji) elEmoji.textContent = "🥉";
      } else if (finalNote >= 2.0) {
        elStatus.textContent = "NECESITA REFORZAR TEMAS";
        elStatus.style.color = "#ff9800";
        if (elEmoji) elEmoji.textContent = "⚠️";
      } else {
        elStatus.textContent = "DESEMPEÑO INSUFICIENTE";
        elStatus.style.color = "#f44336";
        if (elEmoji) elEmoji.textContent = "❌";
      }
    }

    this.showScreen('win');
  }

}

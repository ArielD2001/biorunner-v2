/**
 * game.js – BioRunner v2 | Universidad del Sinú
 * Máquina de estados principal + loop RAF.
 * Novedades v2:
 *   - 3 niveles con progresión secuencial
 *   - Set shownModals: cada célula solo muestra su modal UNA VEZ en toda la sesión
 *   - Caída al vacío → pierde vida / game over
 *   - Void death con respawn temporal (si le quedan vidas)
 */

const STATE = Object.freeze({
  START:    'START',
  SELECT:   'SELECT',
  PLAYING:  'PLAYING',
  PAUSED:   'PAUSED',
  QUIZ:     'QUIZ',
  GAMEOVER: 'GAMEOVER',
  WIN:      'WIN',
  TRANSITION: 'TRANSITION',
});

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this._resize();
    window.addEventListener('resize', () => this._resize());

    this.state = STATE.START;
    this.keys  = {};

    // Datos del jugador
    this.playerName = 'PLAYER';
    this.charIndex  = 0;

    // Marcador global
    this.score      = 0;
    this.scoreAtLevelStart = 0; // Para reiniciar si se reintenta el nivel

    // Nivel actual (0-2)
    this.levelIndex = 0;

    // Frame global
    this.frame = 0;

    // Set de IDs de células cuyo modal ya se mostró (persiste entre niveles)
    this.shownModals = new Set();

    // Historial de quices para reporte final
    this.quizResults = [];

    // Entidades
    this.level     = null;
    this.player    = null;
    this.enemies   = [];
    this.goodCells = [];

    // UI y quiz
    this.ui   = new UI(this);
    this.quiz = null;

    // Temporizador de efecto de nivel completado
    this._transitionTimer = 0;
    this.camShake = 0;

    this.ui.showScreen('start');
    this._loop();
  }

  _resize() {
    const hudH = 54;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight - hudH;
    if (this.level) {
      this.level.W = this.canvas.width;
      this.level.H = this.canvas.height;
    }
  }

  // ── Loop ──────────────────────────────────────────────────────────────────
  _loop() {
    requestAnimationFrame(() => this._loop());
    if (this.state === STATE.PLAYING) {
      this._update();
      this._draw();
    } else if (this.state === STATE.PAUSED || this.state === STATE.TRANSITION) {
      this._draw();
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  _update() {
    this.frame++;

    this.player.handleInput(this.keys);
    this.player.update(this.level);
    this.level.updateCamera(this.player.x + this.player.w / 2);

    if (this.camShake > 0) this.camShake--;
    Particles.update();

    // ── Caída al vacío ────────────────────────────────────────────────────
    if (this.level.isPlayerInVoid(this.player.y)) {
      this._handleVoidDeath();
      return;
    }

    // ── Enemigos ──────────────────────────────────────────────────────────
    this.enemies.forEach(enemy => {
      enemy.update(this.player, this.shownModals, {
        onProximity: (cellData) => {
          this._pause();
          this.ui.showModal(cellData, () => this._resume());
        },
        onCollision: () => {
          this.player.takeDamage();
          Audio.playDamage();
          this.camShake = 15;
          Particles.spawn(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#c62828', 15, 'explosion');
          
          if (this.player.lives <= 0) {
            this._triggerGameOver();
          }
        }
      });
    });

    // ── Células buenas ────────────────────────────────────────────────────
    this.goodCells.forEach(cell => {
      cell.update(this.player, this.shownModals, {
        onCollect: (cellData, showModal) => {
          this.score += cellData.points;
          this.ui.updateScore(this.score);
          Audio.playCollect();
          Particles.spawn(cell.x + cell.w/2, cell.y + cell.h/2, '#f9a825', 10, 'spark');
          
          if (showModal) {
            this._pause();
            this.ui.showModal(cellData, () => this._resume());
          }
        }
      });
    });

    // ── Meta ──────────────────────────────────────────────────────────────
    const px = this.player.x + this.player.w / 2;
    if (px >= this.level.goalX + 16 && !this.level.goalReached) {
      this.level.goalReached = true;
      this._triggerQuiz();
    }

    // HUD
    this.ui.updateLives(this.player.lives, this.player.maxLives);
    this.ui.updateScore(this.score);
  }

  // ── Void death ────────────────────────────────────────────────────────────
  _handleVoidDeath() {
    this.player.lives = Math.max(0, this.player.lives - 1);
    Audio.playDamage();
    this.camShake = 15;
    
    if (this.player.lives <= 0) {
      this._triggerGameOver();
      return;
    }
    // Respawn al inicio del nivel (no al inicio del juego)
    this.player.x    = 80;
    this.player.y    = this.level.groundY - 80;
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.invincible = true;
    this.player.invTimer   = 120;
    this.ui.updateLives(this.player.lives, this.player.maxLives);
  }

  // ── Draw ──────────────────────────────────────────────────────────────────
  _draw() {
    if (!this.level) return;
    const ctx  = this.ctx;
    const camX = this.level.camX;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.save();
    if (this.camShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.camShake;
      const shakeY = (Math.random() - 0.5) * this.camShake;
      ctx.translate(shakeX, shakeY);
    }
    
    this.level.draw(ctx, this.frame);

    this.goodCells.forEach(c => c.draw(ctx, camX));
    this.enemies.forEach(e => e.draw(ctx, camX));
    this.player.draw(ctx, camX);
    Particles.draw(ctx, camX);
    
    Sprites.drawForeground(ctx, this.canvas.width, this.canvas.height, camX);
    
    ctx.restore();

    if (this.state === STATE.PAUSED || this.state === STATE.TRANSITION) {
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.state === STATE.TRANSITION) {
      Sprites.drawLevelCompleteEffect(ctx, this.canvas.width, this.canvas.height, this.frame);
    }
  }

  // ── Pausas ────────────────────────────────────────────────────────────────
  _pause()  { if (this.state === STATE.PLAYING) this.state = STATE.PAUSED; }
  _resume() { if (this.state === STATE.PAUSED)  this.state = STATE.PLAYING; }

  togglePause() {
    if (this.state === STATE.PLAYING) {
      this.state = STATE.PAUSED;
      this.ui.screens.game.classList.remove('active');
      this.ui.screens.pause.classList.add('active');
    }
  }

  resumeFromPauseScreen() {
    this.state = STATE.PLAYING;
    this.ui.screens.pause.classList.remove('active');
    this.ui.screens.game.classList.add('active');
  }

  // ── Inicio / reinicio ──────────────────────────────────────────────────────
  startGame(playerName, charIndex) {
    this.playerName  = playerName || 'Héroe';
    this.charIndex   = charIndex;
    this.score       = 0;
    this.levelIndex  = 0;
    this.shownModals = new Set();
    this.quizResults = [];

    this._loadLevel(0);
    this.ui.setPlayerName(this.playerName);
    this.state = STATE.PLAYING;
    this.ui.showScreen('game');
  }

  _loadLevel(idx) {
    this.levelIndex = idx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    this.level     = new Level(W, H, idx);
    this.player    = this.player
      ? (() => { 
          this.player.reset(80, this.level.groundY - 80); 
          this.player.charIndex = this.charIndex; 
          this.player.lives = 5; // Reset de 5 vidas por cada nivel
          return this.player; 
        })()
      : new Player(80, this.level.groundY - 80, this.charIndex);
    
    // Asegurar que si es un jugador nuevo también tenga 5 vidas
    if (this.player) this.player.lives = 5;

    this.enemies   = createEnemies(H, idx);
    this.goodCells = createGoodCells(H, idx);

    this.ui.setLevelName(LEVELS_DATA[idx].name, LEVELS_DATA[idx].region);
    this.ui.updateScore(this.score);
    this.ui.updateLives(this.player.lives, this.player.maxLives);
  }

  restart() {
    this.state = STATE.START;
    this.ui.closeModal();
    this.ui.showScreen('start');
  }

  retryCurrentLevel() {
    this.score = this.scoreAtLevelStart; // Restaurar puntaje al inicio del nivel
    this.ui.closeModal();
    this._loadLevel(this.levelIndex);
    this.state = STATE.PLAYING;
    this.ui.showScreen('game');
  }

  // ── Game Over ─────────────────────────────────────────────────────────────
  _triggerGameOver() {
    this.state = STATE.GAMEOVER;
    setTimeout(() => this.ui.showGameOver(this.score, this.levelIndex, this.quizResults), 400);
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  _triggerQuiz() {
    this._pause();
    this.ui.showScreen('quiz');

    this.quiz = new Quiz(this.levelIndex, (correct, total) => {
      // Guardar resultado
      this.quizResults.push({ level: this.levelIndex, correct, total });

      const isLastLevel = this.levelIndex >= LEVELS_DATA.length - 1;
      if (isLastLevel) {
        // Juego completo → pantalla de victoria
        this.ui.showWin(this.playerName, this.score, correct, total);
        this.state = STATE.WIN;
      } else {
        // Siguiente nivel
        this.score += correct * 500;
        this._nextLevel();
      }
    });
    this.quiz.start();
    this.state = STATE.QUIZ;
  }

  _nextLevel() {
    // Pantalla de transición breve
    this.ui.showScreen('game');
    this.state = STATE.TRANSITION;
    this._transitionTimer = 0;

    const intervalId = setInterval(() => {
      this._transitionTimer++;
      if (this._transitionTimer > 90) {
        clearInterval(intervalId);
        this.scoreAtLevelStart = this.score; // Guardar puntaje alcanzado
        this._loadLevel(this.levelIndex + 1);
        this.state = STATE.PLAYING;
      }
    }, 16);
  }

  // ── Teclado ───────────────────────────────────────────────────────────────
  onKeyDown(e) {
    this.keys[e.key] = true;
    if (e.key === 'Escape' && this.state === STATE.PLAYING) this.togglePause();
  }
  onKeyUp(e) { this.keys[e.key] = false; }
}

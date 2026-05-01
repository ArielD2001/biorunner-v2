/**
 * main.js – BioRunner v2 | Universidad del Sinú
 * Bootstrap: inicializa el juego, precarga el logo y conecta la UI.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Precargar logo de la universidad ─────────────────────────────────────
  const logoImg = new Image();
  logoImg.src = 'assets/images/logo.png';
  logoImg.onload = () => {
    LogoImage.img    = logoImg;
    LogoImage.loaded = true;
  };

  // ── Inicializar juego ─────────────────────────────────────────────────────
  const canvas = document.getElementById('game-canvas');
  const game   = new Game(canvas);

  // ── Dibujar previews de personaje en la pantalla SELECT ──────────────────
  [0, 1].forEach(i => {
    const cnv = document.createElement('canvas');
    const cont = document.getElementById(`char-preview-${i}`);
    if (cont) { cont.appendChild(cnv); Sprites.drawCharPreview(cnv, i); }
  });

  // ── Selección de personaje ────────────────────────────────────────────────
  let selectedChar = 0;
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedChar = parseInt(card.dataset.char, 10);
    });
  });

  // ── START → SELECT ────────────────────────────────────────────────────────
  document.getElementById('btn-start').addEventListener('click', () => {
    Audio.init();
    game.state = 'SELECT';
    game.ui.showScreen('select');
  });

  document.addEventListener('keydown', e => {
    if (game.state === STATE.START && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      document.getElementById('btn-start').click();
    }
  });

  // ── SELECT → GAME ─────────────────────────────────────────────────────────
  document.getElementById('btn-continue').addEventListener('click', () => {
    const name = document.getElementById('player-name').value.trim() || 'Héroe';
    game.startGame(name, selectedChar);
  });

  // Permitir Enter en el input de nombre para continuar
  document.getElementById('player-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-continue').click();
  });

  // ── INFORMACIÓN DEL PROYECTO ──────────────────────────────────────────────
  const infoModal = document.getElementById('project-info-modal');
  document.getElementById('btn-info-project').addEventListener('click', () => {
    infoModal.classList.remove('hidden');
  });
  document.getElementById('btn-close-project-info').addEventListener('click', () => {
    infoModal.classList.add('hidden');
  });

  // ── SONIDO GLOBAL DE INTERFAZ ─────────────────────────────────────────────
  document.body.addEventListener('click', (e) => {
    // Si hace click en cualquier botón, o target o tarjeta de personaje
    if (e.target.closest('button') || e.target.closest('.btn-pixel') || e.target.closest('.char-card') || e.target.closest('.touch-btn')) {
      if (typeof Audio !== 'undefined') {
        Audio.init();
        Audio.playUI();
      }
    }
  });

  // ── PAUSE ─────────────────────────────────────────────────────────────────
  document.getElementById('btn-resume').addEventListener('click', () => game.resumeFromPauseScreen());
  document.getElementById('btn-quit').addEventListener('click',   () => game.restart());

  // ── GAME OVER → RETENTAR NIVEL ─────────────────────────────────────────────────────
  document.getElementById('btn-restart').addEventListener('click', () => game.retryCurrentLevel());

  // ── WIN → START ───────────────────────────────────────────────────────────
  document.getElementById('btn-play-again').addEventListener('click', () => game.restart());

  // ── Teclado global ────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => game.onKeyDown(e));
  document.addEventListener('keyup',   e => game.onKeyUp(e));

  // Evitar scroll con flechas/espacio
  window.addEventListener('keydown', e => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      e.preventDefault();
  }, { passive: false });

  // ── Controles Móviles ─────────────────────────────────────────────────────
  const setupTouch = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const press = (e) => { e.preventDefault(); game.onKeyDown({key}); };
    const release = (e) => { e.preventDefault(); game.onKeyUp({key}); };
    btn.addEventListener('touchstart', press, {passive: false});
    btn.addEventListener('touchend', release);
    // Mouse events por si lo prueban en PC reduciendo la ventana
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  };

  setupTouch('btn-left', 'ArrowLeft');
  setupTouch('btn-right', 'ArrowRight');
  setupTouch('btn-jump', 'ArrowUp');
  setupTouch('btn-crouch', 'ArrowDown');
  
  const btnPauseMobile = document.getElementById('btn-pause-mobile');
  if (btnPauseMobile) {
    btnPauseMobile.addEventListener('click', (e) => {
      e.preventDefault();
      game.onKeyDown({key: 'Escape'});
      game.onKeyUp({key: 'Escape'});
    });
  }

});

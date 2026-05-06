/**
 * main.js – BioRunner v2 | Universidad del Sinú
 * Bootstrap: inicializa el juego, precarga el logo y conecta la UI.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Precargar logo de la universidad ─────────────────────────────────────
  const logoImg = new Image();
  logoImg.src = 'assets/images/logo.png';
  logoImg.onload = () => {
    LogoImage.img = logoImg;
    LogoImage.loaded = true;
  };

  // ── Inicializar juego ─────────────────────────────────────────────────────
  const canvas = document.getElementById('game-canvas');
  const game = new Game(canvas);

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

  // ── INFORMACIÓN DEL PROYECTO Y TEORÍA ─────────────────────────────────────
  const infoModal = document.getElementById('project-info-modal');
  const theoryModal = document.getElementById('theory-modal');
  const tutorialModal = document.getElementById('tutorial-modal');

  document.getElementById('btn-info-project').addEventListener('click', () => infoModal.classList.remove('hidden'));
  document.getElementById('btn-close-project-info').addEventListener('click', () => infoModal.classList.add('hidden'));

  document.getElementById('btn-theory').addEventListener('click', () => theoryModal.classList.remove('hidden'));
  document.getElementById('btn-close-theory').addEventListener('click', () => theoryModal.classList.add('hidden'));

  document.getElementById('btn-tutorial').addEventListener('click', () => tutorialModal.classList.remove('hidden'));
  document.getElementById('btn-close-tutorial').addEventListener('click', () => tutorialModal.classList.add('hidden'));

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
  document.getElementById('btn-quit').addEventListener('click', () => game.restart());

  // ── GAME OVER → RETENTAR NIVEL ─────────────────────────────────────────────────────
  document.getElementById('btn-restart').addEventListener('click', () => game.retryCurrentLevel());

  // ── WIN → START ───────────────────────────────────────────────────────────
  document.getElementById('btn-play-again').addEventListener('click', () => game.restart());

  // ── Teclado global ────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => game.onKeyDown(e));
  document.addEventListener('keyup', e => game.onKeyUp(e));

  // Evitar scroll con flechas/espacio
  window.addEventListener('keydown', e => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
      e.preventDefault();
  }, { passive: false });

  // ── Controles Móviles ─────────────────────────────────────────────────────
  const setupTouch = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const press = (e) => { e.preventDefault(); game.onKeyDown({ key }); };
    const release = (e) => { e.preventDefault(); game.onKeyUp({ key }); };
    btn.addEventListener('touchstart', press, { passive: false });
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
      game.onKeyDown({ key: 'Escape' });
      game.onKeyUp({ key: 'Escape' });
    });
  }

  // ── DIBUJAR PREVIEWS DE PERSONAJES ─────────────────────────────────────────
  setTimeout(() => {
    document.querySelectorAll('.char-card').forEach(card => {
      const charIdx = parseInt(card.getAttribute('data-char'));
      const previewDiv = card.querySelector('.char-preview');
      previewDiv.innerHTML = '<canvas width="48" height="48" style="border-radius:8px;"></canvas>';
      const cvs = previewDiv.querySelector('canvas');
      const ctx = cvs.getContext('2d');

      // Fondo propio del personaje
      let bg = '#111';
      if (charIdx === 0) bg = '#f5c5a3';
      else if (charIdx === 1) bg = '#e8a87c';
      else if (charIdx === 2) bg = '#3b1c2b'; // Fondo oscuro para que resalte el cerebro
      else if (charIdx === 3) bg = '#4a2c1b'; // Fondo para el estomago
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 48, 48);

      ctx.save();
      // Escalar un poquito y centrar para que el sprite quepa perfecto
      ctx.scale(0.9, 0.9);
      Sprites.drawPlayer(ctx, 8, 4, charIdx, false, false, 0);
      ctx.restore();

      // Marcar como cargado
      previewDiv.classList.add('loaded');
    });
  }, 250); // Pequeño retraso para asegurar que las imágenes base estén listas (si las hay)

  // ── ILUSTRACIONES ANIMADAS DE MÚSCULO LISO (Pantalla de inicio) ─────────────
  _drawMuscleIllustrations();

});

/**
 * Dibuja 4 órganos animados con músculo liso en los canvas del inicio.
 * Órganos: Intestino, Arteria, Vejiga, Bronquio
 */
function _drawMuscleIllustrations() {
  const W = 80, H = 80;

  // ────────────────────────────────────────────────────────
  // 1. INTESTINO – Peristaltismo ondulante
  // ────────────────────────────────────────────────────────
  (function () {
    const cvs = document.getElementById('mc-celula');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let t = 0;

    function draw() {
      t += 0.035;
      ctx.clearRect(0, 0, W, H);

      // Fondo oscuro rosado
      ctx.fillStyle = '#cf96b8ff';
      ctx.fillRect(0, 0, W, H);

      // ─── Tubo intestinal (vista lateral) ───
      // El intestino es un tubo con ondulaciones de peristaltismo
      const tubeY = H / 2;
      const tubeR = 18; // radio del tubo

      // Sombra exterior (serosa)
      ctx.strokeStyle = 'rgba(180,100,120,0.25)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(8, tubeY);
      ctx.lineTo(W - 8, tubeY);
      ctx.stroke();

      // Pared exterior (muscular) con degradado
      const wallGrad = ctx.createLinearGradient(0, tubeY - tubeR, 0, tubeY + tubeR);
      wallGrad.addColorStop(0, 'rgba(200, 100, 130, 0.9)');
      wallGrad.addColorStop(0.35, 'rgba(230, 130, 150, 0.95)');
      wallGrad.addColorStop(0.65, 'rgba(200, 100, 130, 0.95)');
      wallGrad.addColorStop(1, 'rgba(140,  60,  90, 0.9)');

      // Onda de contracción viajante (peristaltismo)
      ctx.fillStyle = wallGrad;
      ctx.beginPath();
      // Borde superior con onda viajante
      ctx.moveTo(6, tubeY - tubeR);
      for (let x = 6; x <= W - 6; x += 2) {
        const wave = Math.sin((x / (W - 12)) * Math.PI * 2.5 - t * 2.5) * 5;
        ctx.lineTo(x, tubeY - tubeR + wave);
      }
      ctx.lineTo(W - 6, tubeY + tubeR);
      // Borde inferior con onda inversa
      for (let x = W - 6; x >= 6; x -= 2) {
        const wave = Math.sin((x / (W - 12)) * Math.PI * 2.5 - t * 2.5) * 5;
        ctx.lineTo(x, tubeY + tubeR - wave);
      }
      ctx.closePath();
      ctx.fill();

      // Luz interior (lumen)
      const lumenGrad = ctx.createLinearGradient(0, tubeY - 8, 0, tubeY + 8);
      lumenGrad.addColorStop(0, 'rgba(255,220,200,0.18)');
      lumenGrad.addColorStop(1, 'rgba(180, 80,100,0.08)');
      ctx.fillStyle = lumenGrad;
      ctx.beginPath();
      for (let x = 6; x <= W - 6; x += 2) {
        const waveT = Math.sin((x / (W - 12)) * Math.PI * 2.5 - t * 2.5) * 3;
        if (x === 6) ctx.moveTo(x, tubeY - 8 + waveT);
        else ctx.lineTo(x, tubeY - 8 + waveT);
      }
      for (let x = W - 6; x >= 6; x -= 2) {
        const waveT = Math.sin((x / (W - 12)) * Math.PI * 2.5 - t * 2.5) * 3;
        ctx.lineTo(x, tubeY + 8 - waveT);
      }
      ctx.closePath();
      ctx.fill();

      // Vellosidades (proyecciones internas)
      ctx.strokeStyle = 'rgba(255,190,200,0.45)';
      ctx.lineWidth = 1;
      for (let v = 0; v < 5; v++) {
        const vx = 14 + v * 13;
        const vTop = tubeY - 6 + Math.sin(t * 2 + v) * 2;
        ctx.beginPath();
        ctx.moveTo(vx, tubeY);
        ctx.quadraticCurveTo(vx + 2, tubeY - 4, vx, vTop);
        ctx.stroke();
      }

      // Capas musculares (líneas externas)
      ctx.strokeStyle = 'rgba(255,160,180,0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(6, tubeY - tubeR - 3);
      ctx.lineTo(W - 6, tubeY - tubeR - 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, tubeY + tubeR + 3);
      ctx.lineTo(W - 6, tubeY + tubeR + 3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flecha peristaltismo
      const arrowX = 10 + ((t * 18) % 55);
      ctx.fillStyle = 'rgba(255,220,230,0.6)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('▶', arrowX, tubeY + 1);

      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ────────────────────────────────────────────────────────
  // 2. ARTERIA – Sección transversal con latido
  // ────────────────────────────────────────────────────────
  (function () {
    const cvs = document.getElementById('mc-contraccion');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let t = 0;

    function draw() {
      t += 0.04;
      ctx.clearRect(0, 0, W, H);

      // Fondo muy oscuro rojo
      ctx.fillStyle = '#cf96b8ff';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;

      // Pulso cardíaco — radio oscila
      const beat = Math.abs(Math.sin(t * 1.8)) * 5;
      const outerR = 30 - beat * 0.4;
      const innerR = 16 + beat * 0.6;
      const midR = (outerR + innerR) / 2;

      // ─── Capa adventicia (exterior) ───
      const advGrad = ctx.createRadialGradient(cx, cy, outerR - 4, cx, cy, outerR + 2);
      advGrad.addColorStop(0, 'rgba(120,50,60,0.5)');
      advGrad.addColorStop(1, 'rgba(80,20,30,0.0)');
      ctx.fillStyle = advGrad;
      ctx.beginPath(); ctx.arc(cx, cy, outerR + 3, 0, Math.PI * 2); ctx.fill();

      // ─── Pared arterial (músculo liso) ───
      const wallGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      wallGrad.addColorStop(0, 'rgba(180, 60, 80, 0.9)');
      wallGrad.addColorStop(0.4, 'rgba(210, 80,100, 0.95)');
      wallGrad.addColorStop(0.8, 'rgba(160, 50, 70, 0.9)');
      wallGrad.addColorStop(1, 'rgba(110, 30, 50, 0.7)');
      ctx.fillStyle = wallGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
      ctx.fill();

      // Células de músculo liso (óvalos en el anillo)
      const numCells = 9;
      for (let i = 0; i < numCells; i++) {
        const ang = (i / numCells) * Math.PI * 2 + t * 0.08;
        const r = midR;
        const cx2 = cx + Math.cos(ang) * r;
        const cy2 = cy + Math.sin(ang) * r;
        ctx.save();
        ctx.translate(cx2, cy2);
        ctx.rotate(ang + Math.PI / 2);
        ctx.fillStyle = 'rgba(255,160,170,0.35)';
        ctx.strokeStyle = 'rgba(255,180,190,0.5)';
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.ellipse(0, 0, 4, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }

      // ─── Línea de endotelio ───
      ctx.strokeStyle = 'rgba(255,200,200,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.stroke();

      // ─── Lumen con sangre ───
      const bloodGrad = ctx.createRadialGradient(cx - 3, cy - 3, 1, cx, cy, innerR);
      bloodGrad.addColorStop(0, 'rgba(220,50,50,0.85)');
      bloodGrad.addColorStop(0.6, 'rgba(180,30,40,0.7)');
      bloodGrad.addColorStop(1, 'rgba(120,10,20,0.5)');
      ctx.fillStyle = bloodGrad;
      ctx.beginPath(); ctx.arc(cx, cy, innerR - 0.5, 0, Math.PI * 2); ctx.fill();

      // Glóbulos rojos girando en la luz
      for (let i = 0; i < 4; i++) {
        const a = t * 0.9 + i * (Math.PI / 2);
        const rx = cx + Math.cos(a) * 5;
        const ry = cy + Math.sin(a) * 4;
        ctx.fillStyle = 'rgba(255,100,100,0.6)';
        ctx.beginPath(); ctx.ellipse(rx, ry, 4.5, 3, a, 0, Math.PI * 2); ctx.fill();
      }

      // Brillo superior (reflejo)
      const shine = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx - 4, cy - 4, 18);
      shine.addColorStop(0, 'rgba(255,255,255,0.1)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2); ctx.fill();

      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ────────────────────────────────────────────────────────
  // 3. VEJIGA – Que se llena y vacía
  // ────────────────────────────────────────────────────────
  (function () {
    const cvs = document.getElementById('mc-vaso');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let t = 0;

    function draw() {
      t += 0.018;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = '#cf96b8ff';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2 + 2;

      // Ciclo: llena (grande) → vacía (pequeña) — período ~7s
      const cycle = (Math.sin(t) + 1) / 2; // 0..1
      const rx = 20 + cycle * 12;   // radio horizontal
      const ry = 18 + cycle * 10;   // radio vertical

      // ─── Orina (interior, nivel de llenado) ───
      const fillLevel = cycle; // 0=vacía, 1=llena
      const urineH = ry * 2 * fillLevel;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx - 2, ry - 2, 0, 0, Math.PI * 2);
      ctx.clip();
      const urineGrad = ctx.createLinearGradient(0, cy + ry - urineH, 0, cy + ry);
      urineGrad.addColorStop(0, 'rgba(255,220,80,0.3)');
      urineGrad.addColorStop(1, 'rgba(220,180,40,0.5)');
      ctx.fillStyle = urineGrad;
      ctx.fillRect(cx - rx, cy + ry - urineH, rx * 2, urineH);
      ctx.restore();

      // ─── Pared de la vejiga ───
      const wallGrad = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.3, cx, cy, Math.max(rx, ry));
      wallGrad.addColorStop(0, 'rgba(100,160,220,0.1)');
      wallGrad.addColorStop(0.6, 'rgba(80, 130,200,0.4)');
      wallGrad.addColorStop(0.85, 'rgba(60, 100,180,0.7)');
      wallGrad.addColorStop(1, 'rgba(40,  70,150,0.5)');
      ctx.fillStyle = wallGrad;
      ctx.strokeStyle = `rgba(120,180,255,${0.5 + cycle * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // ─── Rugosidades de la pared (pliegues mucosos) ───
      ctx.strokeStyle = 'rgba(100,160,255,0.2)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const x1 = cx + Math.cos(ang) * (rx * 0.4);
        const y1 = cy + Math.sin(ang) * (ry * 0.4);
        const x2 = cx + Math.cos(ang) * (rx * 0.82);
        const y2 = cy + Math.sin(ang) * (ry * 0.82);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      // ─── Cúpula (fondo) ───
      const dome = ctx.createRadialGradient(cx - 5, cy - 8, 1, cx, cy, rx * 0.7);
      dome.addColorStop(0, 'rgba(200,230,255,0.2)');
      dome.addColorStop(1, 'rgba(200,230,255,0)');
      ctx.fillStyle = dome;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();

      // ─── Uretra (tubo inferior) ───
      ctx.strokeStyle = 'rgba(100,160,220,0.7)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy + ry - 1);
      ctx.lineTo(cx, cy + ry + 10);
      ctx.stroke();

      // Chorro cuando está llena
      if (cycle > 0.85) {
        const dropAlpha = (cycle - 0.85) / 0.15;
        ctx.fillStyle = `rgba(200,230,255,${dropAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(cx, cy + ry + 14, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Estado: etiqueta dinámica
      ctx.fillStyle = cycle > 0.5 ? 'rgba(255,220,80,0.45)' : 'rgba(100,180,255,0.4)';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cycle > 0.5 ? 'Llena' : 'Vac\u00eda', cx, 12);

      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ────────────────────────────────────────────────────────
  // 4. BRONQUIO – Árbol bronquial con flujo de aire
  // ────────────────────────────────────────────────────────
  (function () {
    const cvs = document.getElementById('mc-gap');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let t = 0;

    // Partículas de aire
    const particles = Array.from({ length: 12 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 8,
      y: 12 + Math.random() * 10,
      branch: Math.floor(Math.random() * 2), // 0=izquierda, 1=derecha
      prog: Math.random(),
      speed: 0.008 + Math.random() * 0.006,
      size: 1 + Math.random() * 1.5
    }));

    // Puntos de ramas: árbol bronquial simplificado
    // Tráquea → bronquio principal izquierdo y derecho → bronquiolos
    const tree = {
      trachea: { x1: W / 2, y1: 8, x2: W / 2, y2: 36 },
      leftMain: { x1: W / 2, y1: 36, x2: 22, y2: 52 },
      rightMain: { x1: W / 2, y1: 36, x2: W - 22, y2: 52 },
      leftLow1: { x1: 22, y1: 52, x2: 12, y2: 66 },
      leftLow2: { x1: 22, y1: 52, x2: 28, y2: 68 },
      rightLow1: { x1: W - 22, y1: 52, x2: W - 12, y2: 66 },
      rightLow2: { x1: W - 22, y1: 52, x2: W - 28, y2: 68 },
    };

    function drawBranch(b, w, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
    }

    function draw() {
      t += 0.03;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#cf96b8ff';
      ctx.fillRect(0, 0, W, H);

      // Respiración: escala leve con el ciclo
      const breath = (Math.sin(t * 0.9) + 1) / 2; // 0..1
      ctx.save();
      const sc = 0.95 + breath * 0.07;
      ctx.translate(W / 2, H / 2);
      ctx.scale(sc, sc);
      ctx.translate(-W / 2, -H / 2);

      // ─── Dibujar árbol ───
      const baseColor = `rgba(100,200,240,0.8)`;
      const midColor = `rgba(80,170,220,0.7)`;
      const leafColor = `rgba(60,140,200,0.6)`;

      drawBranch(tree.trachea, 5.5, baseColor);
      drawBranch(tree.leftMain, 3.5, midColor);
      drawBranch(tree.rightMain, 3.5, midColor);
      drawBranch(tree.leftLow1, 2, leafColor);
      drawBranch(tree.leftLow2, 2, leafColor);
      drawBranch(tree.rightLow1, 2, leafColor);
      drawBranch(tree.rightLow2, 2, leafColor);

      // Glow en bronquios principales
      ctx.shadowColor = 'rgba(80,180,255,0.4)';
      ctx.shadowBlur = 6;
      drawBranch(tree.trachea, 2, 'rgba(180,240,255,0.3)');
      ctx.shadowBlur = 0;

      // Anillos cartilaginosos en la tráquea
      ctx.strokeStyle = 'rgba(150,220,255,0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const ry2 = 12 + i * 5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 3.5, ry2);
        ctx.lineTo(W / 2 + 3.5, ry2);
        ctx.stroke();
      }

      // Músculo liso bronquial (arcos alrededor de bronquios principales)
      ['leftMain', 'rightMain'].forEach(key => {
        const b = tree[key];
        const mx = (b.x1 + b.x2) / 2;
        const my = (b.y1 + b.y2) / 2;
        const ang = Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(ang + Math.PI / 2);
        ctx.strokeStyle = `rgba(0,200,180,${0.3 + breath * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, -Math.PI * 0.7, Math.PI * 0.7);
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore(); // fin del scale de respiración

      // ─── Partículas de aire ───
      particles.forEach(p => {
        p.prog += p.speed;
        if (p.prog > 1) {
          p.prog = 0;
          p.branch = Math.floor(Math.random() * 4);
        }

        // Seguir el árbol bronquial
        let px, py;
        const prog = p.prog;
        if (prog < 0.4) {
          // Tráquea
          const localProg = prog / 0.4;
          px = tree.trachea.x1 + (tree.trachea.x2 - tree.trachea.x1) * localProg;
          py = tree.trachea.y1 + (tree.trachea.y2 - tree.trachea.y1) * localProg;
        } else if (prog < 0.7) {
          // Bronquio principal
          const localProg = (prog - 0.4) / 0.3;
          const bMain = p.branch < 2 ? tree.leftMain : tree.rightMain;
          px = bMain.x1 + (bMain.x2 - bMain.x1) * localProg;
          py = bMain.y1 + (bMain.y2 - bMain.y1) * localProg;
        } else {
          // Bronquiolo
          const localProg = (prog - 0.7) / 0.3;
          const bLow = [tree.leftLow1, tree.leftLow2, tree.rightLow1, tree.rightLow2][p.branch % 4];
          px = bLow.x1 + (bLow.x2 - bLow.x1) * localProg;
          py = bLow.y1 + (bLow.y2 - bLow.y1) * localProg;
        }

        const alpha = Math.sin(p.prog * Math.PI) * 0.7;
        ctx.fillStyle = `rgba(200,240,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Etiqueta de estado respiración
      ctx.fillStyle = breath > 0.5 ? 'rgba(100,220,240,0.5)' : 'rgba(150,200,255,0.35)';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(breath > 0.5 ? 'Inspiraci\u00f3n' : 'Espiraci\u00f3n', W / 2, H - 4);

      requestAnimationFrame(draw);
    }
    draw();
  })();
}


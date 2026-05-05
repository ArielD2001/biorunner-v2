/**
 * sprites.js – BioRunner v2 | Universidad del Sinú
 * Arte procedural Canvas 2D para todos los elementos del juego.
 * Uniformes universitarios (suéter azul, pantalón azul oscuro, logo UdS).
 */

// Imagen del logo pre-cargada (se llena en main.js)
const LogoImage = { img: null, loaded: false };

const Sprites = {

  // ══════════════════════════════════════════════════════════════
  // FONDOS por tipo de nivel – Tema: Contracción Músculo Liso
  // ══════════════════════════════════════════════════════════════

  drawBackground(ctx, W, H, camX, bgType = 'muscle') {
    if      (bgType === 'muscle')   Sprites._bgMuscle(ctx, W, H, camX);
    else if (bgType === 'sarco')    Sprites._bgSarco(ctx, W, H, camX);
    else                            Sprites._bgVascular(ctx, W, H, camX);
  },

  drawForeground(ctx, W, H, camX) {
    // Burbujas y fragmentos desenfocados pasando rápido (parallax x1.5)
    ctx.save();
    const t = Date.now() * 0.001;
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 300 + t * 40 - camX * 1.5) % (W + 200) + W + 200) % (W + 200) - 100;
      const cy = H * 0.1 + (i % 5) * (H * 0.2) + Math.sin(t + i) * 30;
      const r = 25 + Math.random() * 10;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  /* ══════════════════════════════════════════════════════════════
     Nivel 1 – Tejido muscular liso (sección transversal orgánica)
     Paleta: tonos rosados / rojos carnosos, fibras ondulantes
  ══════════════════════════════════════════════════════════════ */
  _bgMuscle(ctx, W, H, camX) {
    // Fondo: tejido conjuntivo (rosa cálido con gradiente orgánico)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#4a1020');
    grad.addColorStop(0.3, '#6b2030');
    grad.addColorStop(0.65,'#8b3040');
    grad.addColorStop(1,   '#5a1828');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Fibras musculares de fondo (ondas horizontales, parallax lento)
    ctx.save();
    for (let fi = 0; fi < 8; fi++) {
      const fy = H * (0.08 + fi * 0.11);
      const ampY = 10 + fi * 3;
      const period = 180 + fi * 30;
      const phaseOff = (camX * (0.05 + fi * 0.01)) % period;
      ctx.strokeStyle = `rgba(${200 - fi * 10}, ${60 + fi * 5}, ${80 + fi * 4}, ${0.25 - fi * 0.02})`;
      ctx.lineWidth = 4 + fi * 0.5;
      ctx.beginPath();
      for (let px = -period; px < W + period; px += 2) {
        const py = fy + Math.sin((px + phaseOff) / period * Math.PI * 2) * ampY;
        if (px === -period) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Sarcómeros en el fondo (líneas Z verticales)
    ctx.save();
    const sarcoSpacing = 120;
    for (let sx = -sarcoSpacing + ((camX * 0.12) % sarcoSpacing); sx < W + sarcoSpacing; sx += sarcoSpacing) {
      const grd = ctx.createLinearGradient(sx, 0, sx + 4, 0);
      grd.addColorStop(0, 'rgba(255,100,120,0)');
      grd.addColorStop(0.5, 'rgba(255,100,120,0.22)');
      grd.addColorStop(1, 'rgba(255,100,120,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(sx, 0, 4, H);
    }
    ctx.restore();

    // Núcleos celulares (oblongos, centrales, paralelos a las fibras)
    ctx.save();
    for (let ni = 0; ni < 5; ni++) {
      const nx = ((ni * 280 + 60 - camX * 0.18) % (W + 200) + W + 200) % (W + 200) - 100;
      const ny = H * (0.28 + ni * 0.12);
      ctx.fillStyle = 'rgba(90, 15, 30, 0.55)';
      ctx.strokeStyle = 'rgba(220, 80, 100, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(nx, ny, 28, 10, Math.PI / 8, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Cromatina
      ctx.fillStyle = 'rgba(200, 60, 80, 0.2)';
      ctx.beginPath();
      ctx.ellipse(nx - 5, ny, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Mitocondrias (elipses pequeñas anaranjadas)
    ctx.save();
    for (let mi = 0; mi < 6; mi++) {
      const mnx = ((mi * 190 + 120 - camX * 0.14) % (W + 150) + W + 150) % (W + 150) - 75;
      const mny = H * (0.16 + (mi % 3) * 0.18);
      ctx.fillStyle = 'rgba(220, 80, 30, 0.28)';
      ctx.strokeStyle = 'rgba(255, 130, 60, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(mnx, mny, 14, 7, Math.PI / 5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // Crestas mitocondriales
      ctx.strokeStyle = 'rgba(255, 130, 60, 0.2)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(mnx - 6, mny); ctx.lineTo(mnx + 6, mny); ctx.stroke();
    }
    ctx.restore();
  },

  /* ══════════════════════════════════════════════════════════════
     Nivel 2 – Vista intracelular: cascada de calcio y miosina
     Paleta: azul oscuro / cian eléctrico (Ca²⁺ bioluminiscente)
  ══════════════════════════════════════════════════════════════ */
  _bgSarco(ctx, W, H, camX) {
    // Fondo base: citoplasma oscuro
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#030b1a');
    grad.addColorStop(0.45,'#071828');
    grad.addColorStop(1,   '#03101f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Retículo sarcoplásmico (red tubular cian)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 200, 220, 0.18)';
    ctx.lineWidth = 2;
    for (let ri = 0; ri < 7; ri++) {
      const ry = H * (0.1 + ri * 0.13);
      const rx0 = -((camX * (0.06 + ri * 0.005)) % (W * 2));
      ctx.beginPath();
      for (let px = rx0; px < W + 60; px += 3) {
        const py = ry + Math.sin(px / 55 + ri * 1.2) * 14;
        if (px === rx0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Iones Ca²⁺ flotantes (puntos cian brillantes)
    ctx.save();
    const t = Date.now() * 0.001;
    for (let ci = 0; ci < 20; ci++) {
      const cx2 = ((ci * 173 + 40 - camX * (0.03 + (ci % 4) * 0.015)) % (W + 80) + W + 80) % (W + 80) - 40;
      const cy2 = H * 0.1 + (ci % 7) * (H * 0.12) + Math.sin(t + ci * 0.7) * 15;
      const r = 3 + Math.sin(t * 2 + ci) * 1.2;
      const glow = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r * 3);
      glow.addColorStop(0, 'rgba(80,240,255,0.9)');
      glow.addColorStop(0.4, 'rgba(0,180,220,0.4)');
      glow.addColorStop(1, 'rgba(0,180,220,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx2, cy2, r * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(200,255,255,0.95)';
      ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2); ctx.fill();
      // Etiqueta "Ca²⁺" en algunos
      if (ci % 5 === 0) {
        ctx.fillStyle = 'rgba(100,240,255,0.6)';
        ctx.font = '7px monospace';
        ctx.fillText('Ca²⁺', cx2 + 5, cy2 - 4);
      }
    }
    ctx.restore();

    // Filamentos de actina y miosina (bandas A e I simuladas)
    ctx.save();
    for (let bi = 0; bi < 5; bi++) {
      const by = H * (0.2 + bi * 0.16);
      const bxOff = ((camX * 0.1) % 200);
      // Banda A (miosina, azul oscuro)
      ctx.fillStyle = 'rgba(30,60,200,0.1)';
      for (let bx = -bxOff; bx < W; bx += 200) {
        ctx.fillRect(bx + 40, by - 10, 80, 20);
      }
      // Banda I (actina, cian tenue)
      ctx.fillStyle = 'rgba(0,180,200,0.07)';
      for (let bx = -bxOff; bx < W; bx += 200) {
        ctx.fillRect(bx, by - 10, 40, 20);
        ctx.fillRect(bx + 120, by - 10, 40, 20);
      }
    }
    ctx.restore();

    // Partículas de ATP (hexágonos pequeños naranjas)
    ctx.save();
    for (let ai = 0; ai < 8; ai++) {
      const ax = ((ai * 210 + 80 - camX * 0.07) % (W + 100) + W + 100) % (W + 100) - 50;
      const ay = H * (0.22 + (ai % 4) * 0.17) + Math.sin(t * 1.5 + ai) * 8;
      ctx.strokeStyle = 'rgba(255,160,0,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let hi = 0; hi < 6; hi++) {
        const ha = (hi / 6) * Math.PI * 2;
        const hx = ax + Math.cos(ha) * 6;
        const hy = ay + Math.sin(ha) * 6;
        hi === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,130,0,0.15)';
      ctx.fill();
    }
    ctx.restore();
  },

  /* ══════════════════════════════════════════════════════════════
     Nivel 3 – Pared arterial: músculo liso vascular
     Paleta: rojo oscuro / bordó, lúmenes arteriales calientes
  ══════════════════════════════════════════════════════════════ */
  _bgVascular(ctx, W, H, camX) {
    // Base: capa media arterial rosado oscuro / bordó
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#1a0008');
    grad.addColorStop(0.35,'#2c0010');
    grad.addColorStop(0.7, '#3d0018');
    grad.addColorStop(1,   '#1a0008');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Lúmen arterial (canel central con flujo de sangre)
    const lumenY = H * 0.42;
    const lumenH = H * 0.22;
    const lumenGrad = ctx.createLinearGradient(0, lumenY, 0, lumenY + lumenH);
    lumenGrad.addColorStop(0,   'rgba(180,0,20,0.55)');
    lumenGrad.addColorStop(0.5, 'rgba(220,20,40,0.7)');
    lumenGrad.addColorStop(1,   'rgba(180,0,20,0.55)');
    ctx.fillStyle = lumenGrad;
    ctx.fillRect(0, lumenY, W, lumenH);

    // Flujo de sangre (eritrocitos que se desplazan)
    ctx.save();
    const t = Date.now() * 0.001;
    for (let ei = 0; ei < 10; ei++) {
      const ex = ((ei * 190 + t * 80 - camX * 0.4) % (W + 80) + W + 80) % (W + 80) - 40;
      const ey = lumenY + lumenH * (0.2 + (ei % 3) * 0.28);
      ctx.fillStyle = 'rgba(220,40,60,0.45)';
      ctx.beginPath();
      ctx.ellipse(ex, ey, 14, 9, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(150,0,10,0.25)';
      ctx.beginPath();
      ctx.ellipse(ex, ey, 5, 3, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Capas de la pared arterial (túnica íntima, media, adventicia)
    // Línea elástica interna
    ctx.save();
    ctx.strokeStyle = 'rgba(255,120,80,0.2)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 6]);
    ctx.beginPath(); ctx.moveTo(0, lumenY); ctx.lineTo(W, lumenY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, lumenY + lumenH); ctx.lineTo(W, lumenY + lumenH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Fibras de colágeno (adventicia) – líneas diagonales onduladas
    ctx.save();
    ctx.strokeStyle = 'rgba(200,140,80,0.12)';
    ctx.lineWidth = 1.5;
    for (let fi = 0; fi < 14; fi++) {
      const fy = H * 0.05 + fi * (H * 0.07);
      // Sólo en segmentos fuera del lúmen
      if (fy > lumenY - 10 && fy < lumenY + lumenH + 10) continue;
      const fxOff = ((camX * 0.08 + fi * 40) % 200);
      ctx.beginPath();
      for (let px = -fxOff; px < W + 20; px += 3) {
        const py = fy + Math.sin(px / 80 + fi) * 6;
        px === -fxOff ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // Células endoteliales (rectángulos planos en el borde del lúmen)
    ctx.save();
    for (let ek = 0; ek < 8; ek++) {
      const enx = ((ek * 150 - camX * 0.22) % (W + 100) + W + 100) % (W + 100) - 50;
      ctx.fillStyle = 'rgba(255,100,80,0.14)';
      ctx.strokeStyle = 'rgba(255,150,100,0.22)';
      ctx.lineWidth = 0.8;
      ctx.fillRect(enx, lumenY - 12, 60, 13);
      ctx.strokeRect(enx, lumenY - 12, 60, 13);
      ctx.fillRect(enx, lumenY + lumenH, 60, 13);
      ctx.strokeRect(enx, lumenY + lumenH, 60, 13);
    }
    ctx.restore();

    // Terminales nerviosas (ON → ROCK/ET-1)
    ctx.save();
    for (let ni = 0; ni < 3; ni++) {
      const nex = ((ni * 350 + 100 - camX * 0.1) % (W + 200) + W + 200) % (W + 200) - 100;
      ctx.strokeStyle = 'rgba(180,100,240,0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(nex, H * 0.05);
      ctx.bezierCurveTo(nex + 30, H * 0.2, nex - 20, H * 0.3, nex + 10, lumenY - 20);
      ctx.stroke();
      ctx.fillStyle = 'rgba(200,120,255,0.4)';
      ctx.beginPath(); ctx.arc(nex + 10, lumenY - 18, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },

  // ══════════════════════════════════════════════════════════════
  // PLATAFORMAS temáticas
  // ══════════════════════════════════════════════════════════════

  drawPlatform(ctx, x, y, w, h, type = 'ground', bgType = 'classroom') {
    if (bgType === 'classroom') {
      Sprites._platClassroom(ctx, x, y, w, h, type);
    } else if (bgType === 'lab') {
      Sprites._platLab(ctx, x, y, w, h, type);
    } else {
      Sprites._platMicro(ctx, x, y, w, h, type);
    }
  },

  _platClassroom(ctx, x, y, w, h, type) {
    if (type === 'ground') {
      // Suelo de baldosas de aula
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#795548';
      ctx.fillRect(x, y, w, 5);
      // Juntas de baldosa
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      for (let tx = x; tx < x + w; tx += 48) {
        ctx.beginPath(); ctx.moveTo(tx, y); ctx.lineTo(tx, y + h); ctx.stroke();
      }
      const mid = y + h / 2;
      ctx.beginPath(); ctx.moveTo(x, mid); ctx.lineTo(x + w, mid); ctx.stroke();
    } else {
      // Escritorios / mesas de laboratorio
      ctx.fillStyle = '#d7ccc8';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#bcaaa4';
      ctx.fillRect(x, y, w, 4);
      ctx.fillRect(x, y + h - 6, w, 6);
      // Patas de escritorio
      if (w > 48) {
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x + 6, y + h, 8, 20);
        ctx.fillRect(x + w - 14, y + h, 8, 20);
      }
    }
  },

  _platLab(ctx, x, y, w, h, type) {
    if (type === 'ground') {
      // Suelo de lab (gris tech)
      ctx.fillStyle = '#263238';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#37474f';
      ctx.fillRect(x, y, w, 4);
      // Grid
      ctx.strokeStyle = 'rgba(100,149,237,0.2)';
      ctx.lineWidth = 1;
      for (let tx = x; tx < x + w; tx += 32) {
        ctx.beginPath(); ctx.moveTo(tx, y); ctx.lineTo(tx, y + h); ctx.stroke();
      }
    } else {
      // Mostrador de lab (encimera blanca)
      ctx.fillStyle = '#eceff1';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#cfd8dc';
      ctx.fillRect(x, y, w, 3);
      ctx.fillRect(x, y + h - 5, w, 5);
      // Borde azul neón
      ctx.fillStyle = 'rgba(100,149,237,0.7)';
      ctx.fillRect(x, y, w, 2);
    }
  },

  _platMicro(ctx, x, y, w, h, type) {
    if (type === 'ground') {
      // Membrana celular del suelo
      const grd = ctx.createLinearGradient(x, y, x, y + h);
      grd.addColorStop(0, '#1b5e20');
      grd.addColorStop(0.4, '#2e7d32');
      grd.addColorStop(1, '#1b5e20');
      ctx.fillStyle = grd;
      ctx.fillRect(x, y, w, h);
      // Poros de membrana
      ctx.fillStyle = 'rgba(0,255,100,0.3)';
      for (let tx = x + 20; tx < x + w; tx += 40) {
        ctx.beginPath(); ctx.arc(tx, y + 5, 4, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      // Orgánulos como plataformas
      const grd2 = ctx.createLinearGradient(x, y, x + w, y + h);
      grd2.addColorStop(0, '#004d40');
      grd2.addColorStop(1, '#00695c');
      ctx.fillStyle = grd2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,230,118,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.stroke();
    }
  },

  // ══════════════════════════════════════════════════════════════
  // PERSONAJE – Uniforme Universidad del Sinú
  // Suéter azul royal (#1565c0) + pantalón azul oscuro (#0d1b3e)
  // Logo en el pecho (si está cargado)
  // ══════════════════════════════════════════════════════════════

  drawPlayer(ctx, x, y, charIndex, facingLeft, crouching, frame) {
    ctx.save();
    if (facingLeft) {
      ctx.translate(x + 20, y); ctx.scale(-1, 1); ctx.translate(-20, 0);
    } else {
      ctx.translate(x, y);
    }

    const offsetY = crouching ? 12 : 0;

    // ── PERSONAJES ESPECIALES (2 = Cerebro, 3 = Estómago) ──
    if (charIndex === 2) {
      // CEREBRÓN: Cuerpo es una masa cerebral rosa
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; 
      ctx.beginPath(); ctx.ellipse(18, 42 + offsetY, 15, 4, 0, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#b71c1c';
      ctx.beginPath(); ctx.roundRect(6, 34 + offsetY, 10, 8, 3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(22, 34 + offsetY, 10, 8, 3); ctx.fill();

      const armOff = frame === 1 ? 2 : 0;
      ctx.fillStyle = '#ff8a80';
      ctx.fillRect(-2, 14 + armOff + offsetY, 6, 12);
      ctx.fillRect(34, 14 + armOff + offsetY, 6, 12);
      
      ctx.beginPath();
      ctx.arc(10, 15 + offsetY, 10, 0, Math.PI*2);
      ctx.arc(26, 15 + offsetY, 10, 0, Math.PI*2);
      ctx.arc(18, 8 + offsetY, 12, 0, Math.PI*2);
      ctx.arc(18, 22 + offsetY, 12, 0, Math.PI*2);
      ctx.fill();

      ctx.strokeStyle = '#d50000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, 0 + offsetY); ctx.lineTo(18, 30 + offsetY);
      ctx.moveTo(8, 15 + offsetY); ctx.quadraticCurveTo(14, 8 + offsetY, 18, 15 + offsetY);
      ctx.moveTo(28, 15 + offsetY); ctx.quadraticCurveTo(22, 8 + offsetY, 18, 15 + offsetY);
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(14, 20 + offsetY, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(24, 20 + offsetY, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(15, 20 + offsetY, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(25, 20 + offsetY, 2, 0, Math.PI*2); ctx.fill();
      
      ctx.restore();
      return;
    } 
    
    if (charIndex === 3) {
      // GASTRO: Estómago anaranjado
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; 
      ctx.beginPath(); ctx.ellipse(18, 42 + offsetY, 15, 4, 0, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#bf360c';
      ctx.beginPath(); ctx.roundRect(8, 34 + offsetY, 8, 8, 3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(22, 34 + offsetY, 8, 8, 3); ctx.fill();

      const armOff = frame === 1 ? 2 : 0;
      ctx.fillStyle = '#ff7043';
      ctx.fillRect(0, 18 + armOff + offsetY, 5, 10);
      ctx.fillRect(33, 18 + armOff + offsetY, 5, 10);

      ctx.fillStyle = '#ffcc80'; 
      ctx.beginPath();
      ctx.ellipse(19, 20 + offsetY, 14, 18, 0, 0, Math.PI*2);
      ctx.fill();
      
      ctx.strokeStyle = '#ff7043';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = 'rgba(100,255,100,0.4)';
      ctx.beginPath();
      ctx.arc(19, 28 + offsetY, 10, 0, Math.PI, false);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.fillRect(13, 16 + offsetY, 3, 4);
      ctx.fillRect(23, 16 + offsetY, 3, 4);
      ctx.fillStyle = '#d84315';
      ctx.fillRect(16, 24 + offsetY, 6, 2);

      ctx.restore();
      return;
    }

    // ── PERSONAJES DEFAULT (0 = Axel, 1 = Nova) ──
    // Color de piel
    const skinColor  = charIndex === 0 ? '#f5c5a3' : '#e8a87c';
    const hairColor  = charIndex === 0 ? '#1a0f00' : '#4a0e0e';
    const suitColor  = '#1565c0';   // Azul UdS
    const pants      = '#0d1b3e';   // Azul oscuro
    const shoes      = '#1a1a2e';   // Negro azulado
    const collar     = '#ffffff';   // Cuello blanco

    // ── Sombra ──
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(18, 42 + offsetY, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Zapatos ──
    ctx.fillStyle = shoes;
    ctx.beginPath(); ctx.roundRect(6,  32 + offsetY, 12, 9, [0,0,3,3]); ctx.fill();
    ctx.beginPath(); ctx.roundRect(20, 32 + offsetY, 12, 9, [0,0,3,3]); ctx.fill();

    if (!crouching) {
      // ── Pantalón ──
      ctx.fillStyle = pants;
      ctx.fillRect(7,  24, 11, 12);
      ctx.fillRect(20, 24, 11, 12);

      // ── Suéter / cuerpo ──
      ctx.fillStyle = suitColor;
      ctx.beginPath();
      ctx.roundRect(6, 10, 26, 16, 2);
      ctx.fill();

      // ── Cuello blanco ──
      ctx.fillStyle = collar;
      ctx.fillRect(13, 10, 12, 5);

      // ── Brazos ──
      const armOff = frame === 1 ? 2 : 0;
      ctx.fillStyle = suitColor;
      ctx.fillRect(-1, 11 + armOff, 8, 14);
      ctx.fillRect(31, 11 + armOff, 8, 14);

      // Manos
      ctx.fillStyle = skinColor;
      ctx.beginPath(); ctx.arc(2,  26 + armOff, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(36, 26 + armOff, 4, 0, Math.PI * 2); ctx.fill();

      // ── Logo UdS en el pecho ──
      if (LogoImage.loaded && LogoImage.img) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(12, 13, 14, 11, 2);
        ctx.clip();
        ctx.drawImage(LogoImage.img, 12, 13, 14, 11);
        ctx.restore();
      } else {
        // Fallback: 'S' con color rojo
        ctx.fillStyle = '#c62828';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', 19, 22);
      }
    } else {
      // Agachado
      ctx.fillStyle = suitColor;
      ctx.fillRect(6, 16 + offsetY, 26, 18);
      ctx.fillStyle = pants;
      ctx.fillRect(6, 28 + offsetY, 26, 8);
    }

    // ── Cabeza ──
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.roundRect(7, offsetY, 24, 20, 5);
    ctx.fill();

    // ── Cabello ──
    ctx.fillStyle = hairColor;
    ctx.fillRect(7, offsetY, 24, 7);
    if (charIndex === 0) {
      // Cabello tipo masculino recto
      ctx.fillRect(7, offsetY + 6, 4, 5);
    } else {
      // Cabello tipo femenino (coleta)
      ctx.fillRect(7, offsetY + 6, 3, 6);
      ctx.beginPath();
      ctx.arc(5, offsetY + 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Ojos ──
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(12, offsetY + 8, 4, 4);
    ctx.fillRect(22, offsetY + 8, 4, 4);
    // Brillo del ojo
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(13, offsetY + 8, 2, 2);
    ctx.fillRect(23, offsetY + 8, 2, 2);

    // ── Boca ──
    ctx.fillStyle = charIndex === 0 ? '#c0785a' : '#d4998a';
    ctx.fillRect(14, offsetY + 15, 10, 2);

    ctx.restore();
  },

  // ══════════════════════════════════════════════════════════════
  // ENEMIGOS (células malas) – mejoradas
  // ══════════════════════════════════════════════════════════════

  drawEnemy(ctx, x, y, color, frame, type) {
    ctx.save();
    ctx.translate(x + 18, y + 18);
    const pulse = Math.sin(frame * 0.12) * 2;
    const rot   = Math.sin(frame * 0.06) * 0.15;

    if (type === 'bacteria') {
      // Bacteria con forma de cápsula + flagelos
      ctx.save();
      ctx.rotate(rot);
      ctx.fillStyle = color;
      ctx.strokeStyle = Sprites._lighten(color, 40);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 + pulse, 16 + pulse, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Pared celular
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 + pulse, 16 + pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Flagelos
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + frame * 0.07;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 16, Math.sin(angle) * 14);
        ctx.quadraticCurveTo(
          Math.cos(angle + 0.5) * 26, Math.sin(angle + 0.5) * 26,
          Math.cos(angle + 0.3) * 34, Math.sin(angle + 0.3) * 34
        );
        ctx.stroke();
      }
    } else if (type === 'cancer') {
      // Célula cancerosa – núcleo grande con picos irregulares
      ctx.fillStyle = color;
      ctx.beginPath();
      const spikes = 9;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? 17 + pulse + (i % 3) * 1.5 : 9;
        const a = (i / (spikes * 2)) * Math.PI * 2 + rot;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();

      // Mitocondrias caóticas
      ctx.fillStyle = Sprites._lighten(color, 40);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 4, 2.5, a, 0, Math.PI * 2);
        ctx.fill();
      }

      // Núcleo
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.arc(1, 1, 6, 0, Math.PI * 2); ctx.fill();
    } else {
      // Virus – icosaedro + espículas + proteínas superficiales
      ctx.fillStyle = color;
      // Cuerpo hexagonal
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = Math.cos(a) * (13 + pulse);
        const py = Math.sin(a) * (13 + pulse);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();

      // Espículas (hemaglutininas)
      ctx.fillStyle = Sprites._lighten(color, 50);
      for (let i = 0; i < 8; i++) {
        const a  = (i / 8) * Math.PI * 2 + rot;
        const r1 = 13 + pulse;
        const r2 = 21 + pulse;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.2) * r1, Math.sin(a - 0.2) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.lineTo(Math.cos(a + 0.2) * r1, Math.sin(a + 0.2) * r1);
        ctx.closePath(); ctx.fill();
      }

      // Cubierta brillante
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = Math.cos(a) * (13 + pulse);
        const py = Math.sin(a) * (13 + pulse);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    }

    // Cara amenazante
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.arc(-5, -3, 2.5, 0, Math.PI * 2); ctx.fill(); // ojo izq
    ctx.beginPath(); ctx.arc(5, -3, 2.5, 0, Math.PI * 2); ctx.fill();  // ojo der
    // Ojos brillantes
    ctx.fillStyle = '#ff1744';
    ctx.beginPath(); ctx.arc(-4, -4, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -4, 1, 0, Math.PI * 2); ctx.fill();
    // Boca malvada (V)
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(0, 9); ctx.lineTo(5, 5); ctx.stroke();

    ctx.restore();
  },

  // ══════════════════════════════════════════════════════════════
  // CÉLULAS BUENAS (coleccionables)
  // ══════════════════════════════════════════════════════════════

  drawGoodCell(ctx, x, y, color, frame, cellId) {
    ctx.save();
    const bounce = Math.sin(frame * 0.1) * 4;
    const rot    = frame * 0.02;
    ctx.translate(x + 16, y + 16 + bounce);

    // Halo
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
    glow.addColorStop(0, color + 'BB');
    glow.addColorStop(1, color + '00');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = color;

    if (cellId === 'eritrocito') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (cellId === 'plaqueta') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, Math.PI / 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = Sprites._lighten(color, 40);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 4, Math.PI / 5, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    } else if (cellId === 'plasma_b') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,50,0.3)';
      ctx.beginPath(); ctx.arc(-2, -2, 5, 0, Math.PI * 2); ctx.fill();
      // Anticuerpo simulado
      ctx.strokeStyle = Sprites._lighten(color, 50);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(18, -5); ctx.lineTo(18, 5); ctx.stroke();
      ctx.restore();
    } else if (cellId === 'leucocito' || cellId === 'macrofago') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,100,0.35)';
      ctx.beginPath(); ctx.arc(-3, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(3, 3, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (cellId === 'celula_nk') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
      // Gran gránulo
      ctx.fillStyle = 'rgba(0,100,0,0.4)';
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (cellId === 'neurona') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + frame * 0.025;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 19);
        ctx.stroke();
      }
      ctx.restore();
    } else if (cellId === 'celula_madre') {
      ctx.save(); ctx.rotate(rot);
      // Forma de estrella con 6 puntas
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
        ctx.lineWidth = 3; ctx.strokeStyle = color; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (cellId === 'condrocito') {
      ctx.save(); ctx.rotate(rot);
      ctx.beginPath(); ctx.roundRect(-11, -8, 22, 16, 8); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
    }

    // Especular
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(-4, -5, 4, 2.5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // ══════════════════════════════════════════════════════════════
  // BANDERA DE META
  // ══════════════════════════════════════════════════════════════

  drawGoalFlag(ctx, x, y, frame) {
    ctx.save();
    ctx.translate(x, y);
    // Poste
    ctx.fillStyle = '#78909c';
    ctx.shadowColor = '#455a64';
    ctx.shadowBlur = 4;
    ctx.fillRect(13, 0, 5, 130);
    ctx.shadowBlur = 0;

    // Bandera con colores UdS
    const wave = Math.sin(frame * 0.1) * 6;
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(18, 5);
    ctx.quadraticCurveTo(33 + wave, 14, 44 + wave, 20);
    ctx.lineTo(18, 35);
    ctx.closePath(); ctx.fill();

    // Logo en bandera
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UdS', 32 + wave / 2, 23);

    // Base
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(5, 126, 22, 8);
    ctx.restore();
  },

  // ══════════════════════════════════════════════════════════════
  // UTILIDADES
  // ══════════════════════════════════════════════════════════════

  drawParticles(ctx, particles) {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.font = `${p.r * 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('✦', p.x, p.y);
      } else {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, p.color + '00');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  },

  drawCharPreview(canvas, charIndex) {
    canvas.width  = 68;
    canvas.height = 84;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 68, 84);
    Sprites.drawPlayer(ctx, 14, 8, charIndex, false, false, 0);
  },

  // Aclarar color hex
  _lighten(hex, amount) {
    const c = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((c >> 16) & 0xff) + amount);
    const g = Math.min(255, ((c >> 8)  & 0xff) + amount);
    const b = Math.min(255, ( c        & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  },

  // Partícula especial de efecto de nivel completado
  drawLevelCompleteEffect(ctx, W, H, frame) {
    const t = frame / 60;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 60 + Math.sin(t * 3 + i) * 20;
      const px = W / 2 + Math.cos(a) * r;
      const py = H / 2 + Math.sin(a) * r;
      ctx.fillStyle = `hsl(${i * 30 + t * 60},90%,60%)`;
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
};

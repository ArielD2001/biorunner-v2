/**
 * level.js – BioRunner v2 | Universidad del Sinú
 * 3 niveles con diseño temático, plataformas por nivel,
 * detección de caída al vacío (void death).
 */

class Level {
  /**
   * @param {number} canvasW
   * @param {number} canvasH
   * @param {number} levelIndex  0=Nivel1, 1=Nivel2, 2=Nivel3
   */
  constructor(canvasW, canvasH, levelIndex = 0) {
    this.W = canvasW;
    this.H = canvasH;
    this.levelIndex = levelIndex;

    // Cámara
    this.camX = 0;
    this.camY = 0;

    // Ancho total del nivel en px (cada nivel es más largo)
    this.levelWidth = 3000 + levelIndex * 500;

    // Suelo base
    this.groundY = this.H - 60;

    // Tipo de fondo y plataforma según nivel (Tema: Músculo Liso)
    this.bgType = ['muscle', 'sarco', 'vascular'][levelIndex];

    // Plataformas
    this.platforms = [];

    // Bandera de meta
    this.goalX = this.levelWidth - 180;
    this.goalY = this.groundY - 130;
    this.goalReached = false;

    this._build();
  }

  // ── Construcción de plataformas según nivel ────────────────────────────────
  _build() {
    const G = this.groundY;
    const L = this.levelIndex;

    // ── Segmentos de suelo (con huecos estratégicos) ──────────────────────
    const gaps = L === 0
      ? [{ start: 1100, end: 1220 }, { start: 2000, end: 2140 }]
      : L === 1
      ? [{ start: 950, end: 1120 }, { start: 1750, end: 1920 }, { start: 2600, end: 2780 }]
      : [{ start: 800, end: 1000 }, { start: 1500, end: 1650 }, { start: 2200, end: 2350 }, { start: 2900, end: 3050 }];

    // Generar segmentos de suelo entre los huecos
    let curX = 0;
    for (const gap of gaps) {
      if (gap.start > curX) {
        this.platforms.push({ x: curX, y: G, w: gap.start - curX, h: 60, type: 'ground' });
      }
      curX = gap.end;
    }
    // Último segmento hasta el final
    this.platforms.push({ x: curX, y: G, w: this.levelWidth - curX + 100, h: 60, type: 'ground' });

    // ── Plataformas flotantes (temáticas) ─────────────────────────────────
    // Nivel 1: escritorios de aula
    const floating1 = [
      { x: 180, y: G - 110, w: 130 }, { x: 360, y: G - 160, w: 100 },
      { x: 520, y: G - 120, w: 130 }, { x: 700, y: G - 90,  w: 160 },
      { x: 880, y: G - 150, w: 130 }, { x: 1040, y: G - 110, w: 100 },

      // Luego del hueco 1 (puente de plataformas)
      { x: 1100, y: G - 80, w: 80 }, { x: 1200, y: G - 80, w: 80 },
      { x: 1300, y: G - 120, w: 130 }, { x: 1480, y: G - 170, w: 100 },
      { x: 1650, y: G - 130, w: 130 }, { x: 1820, y: G - 95,  w: 160 },

      // Cerca del hueco 2
      { x: 1980, y: G - 80,  w: 80 }, { x: 2080, y: G - 80,  w: 80 },
      { x: 2200, y: G - 140, w: 130 }, { x: 2400, y: G - 110, w: 100 },
      { x: 2580, y: G - 160, w: 130 }, { x: 2760, y: G - 120, w: 160 },
      { x: 2940, y: G - 170, w: 100 },
    ];

    // Nivel 2: mostradores de laboratorio (más altos, más separados)
    const floating2 = [
      { x: 150, y: G - 130, w: 120 }, { x: 320, y: G - 190, w: 90 },
      { x: 480, y: G - 140, w: 140 }, { x: 670, y: G - 100, w: 160 },
      { x: 850, y: G - 170, w: 120 },
      // Puente hueco 1
      { x: 950, y: G - 90, w: 70 }, { x: 1060, y: G - 90, w: 70 }, { x: 1170, y: G - 90, w: 70 },
      { x: 1280, y: G - 150, w: 120 }, { x: 1480, y: G - 200, w: 100 },
      { x: 1680, y: G - 130, w: 140 }, { x: 1880, y: G - 90,  w: 120 },
      // Puente hueco 2
      { x: 1750, y: G - 80, w: 70 }, { x: 1860, y: G - 80, w: 70 },
      { x: 2080, y: G - 160, w: 130 }, { x: 2280, y: G - 110, w: 100 },
      { x: 2460, y: G - 180, w: 130 }, { x: 2660, y: G - 120, w: 160 },
      // Puente hueco 3
      { x: 2600, y: G - 85, w: 70 }, { x: 2710, y: G - 85, w: 70 }, { x: 2820, y: G - 85, w: 70 },
      { x: 2960, y: G - 180, w: 120 }, { x: 3130, y: G - 130, w: 100 }, { x: 3300, y: G - 150, w: 80 },
    ];

    // Nivel 3: orgánulos (redondeados, mas pequeños y a alturas variadas)
    const floating3 = [
      { x: 140, y: G - 150, w: 110 }, { x: 290, y: G - 210, w: 80 },
      { x: 430, y: G - 150, w: 110 }, { x: 600, y: G - 100, w: 130 },
      { x: 760, y: G - 180, w: 110 },
      // Dificultad: huecos más cortos necesitan ms precisión
      { x: 800, y: G - 90, w: 60 }, { x: 900, y: G - 90, w: 60 }, { x: 1010, y: G - 90, w: 60 },
      { x: 1120, y: G - 160, w: 110 }, { x: 1300, y: G - 220, w: 90 },
      { x: 1480, y: G - 160, w: 110 }, { x: 1650, y: G - 110, w: 130 },
      { x: 1500, y: G - 85,  w: 60 }, { x: 1600, y: G - 85,  w: 60 },
      { x: 1820, y: G - 190, w: 110 }, { x: 2000, y: G - 140, w: 100 },
      { x: 2200, y: G - 85,  w: 60 }, { x: 2300, y: G - 85,  w: 60 }, { x: 2400, y: G - 85, w: 60 },
      { x: 2500, y: G - 170, w: 110 }, { x: 2680, y: G - 130, w: 90 },
      { x: 2900, y: G - 85,  w: 60 }, { x: 3000, y: G - 85,  w: 60 }, { x: 3100, y: G - 85, w: 60 },
      { x: 3200, y: G - 180, w: 110 }, { x: 3380, y: G - 140, w: 90 }, { x: 3490, y: G - 200, w: 80 },
    ];

    const floatingByLevel = [floating1, floating2, floating3][this.levelIndex];
    floatingByLevel.forEach(p => {
      this.platforms.push({ x: p.x, y: p.y, w: p.w, h: 20, type: 'platform' });
    });
  }

  // ── Cámara ─────────────────────────────────────────────────────────────────
  updateCamera(playerCenterX) {
    const margin = this.W * 0.35;
    const targetX = playerCenterX - margin;
    this.camX += (targetX - this.camX) * 0.1;
    this.camX = Math.max(0, Math.min(this.camX, this.levelWidth - this.W));
  }

  // ── Colisiones AABB ────────────────────────────────────────────────────────
  resolveCollisions(player) {
    let onGround = false;

    for (const plat of this.platforms) {
      const overlapX = player.x + player.w > plat.x && player.x < plat.x + plat.w;
      const overlapY = player.y + player.h > plat.y && player.y < plat.y + plat.h;
      if (!overlapX || !overlapY) continue;

      const fromTop    = (player.y + player.h) - plat.y;
      const fromBottom = (plat.y + plat.h) - player.y;
      const fromLeft   = (player.x + player.w) - plat.x;
      const fromRight  = (plat.x + plat.w) - player.x;
      const minPen     = Math.min(fromTop, fromBottom, fromLeft, fromRight);

      if (minPen === fromTop && player.velY >= 0) {
        player.y    = plat.y - player.h;
        player.velY = 0;
        onGround    = true;
      } else if (minPen === fromBottom && player.velY < 0) {
        player.y    = plat.y + plat.h;
        player.velY = 0;
      } else if (minPen === fromLeft && player.velX > 0) {
        player.x    = plat.x - player.w;
        player.velX = 0;
      } else if (minPen === fromRight && player.velX < 0) {
        player.x    = plat.x + plat.w;
        player.velX = 0;
      }
    }

    return { onGround };
  }

  // ── ¿El jugador cayó al vacío? ────────────────────────────────────────────
  isPlayerInVoid(playerY) {
    return playerY > this.H + 40;
  }

  // ── Dibujo ─────────────────────────────────────────────────────────────────
  draw(ctx, frame) {
    // Fondo según tipo de nivel
    Sprites.drawBackground(ctx, this.W, this.H, this.camX, this.bgType);

    ctx.save();
    ctx.translate(-this.camX, 0);

    // Plataformas (solo visibles)
    this.platforms.forEach(p => {
      if (p.x + p.w < this.camX - 20) return;
      if (p.x > this.camX + this.W + 20) return;
      Sprites.drawPlatform(ctx, p.x, p.y, p.w, p.h, p.type, this.bgType);
    });

    // Bandera de meta
    if (this.goalX > this.camX - 60 && this.goalX < this.camX + this.W + 60) {
      Sprites.drawGoalFlag(ctx, this.goalX, this.goalY, frame);
    }

    ctx.restore();
  }
}

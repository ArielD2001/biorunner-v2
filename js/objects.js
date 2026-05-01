/**
 * objects.js – BioRunner v2 | Universidad del Sinú
 * Células buenas coleccionables. Modal solo una vez por ID de célula (shownModals).
 */

class GoodCell {
  /**
   * @param {number} x y
   * @param {object} cellData  Objeto de LEVEL*_GOOD
   */
  constructor(x, y, cellData) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;

    this.cellData  = cellData;
    this.collected = false;
    this.frame     = 0;
  }

  /**
   * @param {Player} player
   * @param {Set<string>} shownModals
   * @param {{ onCollect(cell) }} callbacks
   */
  update(player, shownModals, callbacks) {
    if (this.collected) return;
    this.frame++;

    const colliding =
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y;

    if (colliding) {
      this.collected = true;
      player.spawnParticles(this.cellData.color);
      // Solo mostrar modal si aún no se ha visto esta célula
      const showModal = !shownModals.has(this.cellData.id);
      if (showModal) shownModals.add(this.cellData.id);
      callbacks.onCollect(this.cellData, showModal);
    }
  }

  draw(ctx, camX) {
    if (this.collected) return;
    const sx = this.x - camX;
    if (sx + this.w < -30 || sx > ctx.canvas.width + 30) return;

    Sprites.drawGoodCell(ctx, sx, this.y, this.cellData.color, this.frame, this.cellData.id);

    // Puntos encima
    ctx.save();
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur  = 4;
    ctx.fillText(`+${this.cellData.points}`, sx + 16, this.y - 6);
    ctx.restore();
  }
}

// ── Fábrica por nivel ─────────────────────────────────────────────────────────
function createGoodCells(levelH, levelIndex) {
  const G = levelH - 60;
  const cells = [LEVEL1_GOOD, LEVEL2_GOOD, LEVEL3_GOOD][levelIndex];

  // Posiciones por nivel
  const positions = [
    // Nivel 1 – 12 células
    [
      { x: 130, y: G - 50 }, { x: 300, y: G - 50 }, { x: 480, y: G - 90 },
      { x: 650, y: G - 50 }, { x: 820, y: G - 50 }, { x: 1000, y: G - 90 },
      { x: 1250, y: G - 110 }, { x: 1450, y: G - 50 }, { x: 1680, y: G - 150 },
      { x: 1900, y: G - 50 }, { x: 2250, y: G - 130 }, { x: 2550, y: G - 50 },
      { x: 2750, y: G - 50 }, { x: 2950, y: G - 170 },
    ],
    // Nivel 2 – 14 células
    [
      { x: 120, y: G - 50 }, { x: 280, y: G - 170 }, { x: 450, y: G - 50 },
      { x: 610, y: G - 50 }, { x: 800, y: G - 130 }, { x: 990, y: G - 50 },
      { x: 1180, y: G - 50 }, { x: 1380, y: G - 90 }, { x: 1600, y: G - 50 },
      { x: 1800, y: G - 110 }, { x: 2050, y: G - 50 }, { x: 2300, y: G - 50 },
      { x: 2550, y: G - 150 }, { x: 2800, y: G - 50 }, { x: 3050, y: G - 90 },
      { x: 3250, y: G - 50 },
    ],
    // Nivel 3 – 16 células
    [
      { x: 110, y: G - 50 }, { x: 260, y: G - 180 }, { x: 400, y: G - 50 },
      { x: 550, y: G - 120 }, { x: 700, y: G - 50 }, { x: 880, y: G - 50 },
      { x: 1050, y: G - 90 }, { x: 1260, y: G - 200 }, { x: 1410, y: G - 50 },
      { x: 1610, y: G - 50 }, { x: 1800, y: G - 140 }, { x: 2050, y: G - 50 },
      { x: 2280, y: G - 50 }, { x: 2480, y: G - 160 }, { x: 2700, y: G - 50 },
      { x: 2920, y: G - 50 }, { x: 3130, y: G - 100 }, { x: 3360, y: G - 50 },
      { x: 3480, y: G - 180 },
    ],
  ][levelIndex];

  return positions.map((p, i) =>
    new GoodCell(p.x, p.y, cells[i % cells.length])
  );
}

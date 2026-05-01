/**
 * enemies.js – BioRunner v2 | Universidad del Sinú
 * Enemigos por nivel. Modal solo se muestra UNA VEZ por ID de célula.
 * El set de mostrado es global (pasado desde Game) para consistencia.
 */

class Enemy {
  /**
   * @param {number} x y
   * @param {object} cellData  Objeto de BAD_CELLS / LEVEL*_BAD
   * @param {number} patrolRange
   */
  constructor(x, y, cellData, patrolRange = 110) {
    this.x = x;
    this.y = y;
    this.w = 36;
    this.h = 36;

    this.cellData    = cellData;
    this.speed       = 1.0 + Math.random() * 0.6;
    this.dir         = 1;
    this.startX      = x;
    this.patrolRange = patrolRange;

    this.frame = 0;
    this.type  = this._resolveType(cellData.enemy_type || 'virus');

    // Radio de proximidad para disparar el modal informativo
    this.proximityRadius = 75;

    this.alive = true;
  }

  _resolveType(t) {
    if (t === 'bacteria') return 'bacteria';
    if (t === 'cancer')   return 'cancer';
    return 'virus';
  }

  /**
   * @param {Player} player
   * @param {Set<string>} shownModals  IDs de células cuyo modal ya se mostró
   * @param {{ onProximity(cell), onCollision() }} callbacks
   */
  update(player, shownModals, callbacks) {
    if (!this.alive) return;

    // Patrullaje
    this.x += this.speed * this.dir;
    if (this.x > this.startX + this.patrolRange) this.dir = -1;
    if (this.x < this.startX - this.patrolRange) this.dir = 1;

    this.frame++;

    const px = player.x + player.w / 2;
    const ex = this.x   + this.w / 2;
    const py = player.y + player.h / 2;
    const ey = this.y   + this.h / 2;

    // AABB colisión
    const colliding =
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y;

    if (colliding) {
      callbacks.onCollision();
      return;
    }

    // Proximidad → modal educativo (solo si no se mostró antes)
    const dist = Math.hypot(px - ex, py - ey);
    if (dist < this.proximityRadius && !shownModals.has(this.cellData.id)) {
      shownModals.add(this.cellData.id);
      callbacks.onProximity(this.cellData);
    }
  }

  draw(ctx, camX) {
    if (!this.alive) return;
    const sx = this.x - camX;
    if (sx + this.w < -30 || sx > ctx.canvas.width + 30) return;

    Sprites.drawEnemy(ctx, sx, this.y, this.cellData.color, this.frame, this.type);

    // Nombre sobre el enemigo
    ctx.save();
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = this.cellData.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur  = 4;
    ctx.fillText(this.cellData.name.slice(0, 14), sx + this.w / 2, this.y - 8);
    ctx.restore();
  }
}

// ── Fábrica por nivel ─────────────────────────────────────────────────────────
function createEnemies(levelH, levelIndex) {
  const G = levelH - 60;
  const badCells = [LEVEL1_BAD, LEVEL2_BAD, LEVEL3_BAD][levelIndex];

  // Posiciones por nivel (más enemigos en niveles avanzados)
  const positions = [
    // Nivel 1
    [
      { x: 450,  y: G - 36, ci: 0, range: 90  },
      { x: 750,  y: G - 36, ci: 1, range: 100 },
      { x: 1030, y: G - 36, ci: 0, range: 80  },
      { x: 1380, y: G - 36, ci: 1, range: 100 },
      { x: 1720, y: G - 36, ci: 0, range: 90  },
      { x: 2200, y: G - 36, ci: 1, range: 110 },
      { x: 2600, y: G - 36, ci: 0, range: 90  },
      { x: 2880, y: G - 36, ci: 1, range: 100 },
    ],
    // Nivel 2
    [
      { x: 320,  y: G - 36, ci: 0, range: 90  },
      { x: 580,  y: G - 36, ci: 1, range: 100 },
      { x: 820,  y: G - 36, ci: 2, range: 80  },
      { x: 1200, y: G - 36, ci: 0, range: 90  },
      { x: 1480, y: G - 36, ci: 1, range: 100 },
      { x: 1880, y: G - 36, ci: 2, range: 90  },
      { x: 2200, y: G - 36, ci: 0, range: 110 },
      { x: 2480, y: G - 36, ci: 1, range: 90  },
      { x: 2820, y: G - 36, ci: 2, range: 100 },
      { x: 3100, y: G - 36, ci: 0, range: 90  },
    ],
    // Nivel 3
    [
      { x: 280,  y: G - 36, ci: 0, range: 90  },
      { x: 520,  y: G - 36, ci: 1, range: 100 },
      { x: 760,  y: G - 36, ci: 2, range: 80  },
      { x: 1080, y: G - 36, ci: 0, range: 90  },
      { x: 1360, y: G - 36, ci: 1, range: 100 },
      { x: 1620, y: G - 36, ci: 2, range: 90  },
      { x: 1980, y: G - 36, ci: 0, range: 110 },
      { x: 2300, y: G - 36, ci: 1, range: 90  },
      { x: 2600, y: G - 36, ci: 2, range: 100 },
      { x: 2950, y: G - 36, ci: 0, range: 90  },
      { x: 3200, y: G - 36, ci: 1, range: 100 },
      { x: 3450, y: G - 36, ci: 2, range: 90  },
    ]
  ][levelIndex];

  return positions.map(p =>
    new Enemy(p.x, p.y, badCells[p.ci % badCells.length], p.range)
  );
}

/**
 * player.js – BioRunner
 * Clase Player: físicas, movimiento, animación, vidas, partículas.
 */

class Player {
  /**
   * @param {number} x y       Posición inicial (mundo)
   * @param {number} charIndex  0=Dr.Axel  1=Bio Nova
   */
  constructor(x, y, charIndex = 0) {
    // --- Posición y tamaño ---
    this.x = x;
    this.y = y;
    this.w = 32;  // ancho del hitbox
    this.h = 42;  // alto del hitbox (normal)
    this.charIndex = charIndex;

    // --- Física ---
    this.velX      = 0;
    this.velY      = 0;
    this.baseSpeed = 4.5;         // velocidad horizontal base
    this.speed     = this.baseSpeed;
    this.jumpForce = -17;         // impulso de salto
    this.gravity   = 0.9;         // gravedad por frame
    this.maxFallSpeed = 16;

    // --- Estado ---
    this.onGround  = false;
    this.crouching = false;
    this.facingLeft = false;

    // --- Animación ---
    this.frame     = 0;
    this.frameTimer = 0;
    this.frameRate  = 8; // frames entre cambio de sprite de caminata

    // --- Vidas ---
    this.lives     = 3;
    this.maxLives  = 3;
    this.invincible = false;       // invulnerable tras daño
    this.invTimer   = 0;

    // --- Partículas de colección ---
    this.particles = [];

    // --- Power Ups ---
    this.speedBoostTimer = 0;
    this.shieldTimer = 0;
  }

  // ── Input del teclado (teclas presionadas) ─────────────────────────────────
  /**
   * @param {object} keys  Mapa { ArrowLeft, ArrowRight, ArrowUp, Space, ArrowDown, ... }
   */
  handleInput(keys) {
    const isLeft  = keys['ArrowLeft']  || keys['a'] || keys['A'];
    const isRight = keys['ArrowRight'] || keys['d'] || keys['D'];
    const isJump  = keys['ArrowUp']    || keys['w'] || keys['W'] || keys[' '];
    const isCrouch= keys['ArrowDown']  || keys['s'] || keys['S'];

    const currentSpeed = this.speedBoostTimer > 0 ? this.baseSpeed * 1.5 : this.baseSpeed;
    
    // Movimiento horizontal
    if (isLeft) {
      this.velX = -currentSpeed;
      this.facingLeft = true;
    } else if (isRight) {
      this.velX = currentSpeed;
      this.facingLeft = false;
    } else {
      // Fricción
      this.velX *= 0.8;
      if (Math.abs(this.velX) < 0.15) this.velX = 0;
    }

    // Salto
    if (isJump && this.onGround) {
      this.velY = this.jumpForce;
      this.onGround = false;
      if (typeof Audio !== 'undefined') Audio.playJump();
    }

    // Agacharse
    this.crouching = isCrouch && this.onGround;
    this.h = this.crouching ? 26 : 42;
  }

  // ── Actualización física ──────────────────────────────────────────────────
  /**
   * Avanza la simulación un frame.
   * @param {Level} level   Para resolver colisiones
   */
  update(level) {
    // Gravedad
    this.velY += this.gravity;
    if (this.velY > this.maxFallSpeed) this.velY = this.maxFallSpeed;

    // Mover primero en Y, resolver colisiones en Y
    this.y += this.velY;
    const { onGround } = level.resolveCollisions(this);
    this.onGround = onGround;

    // Mover en X, resolver colisiones en X
    this.x += this.velX;
    level.resolveCollisions(this);

    // Limitar al borde izquierdo del nivel
    if (this.x < 0) { this.x = 0; this.velX = 0; }
    // Cayó al vacío → morir
    if (this.y > level.H + 100) this.takeDamage();

    // Animación de caminata
    if (this.onGround && Math.abs(this.velX) > 0.5) {
      this.frameTimer++;
      if (this.frameTimer >= this.frameRate) {
        this.frame = this.frame === 0 ? 1 : 0;
        this.frameTimer = 0;
      }
    } else {
      this.frame = 0;
    }

    // Invulnerabilidad temporal
    if (this.invincible) {
      this.invTimer--;
      if (this.invTimer <= 0) this.invincible = false;
    }

    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer--;
      if (Math.random() < 0.3) {
        if (typeof Particles !== 'undefined') Particles.spawn(this.x + this.w/2, this.y + this.h, '#00e5ff', 1, 'spark');
      }
    }
    
    if (this.shieldTimer > 0) {
      this.shieldTimer--;
      this.invincible = true;
      this.invTimer = 10;
    }

    // Actualizar partículas
    this.particles = this.particles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.15, alpha: p.alpha - 0.03, r: p.r * 0.95 }))
      .filter(p => p.alpha > 0.05);
  }

  // ── Recibir daño ──────────────────────────────────────────────────────────
  takeDamage() {
    if (this.invincible) return;
    this.lives = Math.max(0, this.lives - 1);
    this.invincible = true;
    this.invTimer   = 90; // ~1.5 s de invulnerabilidad
    this.velY = this.jumpForce * 0.6; // pequeño rebote
    this.velX = this.facingLeft ? 3 : -3;
  }

  // ── Emisión de partículas al recolectar ────────────────────────────────────
  spawnParticles(color) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x: this.x + this.w / 2,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color,
        alpha: 1,
        r: 4 + Math.random() * 4
      });
    }
  }

  // ── Dibujar ───────────────────────────────────────────────────────────────
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} camX  Offset de cámara
   */
  draw(ctx, camX) {
    // Parpadeo cuando es invulnerable
    if (this.invincible && this.shieldTimer <= 0 && Math.floor(this.invTimer / 6) % 2 === 0) return;

    const sx = this.x - camX; // posición en pantalla
    
    if (this.shieldTimer > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx + this.w/2, this.y + this.h/2, this.h * 0.7, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(67, 160, 71, 0.3)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#69f581';
      ctx.stroke();
      ctx.restore();
    }

    Sprites.drawPlayer(ctx, sx, this.y, this.charIndex, this.facingLeft, this.crouching, this.frame);

    // Partículas
    const screenParticles = this.particles.map(p => ({ ...p, x: p.x - camX }));
    Sprites.drawParticles(ctx, screenParticles);
  }

  // ── Bounding box en coordenadas de mundo ──────────────────────────────────
  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  // ── Reset a posición inicial ───────────────────────────────────────────────
  reset(x, y) {
    this.x = x; this.y = y;
    this.velX = 0; this.velY = 0;
    this.lives = this.maxLives;
    this.invincible = false;
    this.particles = [];
    this.crouching = false;
    this.facingLeft = false;
    this.speed = this.baseSpeed;
    this.speedBoostTimer = 0;
    this.shieldTimer = 0;
  }

  // ── Aplicar Power-Ups ──────────────────────────────────────────────────────
  applyPowerUp(powerUpType) {
    if (!powerUpType) return;

    if (powerUpType === 'speed-boost') {
      this.speedBoostTimer = 300; // ~5 seg a 60 fps
      if (typeof Audio !== 'undefined') Audio.playPowerUp();
    } else if (powerUpType === 'shield') {
      this.shieldTimer = 300; // ~5 seg a 60 fps
      if (typeof Audio !== 'undefined') Audio.playPowerUp();
    }
  }
}

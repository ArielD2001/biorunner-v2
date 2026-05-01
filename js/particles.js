/**
 * particles.js – BioRunner V2
 * Motor de partículas para chispas, explosiones y polvo.
 */

class Particle {
  constructor(x, y, color, type) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type; // 'spark', 'dust', 'explosion'
    this.life = 1.0;
    
    const angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 2 + 1;
    
    if (type === 'explosion') speed *= 2;
    if (type === 'dust') {
      speed *= 0.5;
      this.velY = -Math.random() * 2;
      this.velX = (Math.random() - 0.5);
    } else {
      this.velX = Math.cos(angle) * speed;
      this.velY = Math.sin(angle) * speed;
    }
    
    this.size = Math.random() * 4 + 2;
    this.decay = Math.random() * 0.02 + 0.015;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
    
    if (this.type === 'spark' || this.type === 'explosion') {
      this.velY += 0.1; // Gravedad
    }
    
    this.life -= this.decay;
  }

  draw(ctx, camX) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - camX, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ParticleEngine {
  constructor() {
    this.particles = [];
  }

  spawn(x, y, color, amount, type = 'spark') {
    for (let i = 0; i < amount; i++) {
      this.particles.push(new Particle(x, y, color, type));
    }
  }

  update() {
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx, camX) {
    this.particles.forEach(p => p.draw(ctx, camX));
  }
}

const Particles = new ParticleEngine();

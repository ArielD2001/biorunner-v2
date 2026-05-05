/**
 * audio.js – BioRunner V2
 * Sintetizador Web Audio API para música de fondo y efectos especiales.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmOsc = null;
    this.bgmInterval = null;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Volumen master
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("AudioContext no soportado");
    }
  }

  _playTone(freq, type, duration, vol = 1) {
    if (!this.initialized || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playJump() {
    if (!this.initialized) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playCollect() {
    if (!this.initialized) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.setValueAtTime(1200, t + 0.05);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playDamage() {
    if (!this.initialized) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.3);
    
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playPowerUp() {
    if (!this.initialized) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.2);
    osc.frequency.linearRampToValueAtTime(1600, t + 0.5);
    
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.6);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playUI() {
    if (!this.initialized) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.1);
  }

  startAmbientSound() {
    if (!this.initialized || this.isMuted || this.bgmInterval) return;

    // Frecuencias para una melodía estilo 8-bits retro (exploración misteriosa/arcade)
    const melody = [
      440.00, 523.25, 659.25, 783.99, // Arpegio Am
      440.00, 523.25, 659.25, 783.99,
      392.00, 493.88, 587.33, 783.99, // Arpegio G
      392.00, 493.88, 587.33, 783.99,
      349.23, 440.00, 523.25, 698.46, // Arpegio F
      349.23, 440.00, 523.25, 698.46,
      329.63, 415.30, 493.88, 659.25, // Arpegio E
      329.63, 415.30, 493.88, 659.25
    ];
    
    let noteIndex = 0;
    const tempoMs = 120; // Velocidad de la melodía (8 bits ágil)

    this.bgmInterval = setInterval(() => {
      // Evitar que suene si la pestaña está inactiva y el contexto se duerme
      if(this.ctx.state === 'suspended') return;

      const freq = melody[noteIndex] * 0.5; // Bajamos una octava para que suene cálido
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square'; // Tipo cuadrado para ese sabor real a Nintendo / Arcade antiguo
      osc.frequency.setValueAtTime(freq, t);
      
      // Volumen bajo para que no moleste durante el juego
      gain.gain.setValueAtTime(0.04, t); 
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); // La nota dura casi nada ('Pluck')
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t);
      osc.stop(t + 0.15);

      noteIndex = (noteIndex + 1) % melody.length;
    }, tempoMs);
  }

  stopAmbientSound() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

const Audio = new AudioEngine();

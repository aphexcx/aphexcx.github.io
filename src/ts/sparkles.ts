/**
 * Magical sparkle trail cursor effect inspired by Nox
 * Creates glowing gold particles that follow the cursor and explode on click
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

class SparkleEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouseX: number = 0;
  private mouseY: number = 0;
  private lastTrailTime: number = 0;
  private readonly TRAIL_INTERVAL = 8; // ms between trail particles (reduced for more particles)
  private readonly TRAIL_PARTICLES_PER_EMIT = 3; // Multiple particles per emit
  private readonly GOLD_HUE = 45; // Gold color hue

  constructor() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();

    // Event listeners
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('click', (e) => this.onClick(e));

    // Start animation loop
    this.animate();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const now = Date.now();
    if (now - this.lastTrailTime > this.TRAIL_INTERVAL) {
      this.createTrailParticle(e.clientX, e.clientY);
      this.lastTrailTime = now;
    }
  }

  private onClick(e: MouseEvent): void {
    this.createExplosion(e.clientX, e.clientY);
  }

  private createTrailParticle(x: number, y: number): void {
    // Create multiple particles per emit for a denser trail
    for (let i = 0; i < this.TRAIL_PARTICLES_PER_EMIT; i++) {
      const particle: Particle = {
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 1,
        maxLife: 1,
        size: Math.random() * 3 + 1.5,
        hue: this.GOLD_HUE + (Math.random() - 0.5) * 12
      };
      this.particles.push(particle);
    }
  }

  private createExplosion(x: number, y: number): void {
    const particleCount = 40 + Math.random() * 20;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 6 + 4;

      const particle: Particle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        life: 1,
        maxLife: 1,
        size: Math.random() * 4 + 3,
        hue: this.GOLD_HUE + (Math.random() - 0.5) * 20
      };
      this.particles.push(particle);
    }
  }

  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Apply gravity for explosion particles (faster velocity = explosion)
      if (Math.abs(p.vx) > 1 || Math.abs(p.vy) > 1) {
        p.vy += 0.15; // Gravity
        p.vx *= 0.98; // Air resistance
        p.vy *= 0.98;
      }

      // Fade out
      p.life -= 0.02;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private drawParticles(): void {
    for (const p of this.particles) {
      const alpha = p.life;
      const size = p.size * p.life;

      // Outer glow
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${alpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 30%, 0)`);

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(p.x - size * 3, p.y - size * 3, size * 6, size * 6);

      // Bright center
      this.ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private animate(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw
    this.updateParticles();
    this.drawParticles();

    // Continue loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SparkleEffect());
} else {
  new SparkleEffect();
}

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
  private highlightCanvas: HTMLCanvasElement;
  private highlightCtx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouseX: number = 0;
  private mouseY: number = 0;
  private lastTrailTime: number = 0;
  private readonly TRAIL_INTERVAL = 8; // ms between trail particles (reduced for more particles)
  private readonly TRAIL_PARTICLES_PER_EMIT = 3; // Multiple particles per emit
  private readonly GOLD_HUE = 45; // Gold color hue
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly TAP_THRESHOLD = 10; // px - max distance for tap vs swipe

  constructor() {
    // Create highlight canvas (behind particles)
    this.highlightCanvas = document.createElement('canvas');
    this.highlightCanvas.style.position = 'fixed';
    this.highlightCanvas.style.top = '0';
    this.highlightCanvas.style.left = '0';
    this.highlightCanvas.style.pointerEvents = 'none';
    this.highlightCanvas.style.zIndex = '1';
    this.highlightCanvas.style.mixBlendMode = 'soft-light';
    document.body.appendChild(this.highlightCanvas);

    this.highlightCtx = this.highlightCanvas.getContext('2d')!;

    // Create sparkle canvas (on top)
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

    // Touch event listeners for mobile
    document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    document.addEventListener('touchend', (e) => this.onTouchEnd(e));

    // Start animation loop
    this.animate();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.highlightCanvas.width = window.innerWidth;
    this.highlightCanvas.height = window.innerHeight;
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

  private onTouchMove(e: TouchEvent): void {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;

      const now = Date.now();
      if (now - this.lastTrailTime > this.TRAIL_INTERVAL) {
        this.createTrailParticle(touch.clientX, touch.clientY);
        this.lastTrailTime = now;
      }
    }
  }

  private onTouchStart(e: TouchEvent): void {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }
  }

  private onTouchEnd(e: TouchEvent): void {
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];

      // Calculate distance moved since touch start
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only create explosion if it's a tap (minimal movement), not a swipe
      if (distance < this.TAP_THRESHOLD) {
        this.createExplosion(touch.clientX, touch.clientY);
      }
    }
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

  private drawSpecularHighlight(): void {
    // Clear highlight canvas
    this.highlightCtx.clearRect(0, 0, this.highlightCanvas.width, this.highlightCanvas.height);

    // Draw cursor highlight
    const baseRadius = 180;
    const innerRadius = 60;

    // Main cursor highlight - warm gold glow
    const mainGradient = this.highlightCtx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, baseRadius
    );
    mainGradient.addColorStop(0, 'rgba(255, 230, 180, 0.25)');
    mainGradient.addColorStop(0.3, 'rgba(255, 215, 150, 0.15)');
    mainGradient.addColorStop(0.6, 'rgba(212, 175, 55, 0.08)');
    mainGradient.addColorStop(0.85, 'rgba(212, 175, 55, 0.02)');
    mainGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

    this.highlightCtx.fillStyle = mainGradient;
    this.highlightCtx.beginPath();
    this.highlightCtx.arc(this.mouseX, this.mouseY, baseRadius, 0, Math.PI * 2);
    this.highlightCtx.fill();

    // Bright center cursor highlight
    const centerGradient = this.highlightCtx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, innerRadius
    );
    centerGradient.addColorStop(0, 'rgba(255, 245, 220, 0.4)');
    centerGradient.addColorStop(0.4, 'rgba(255, 235, 190, 0.2)');
    centerGradient.addColorStop(0.7, 'rgba(255, 220, 160, 0.08)');
    centerGradient.addColorStop(1, 'rgba(255, 215, 150, 0)');

    this.highlightCtx.fillStyle = centerGradient;
    this.highlightCtx.beginPath();
    this.highlightCtx.arc(this.mouseX, this.mouseY, innerRadius, 0, Math.PI * 2);
    this.highlightCtx.fill();

    // Draw individual particle highlights
    for (const p of this.particles) {
      const alpha = p.life;
      const particleRadius = p.size * 15 * alpha; // Scale highlight with particle life

      // Each particle emits its own warm light on the wood
      const particleGradient = this.highlightCtx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, particleRadius
      );

      // Use the particle's hue for color variation
      const h = p.hue;
      particleGradient.addColorStop(0, `hsla(${h}, 100%, 85%, ${alpha * 0.3})`);
      particleGradient.addColorStop(0.4, `hsla(${h}, 100%, 75%, ${alpha * 0.15})`);
      particleGradient.addColorStop(0.7, `hsla(${h}, 80%, 65%, ${alpha * 0.08})`);
      particleGradient.addColorStop(1, `hsla(${h}, 80%, 60%, 0)`);

      this.highlightCtx.fillStyle = particleGradient;
      this.highlightCtx.beginPath();
      this.highlightCtx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
      this.highlightCtx.fill();
    }
  }

  private animate(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw wood specular highlight
    this.drawSpecularHighlight();

    // Update and draw particles
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

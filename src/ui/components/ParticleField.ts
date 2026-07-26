import { MotionPreferences } from '../../core/MotionPreferences';
import { Logger } from '../../core/Logger';

interface Particle { x: number; y: number; vx: number; vy: number; radius: number; }

export class ParticleField {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private observer: IntersectionObserver | null = null;
  private readonly particleCount = 40;

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'absolute inset-0 pointer-events-none';
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      Logger.warn('ParticleField: 2d context unavailable, skipping');
    }
  }

  mount(): void {
    if (!this.ctx || MotionPreferences.reduced) return;
    this.container.prepend(this.canvas);
    this.resize();
    this.seed();
    window.addEventListener('resize', () => this.resize());

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.start(); else this.stop();
    });
    this.observer.observe(this.container);
  }

  private resize(): void {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  private seed(): void {
    this.particles = Array.from({ length: this.particleCount }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.5 + 0.5
    }));
  }

  private start(): void {
    if (this.animationFrameId !== null) return;
    const tick = (): void => {
      this.draw();
      this.animationFrameId = requestAnimationFrame(tick);
    };
    tick();
  }

  private stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private draw(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  destroy(): void {
    this.stop();
    this.observer?.disconnect();
    this.canvas.remove();
  }
}

import gsap from 'gsap';
import { MotionPreferences } from '../../core/MotionPreferences';

export class RouteDraw {
  private readonly path: SVGPathElement;

  constructor(path: SVGPathElement) {
    this.path = path;
  }

  mount(): void {
    const length = this.path.getTotalLength();
    this.path.style.strokeDasharray = `${length}`;
    this.path.style.strokeDashoffset = `${length}`;

    if (MotionPreferences.reduced) {
      this.path.style.strokeDashoffset = '0';
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(this.path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' });
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(this.path);
  }
}

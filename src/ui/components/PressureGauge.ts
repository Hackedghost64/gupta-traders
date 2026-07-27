import gsap from 'gsap';
import { MotionPreferences } from '../../core/MotionPreferences';

function parsePressureValue(text: string): number | null {
  const kgfMatch = text.match(/(\d+(?:\.\d+)?)\s*kgf\/cm²/);
  if (kgfMatch) return parseFloat(kgfMatch[1]);

  const pnMatch = text.match(/PN\s*(\d+)/i);
  if (pnMatch) return parseInt(pnMatch[1], 10);

  const rangePn = text.match(/PN\s*\d+\s*to\s*PN\s*(\d+)/i);
  if (rangePn) return parseInt(rangePn[1], 10);

  return null;
}

export class PressureGauge {
  private readonly needle: SVGElement | null;
  private readonly minAngle = -90;
  private readonly maxAngle = 90;
  private readonly maxPressure = 16;
  private readonly svgOrigin = '100 100';

  constructor(_svgRoot: SVGSVGElement) {
    this.needle = _svgRoot.querySelector('[data-gauge-needle]');
  }

  setPressure(value: number): void {
    if (!this.needle) return;
    const clamped = Math.min(value, this.maxPressure);
    const angle = this.minAngle + (clamped / this.maxPressure) * (this.maxAngle - this.minAngle);

    if (MotionPreferences.reduced) {
      this.needle.setAttribute('transform', `rotate(${angle}, 100, 100)`);
      return;
    }
    gsap.to(this.needle, { rotation: angle, duration: 0.4, ease: 'power2.out', svgOrigin: this.svgOrigin });
  }

  reset(): void {
    if (!this.needle) return;
    if (MotionPreferences.reduced) {
      this.needle.setAttribute('transform', 'rotate(0, 100, 100)');
      return;
    }
    gsap.to(this.needle, { rotation: 0, duration: 0.3, ease: 'power2.out', svgOrigin: this.svgOrigin });
  }

  static parse(text: string | null): number | null {
    if (!text) return null;
    return parsePressureValue(text);
  }
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPreferences } from '../../core/MotionPreferences';
import { Logger } from '../../core/Logger';

gsap.registerPlugin(ScrollTrigger);

interface StatCounterConfig {
  element: HTMLElement;
  duration?: number;
}

export class StatCounter {
  private readonly config: StatCounterConfig;

  constructor(config: StatCounterConfig) {
    this.config = config;
  }

  mount(): void {
    const { element, duration = 1.2 } = this.config;
    if (!element) {
      Logger.warn('StatCounter: element missing, skipping mount');
      return;
    }

    const match = element.textContent?.trim().match(/^(\d+)(.*)$/);
    if (!match) {
      Logger.warn('StatCounter: could not parse numeric value from', element.textContent);
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2];

    if (MotionPreferences.reduced) {
      return;
    }

    const counter = { value: 0 };
    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value)}${suffix}`;
          }
        });
      }
    });
  }
}

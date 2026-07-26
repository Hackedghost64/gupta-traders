export class MotionPreferences {
  private static readonly query = window.matchMedia('(prefers-reduced-motion: reduce)');

  static get reduced(): boolean {
    return this.query.matches;
  }

  static onChange(callback: (reduced: boolean) => void): void {
    this.query.addEventListener('change', (event) => callback(event.matches));
  }
}

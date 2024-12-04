import { Vector2D } from './vectors';

export class Controls {
  keys: { [key: string]: boolean } = {};
  touchStart: Vector2D | null = null;
  touchPosition: Vector2D | null = null;
  isShooting: boolean = false;

  constructor() {
    this.setupKeyboard();
    this.setupTouch();
  }

  private setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  private setupTouch() {
    window.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStart = new Vector2D(touch.clientX, touch.clientY);
      this.touchPosition = new Vector2D(touch.clientX, touch.clientY);

      // Check if touch is in the shoot button area
      if (touch.clientX > window.innerWidth - 100 && 
          touch.clientY > window.innerHeight - 100) {
        this.isShooting = true;
      }
    });

    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.touchPosition = new Vector2D(touch.clientX, touch.clientY);
    });

    window.addEventListener('touchend', () => {
      this.touchStart = null;
      this.touchPosition = null;
      this.isShooting = false;
    });
  }

  getRotation(): number {
    if (this.keys['ArrowLeft'] || this.keys['a']) return -5;
    if (this.keys['ArrowRight'] || this.keys['d']) return 5;
    if (this.touchStart && this.touchPosition) {
      const diff = this.touchPosition.subtract(this.touchStart);
      return Math.atan2(diff.y, diff.x);
    }
    return 0;
  }

  isThrusting(): boolean {
    return this.keys['ArrowUp'] || 
           this.keys['w'] || 
           (this.touchPosition !== null && this.touchStart !== null);
  }

  isTriggerPressed(): boolean {
    return this.keys[' '] || this.isShooting;
  }
}

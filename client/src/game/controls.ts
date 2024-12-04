import { Vector2D } from './vectors';

export class Controls {
  keys: { [key: string]: boolean } = {};
  touchStart: Vector2D | null = null;
  touchPosition: Vector2D | null = null;
  joystickCenter: Vector2D;
  joystickPosition: Vector2D;
  joystickActive: boolean = false;
  isShooting: boolean = false;
  JOYSTICK_RADIUS = 40;

  player: any;

  constructor() {
    this.setupKeyboard();
    this.setupTouch();
    // Set initial joystick position
    this.joystickCenter = new Vector2D(100, window.innerHeight - 100);
    this.joystickPosition = new Vector2D(100, window.innerHeight - 100);
  }

  setPlayer(player: any) {
    this.player = player;
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
      const touchPos = new Vector2D(touch.clientX, touch.clientY);

      // Check if touch is in joystick area
      const distanceFromJoystick = touchPos.subtract(this.joystickCenter).length();
      if (distanceFromJoystick < this.JOYSTICK_RADIUS) {
        this.joystickActive = true;
        this.joystickPosition = touchPos;
      }

      // Check if touch is in the shoot button area
      if (touch.clientX > window.innerWidth - 100 && 
          touch.clientY > window.innerHeight - 100) {
        this.isShooting = true;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.joystickActive) return;
      
      const touch = e.touches[0];
      const touchPos = new Vector2D(touch.clientX, touch.clientY);
      
      // Limit joystick movement to radius
      const offset = touchPos.subtract(this.joystickCenter);
      if (offset.length() > this.JOYSTICK_RADIUS) {
        this.joystickPosition = this.joystickCenter.add(
          offset.normalize().multiply(this.JOYSTICK_RADIUS)
        );
      } else {
        this.joystickPosition = touchPos;
      }
    });

    window.addEventListener('touchend', (e) => {
      // Reset joystick position when touch ends
      this.joystickPosition = this.joystickCenter;
      this.joystickActive = false;
      this.isShooting = false;
    });
  }

  getRotation(): number {
    if (this.keys['ArrowLeft'] || this.keys['a']) return -5;
    if (this.keys['ArrowRight'] || this.keys['d']) return 5;
    
    if (this.joystickActive) {
      const offset = this.joystickPosition.subtract(this.joystickCenter);
      if (offset.length() > this.JOYSTICK_RADIUS * 0.3) {
        const targetRotation = Math.atan2(offset.y, offset.x);
        return (targetRotation - this.player.rotation) * 5;
      }
    }
    return 0;
  }

  isThrusting(): boolean {
    if (this.keys['ArrowUp'] || this.keys['w']) return true;
    
    if (this.joystickActive) {
      const offset = this.joystickPosition.subtract(this.joystickCenter);
      return offset.length() > this.JOYSTICK_RADIUS * 0.3;
    }
    return false;
  }

  isTriggerPressed(): boolean {
    return this.keys[' '] || this.isShooting;
  }

  drawJoystick(ctx: CanvasRenderingContext2D) {
    // Draw joystick base
    ctx.beginPath();
    ctx.arc(this.joystickCenter.x, this.joystickCenter.y, this.JOYSTICK_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();

    // Draw joystick handle
    ctx.beginPath();
    ctx.arc(this.joystickPosition.x, this.joystickPosition.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
  }
}

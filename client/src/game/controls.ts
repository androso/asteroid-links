import { Vector2D } from './vectors';

export class Controls {
  keys: { [key: string]: boolean } = {};
  isShooting: boolean = false;
  dpadState: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  } = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  DPAD_SIZE = 50;
  DPAD_CENTER_X = 100;
  DPAD_CENTER_Y: number;
  player: any;

  constructor() {
    this.setupKeyboard();
    this.setupTouch();
    this.DPAD_CENTER_Y = window.innerHeight - 100;
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
    const checkDpadPress = (x: number, y: number) => {
      const dx = x - this.DPAD_CENTER_X;
      const dy = y - this.DPAD_CENTER_Y;
      
      // Reset all directions
      this.dpadState.up = false;
      this.dpadState.down = false;
      this.dpadState.left = false;
      this.dpadState.right = false;

      // Check vertical direction
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < -this.DPAD_SIZE/2) this.dpadState.up = true;
        if (dy > this.DPAD_SIZE/2) this.dpadState.down = true;
      }
      // Check horizontal direction
      else {
        if (dx < -this.DPAD_SIZE/2) this.dpadState.left = true;
        if (dx > this.DPAD_SIZE/2) this.dpadState.right = true;
      }
    };

    window.addEventListener('touchstart', (e) => {
      Array.from(e.touches).forEach(touch => {
        // Check if touch is in D-pad area
        if (Math.abs(touch.clientX - this.DPAD_CENTER_X) < this.DPAD_SIZE * 1.5 &&
            Math.abs(touch.clientY - this.DPAD_CENTER_Y) < this.DPAD_SIZE * 1.5) {
          checkDpadPress(touch.clientX, touch.clientY);
        }

        // Check if touch is in the shoot button area
        if (touch.clientX > window.innerWidth - 100 && 
            touch.clientY > window.innerHeight - 100) {
          this.isShooting = true;
        }
      });
    });

    window.addEventListener('touchmove', (e) => {
      Array.from(e.touches).forEach(touch => {
        // Update D-pad state if touch is in D-pad area
        if (Math.abs(touch.clientX - this.DPAD_CENTER_X) < this.DPAD_SIZE * 1.5 &&
            Math.abs(touch.clientY - this.DPAD_CENTER_Y) < this.DPAD_SIZE * 1.5) {
          checkDpadPress(touch.clientX, touch.clientY);
        }
      });
    });

    window.addEventListener('touchend', (e) => {
      const remainingTouches = Array.from(e.touches);
      
      // Check if any remaining touches are in D-pad area
      const hasDpadTouch = remainingTouches.some(touch => 
        Math.abs(touch.clientX - this.DPAD_CENTER_X) < this.DPAD_SIZE * 1.5 &&
        Math.abs(touch.clientY - this.DPAD_CENTER_Y) < this.DPAD_SIZE * 1.5
      );

      if (!hasDpadTouch) {
        // Reset all D-pad states
        this.dpadState.up = false;
        this.dpadState.down = false;
        this.dpadState.left = false;
        this.dpadState.right = false;
      }

      // Only reset shooting if no touches are in the shoot button area
      const hasShootTouch = remainingTouches.some(touch => 
        touch.clientX > window.innerWidth - 100 && 
        touch.clientY > window.innerHeight - 100
      );

      if (!hasShootTouch) {
        this.isShooting = false;
      }
    });
  }

  getRotation(): number {
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.dpadState.left) return -5;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.dpadState.right) return 5;
    return 0;
  }

  isThrusting(): boolean {
    return this.keys['ArrowUp'] || this.keys['w'] || this.dpadState.up;
  }

  isTriggerPressed(): boolean {
    return this.keys[' '] || this.isShooting;
  }

  drawJoystick(ctx: CanvasRenderingContext2D) {
    const x = this.DPAD_CENTER_X;
    const y = this.DPAD_CENTER_Y;
    const size = this.DPAD_SIZE;

    // Draw D-pad background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;

    // Draw vertical part
    ctx.fillStyle = this.dpadState.up ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x - size/3, y - size, size*2/3, size*2/3); // Up
    ctx.fillStyle = this.dpadState.down ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x - size/3, y + size/3, size*2/3, size*2/3); // Down

    // Draw horizontal part
    ctx.fillStyle = this.dpadState.left ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x - size, y - size/3, size*2/3, size*2/3); // Left
    ctx.fillStyle = this.dpadState.right ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x + size/3, y - size/3, size*2/3, size*2/3); // Right

    // Draw center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x - size/3, y - size/3, size*2/3, size*2/3);

    // Draw outlines
    ctx.strokeRect(x - size/3, y - size, size*2/3, size*2/3); // Up
    ctx.strokeRect(x - size/3, y + size/3, size*2/3, size*2/3); // Down
    ctx.strokeRect(x - size, y - size/3, size*2/3, size*2/3); // Left
    ctx.strokeRect(x + size/3, y - size/3, size*2/3, size*2/3); // Right
    ctx.strokeRect(x - size/3, y - size/3, size*2/3, size*2/3); // Center
  }
}

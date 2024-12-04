import { Vector2D } from './vectors';

export class Controls {
  private BUTTON_SIZE = 60;
  private LEFT_ARROW_POS = { x: 70, y: window.innerHeight - 70 };
  private RIGHT_ARROW_POS = { x: 190, y: window.innerHeight - 70 };
  private THRUST_POS = { x: window.innerWidth - 190, y: window.innerHeight - 70 };
  private SHOOT_POS = { x: window.innerWidth - 70, y: window.innerHeight - 70 };

  private keys: { [key: string]: boolean } = {};
  private isLeft = false;
  private isRight = false;
  private _isThrusting = false;
  private isShooting = false;

  constructor() {
    this.updateButtonPositions();
    this.setupKeyboardControls();
    this.setupTouchControls();
    
    // Update button positions when window resizes
    window.addEventListener('resize', () => this.updateButtonPositions());
    
    // Reset controls when window loses focus or visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.resetControlStates();
      }
    });
    
    window.addEventListener('blur', () => {
      this.resetControlStates();
    });
  }

  private resetControlStates() {
    this.isLeft = false;
    this.isRight = false;
    this._isThrusting = false;
    this.isShooting = false;
    this.keys = {};
  }

  private updateButtonPositions() {
    this.LEFT_ARROW_POS = { x: 50, y: window.innerHeight - 60 };
    this.RIGHT_ARROW_POS = { x: 120, y: window.innerHeight - 60 };
    this.THRUST_POS = { x: window.innerWidth - 150, y: window.innerHeight - 60 };
    this.SHOOT_POS = { x: window.innerWidth - 70, y: window.innerHeight - 60 };
  }

  private setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  private setupTouchControls() {
    const checkButtonPress = (x: number, y: number) => {
      const dist = (bx: number, by: number) => {
        const dx = x - bx;
        const dy = y - by;
        return Math.sqrt(dx * dx + dy * dy);
      };

      if (dist(this.LEFT_ARROW_POS.x, this.LEFT_ARROW_POS.y) < this.BUTTON_SIZE/2) {
        this.isLeft = true;
      }
      if (dist(this.RIGHT_ARROW_POS.x, this.RIGHT_ARROW_POS.y) < this.BUTTON_SIZE/2) {
        this.isRight = true;
      }
      if (dist(this.THRUST_POS.x, this.THRUST_POS.y) < this.BUTTON_SIZE/2) {
        this._isThrusting = true;
      }
      if (dist(this.SHOOT_POS.x, this.SHOOT_POS.y) < this.BUTTON_SIZE/2) {
        this.isShooting = true;
      }
    };

    window.addEventListener('touchstart', (e) => {
      Array.from(e.touches).forEach(touch => {
        checkButtonPress(touch.clientX, touch.clientY);
      });
    });

    window.addEventListener('touchmove', (e) => {
      this.isLeft = false;
      this.isRight = false;
      this._isThrusting = false;
      this.isShooting = false;
      
      Array.from(e.touches).forEach(touch => {
        checkButtonPress(touch.clientX, touch.clientY);
      });
    });

    window.addEventListener('touchend', (e) => {
      this.isLeft = false;
      this.isRight = false;
      this._isThrusting = false;
      this.isShooting = false;
      
      Array.from(e.touches).forEach(touch => {
        checkButtonPress(touch.clientX, touch.clientY);
      });
    });
  }

  getRotation(): number {
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.isLeft) return -5;
    if (this.keys['ArrowRight'] || this.keys['d'] || this.isRight) return 5;
    return 0;
  }

  isThrusting(): boolean {
    return this.keys['ArrowUp'] || this.keys['w'] || this._isThrusting;
  }

  isTriggerPressed(): boolean {
    return this.keys[' '] || this.isShooting;
  }

  drawJoystick(ctx: CanvasRenderingContext2D) {
    const drawButton = (x: number, y: number, icon: string, isPressed: boolean) => {
      ctx.beginPath();
      ctx.arc(x, y, this.BUTTON_SIZE/2, 0, Math.PI * 2);
      ctx.fillStyle = isPressed ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw icon
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, x, y);
    };

    // Draw movement arrows
    drawButton(this.LEFT_ARROW_POS.x, this.LEFT_ARROW_POS.y, '←', this.isLeft);
    drawButton(this.RIGHT_ARROW_POS.x, this.RIGHT_ARROW_POS.y, '→', this.isRight);

    // Draw action buttons
    drawButton(this.THRUST_POS.x, this.THRUST_POS.y, 'THRUST', this._isThrusting);
    drawButton(this.SHOOT_POS.x, this.SHOOT_POS.y, 'SHOOT', this.isShooting);
  }
}
import { Vector2D } from './vectors';

export class Controls {
  keys: { [key: string]: boolean } = {};
  isShooting: boolean = false;
  _isThrusting: boolean = false;
  isLeft: boolean = false;
  isRight: boolean = false;
  
  // Button positions and sizes
  BUTTON_SIZE = 60;
  BUTTON_MARGIN = 20;
  LEFT_ARROW_POS = { x: 80, y: 0 };
  RIGHT_ARROW_POS = { x: 160, y: 0 };
  THRUST_POS = { x: 0, y: 0 };
  SHOOT_POS = { x: 0, y: 0 };
  
  player: any;

  constructor() {
    this.setupKeyboard();
    this.setupTouch();
    this.updateButtonPositions();
    
    // Update button positions when window resizes
    window.addEventListener('resize', () => this.updateButtonPositions());
  }

  private updateButtonPositions() {
    const h = window.innerHeight;
    const w = window.innerWidth;
    
    // Left side controls (movement)
    this.LEFT_ARROW_POS = { x: this.BUTTON_MARGIN + this.BUTTON_SIZE/2, y: h - this.BUTTON_MARGIN - this.BUTTON_SIZE/2 };
    this.RIGHT_ARROW_POS = { x: this.BUTTON_MARGIN + this.BUTTON_SIZE*1.75, y: h - this.BUTTON_MARGIN - this.BUTTON_SIZE/2 };
    
    // Right side controls (actions)
    this.THRUST_POS = { x: w - this.BUTTON_MARGIN - this.BUTTON_SIZE*1.75, y: h - this.BUTTON_MARGIN - this.BUTTON_SIZE/2 };
    this.SHOOT_POS = { x: w - this.BUTTON_MARGIN - this.BUTTON_SIZE/2, y: h - this.BUTTON_MARGIN - this.BUTTON_SIZE/2 };
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
    const checkButtonPress = (x: number, y: number) => {
      const checkDistance = (buttonX: number, buttonY: number) => {
        const dx = x - buttonX;
        const dy = y - buttonY;
        return Math.sqrt(dx * dx + dy * dy) < this.BUTTON_SIZE/2;
      };

      // Check each button
      if (checkDistance(this.LEFT_ARROW_POS.x, this.LEFT_ARROW_POS.y)) {
        this.isLeft = true;
      }
      if (checkDistance(this.RIGHT_ARROW_POS.x, this.RIGHT_ARROW_POS.y)) {
        this.isRight = true;
      }
      if (checkDistance(this.THRUST_POS.x, this.THRUST_POS.y)) {
        this._isThrusting = true;
      }
      if (checkDistance(this.SHOOT_POS.x, this.SHOOT_POS.y)) {
        this.isShooting = true;
      }
    };

    window.addEventListener('touchstart', (e) => {
      Array.from(e.touches).forEach(touch => {
        checkButtonPress(touch.clientX, touch.clientY);
      });
    });

    window.addEventListener('touchmove', (e) => {
      // Reset all states
      this.isLeft = false;
      this.isRight = false;
      this._isThrusting = false;
      this.isShooting = false;
      
      // Check all current touches
      Array.from(e.touches).forEach(touch => {
        checkButtonPress(touch.clientX, touch.clientY);
      });
    });

    window.addEventListener('touchend', (e) => {
      // Reset all states
      this.isLeft = false;
      this.isRight = false;
      this._isThrusting = false;
      this.isShooting = false;
      
      // Check remaining touches
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
    drawButton(this.THRUST_POS.x, this.THRUST_POS.y, '▲', this._isThrusting);
    drawButton(this.SHOOT_POS.x, this.SHOOT_POS.y, '●', this.isShooting);
  }
}

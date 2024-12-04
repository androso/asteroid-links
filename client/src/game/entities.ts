import { Vector2D } from './vectors';

export interface Entity {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export class Player implements Entity {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  thrust: boolean;
  shooting: boolean;
  lastShot: number;

  constructor() {
    this.position = new Vector2D(window.innerWidth / 2, window.innerHeight / 2);
    this.velocity = new Vector2D(0, 0);
    this.rotation = 0;
    this.radius = 15;
    this.thrust = false;
    this.shooting = false;
    this.lastShot = 0;
  }

  update(dt: number) {
    if (this.thrust) {
      const thrustVector = new Vector2D(Math.cos(this.rotation), Math.sin(this.rotation))
        .multiply(200 * dt);
      this.velocity = this.velocity.add(thrustVector);
    }

    this.velocity = this.velocity.multiply(0.99);
    this.position = this.position.add(this.velocity.multiply(dt));

    // Wrap around screen
    if (this.position.x < 0) this.position.x = window.innerWidth;
    if (this.position.x > window.innerWidth) this.position.x = 0;
    if (this.position.y < 0) this.position.y = window.innerHeight;
    if (this.position.y > window.innerHeight) this.position.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.stroke();

    if (this.thrust) {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-15, 0);
      ctx.strokeStyle = '#ff4444';
      ctx.stroke();
    }

    ctx.restore();
  }
}

export class Bullet implements Entity {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  lifetime: number;

  constructor(position: Vector2D, rotation: number) {
    this.position = position;
    this.rotation = rotation;
    this.velocity = new Vector2D(
      Math.cos(rotation) * 500,
      Math.sin(rotation) * 500
    );
    this.radius = 4;
    this.lifetime = 1.5;
  }

  update(dt: number) {
    this.position = this.position.add(this.velocity.multiply(dt));
    this.lifetime -= dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

export class SocialTarget implements Entity {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  radius: number;
  type: string;
  url: string;

  constructor(type: string, url: string) {
    this.position = new Vector2D(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight
    );
    this.velocity = new Vector2D(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );
    this.rotation = Math.random() * Math.PI * 2;
    this.radius = 25;
    this.type = type;
    this.url = url;
  }

  update(dt: number) {
    this.position = this.position.add(this.velocity.multiply(dt));
    this.rotation += dt * 0.5;

    if (this.position.x < 0) this.position.x = window.innerWidth;
    if (this.position.x > window.innerWidth) this.position.x = 0;
    if (this.position.y < 0) this.position.y = window.innerHeight;
    if (this.position.y > window.innerHeight) this.position.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw icon based on type
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icon = this.getIcon();
    ctx.fillText(icon, 0, 0);

    ctx.restore();
  }

  private getIcon(): string {
    switch (this.type) {
      case 'twitter': return '𝕏';
      case 'blog': return '📝';
      case 'github': return '🐙';
      case 'linkedin': return 'in';
      case 'replit': return '⌨️';
      default: return '?';
    }
  }
}

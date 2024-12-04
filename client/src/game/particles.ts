import { Vector2D } from './vectors';

export class Particle {
  position: Vector2D;
  velocity: Vector2D;
  life: number;
  color: string;
  size: number;

  constructor(position: Vector2D, velocity: Vector2D, color: string) {
    this.position = position;
    this.velocity = velocity;
    this.life = 1.0;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update(dt: number) {
    this.position = this.position.add(this.velocity.multiply(dt));
    this.life -= dt * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
    ctx.fill();
  }
}

export class ParticleSystem {
  particles: Particle[] = [];

  update(dt: number) {
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => p.update(dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => p.draw(ctx));
  }

  emit(position: Vector2D, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 50;
      const velocity = new Vector2D(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      this.particles.push(new Particle(position, velocity, color));
    }
  }
}

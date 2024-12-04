import { Controls } from './controls';
import { Player, Bullet, SocialTarget } from './entities';
import { ParticleSystem } from './particles';
import { Vector2D } from './vectors';
import { SOCIAL_LINKS } from './assets';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private controls: Controls;
  private player: Player;
  private bullets: Bullet[];
  private targets: SocialTarget[];
  private particles: ParticleSystem;
  private lastTime: number;
  private currentTime: number;
  private running: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.controls = new Controls();
    this.player = new Player();
    this.controls.setPlayer(this.player);
    this.bullets = [];
    this.targets = [];
    this.particles = new ParticleSystem();
    this.lastTime = 0;
    this.currentTime = 0;
    this.running = false;

    this.setupCanvas();
    this.initializeSocialTargets();

    window.addEventListener('resize', () => this.setupCanvas());
  }

  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initializeSocialTargets() {
    SOCIAL_LINKS.forEach(link => {
      this.targets.push(new SocialTarget(link.type, link.url));
    });
  }

  start() {
    this.running = true;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  stop() {
    this.running = false;
  }

  private gameLoop(time: number) {
    if (!this.running) return;

    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.currentTime = time;

    this.update(dt);
    this.draw();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(dt: number) {
    // Update player
    const rotation = this.controls.getRotation();
    this.player.rotation += rotation * dt;
    this.player.thrust = this.controls.isThrusting();
    this.player.update(dt);

    // Handle shooting
    if (this.controls.isTriggerPressed() && 
      this.currentTime - this.player.lastShot > 250) {
      const bulletPos = new Vector2D(
        this.player.position.x + Math.cos(this.player.rotation) * 20,
        this.player.position.y + Math.sin(this.player.rotation) * 20
      );
      this.bullets.push(new Bullet(bulletPos, this.player.rotation));
      this.player.lastShot = this.currentTime;
    }

    // Update bullets
    this.bullets = this.bullets.filter(b => b.lifetime > 0);
    this.bullets.forEach(b => b.update(dt));

    // Update targets
    this.targets.forEach(t => t.update(dt));

    // Update particles
    this.particles.update(dt);

    // Check collisions
    this.checkCollisions();
  }

  private checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      for (let j = this.targets.length - 1; j >= 0; j--) {
        const target = this.targets[j];
        const dx = bullet.position.x - target.position.x;
        const dy = bullet.position.y - target.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < target.radius + bullet.radius) {
          // Hit!
          this.particles.emit(target.position, 20, 'white');
          window.open(target.url, '_blank');
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  private draw() {
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game entities
    this.player.draw(this.ctx);
    this.bullets.forEach(b => b.draw(this.ctx));
    this.targets.forEach(t => t.draw(this.ctx));
    this.particles.draw(this.ctx);

    // Draw mobile controls if needed
    if ('ontouchstart' in window) {
      this.drawMobileControls();
    }

    // Draw instructions
    this.drawInstructions();
  }

  private drawMobileControls() {
    // Draw joystick
    this.controls.drawJoystick(this.ctx);

    // Draw shoot button
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(
      this.canvas.width - 50,
      this.canvas.height - 50,
      40,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      '🎯',
      this.canvas.width - 50,
      this.canvas.height - 50
    );
  }

  private drawInstructions() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(
      'Desktop: Arrow keys/WASD to move, SPACE to shoot',
      10,
      30
    );
    this.ctx.fillText(
      'Mobile: Drag to move, tap button to shoot',
      10,
      60
    );
  }
}

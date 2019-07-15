import * as Const from "./const.js"

class Particle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.g = 0;
    this.alpha = 0;
    this.color = "rgba(0,0,0,0)";
    this.size = 0;
    this.alive = false;
    this.type = 0;
  }

  draw(ctx) {
    ctx.fillStyle = this.color + this.alpha + ")";
    const t = this.size >> 1;
    ctx.fillRect(this.x - t, this.y - t, this.size, this.size);
  }

  update(dt) {
    if ((this.alpha -= dt * .5) < 0) {
      this.alive = false;
      return;
    }

    this.x += this.vx * dt;
    this.vy += this.g * dt;
    this.y += this.vy * dt;

    switch (this.type) {
      case Const.EXPLO:
        this.size += dt;
        break;
      case Const.TRAIL:
        this.size += dt * 2;
        break;
    }
  }
}

export default class Particles {
  constructor() {
    this.particles = [];
    this.colors = ["rgba(255,255,255,",
      "rgba(251,6,6,",
      "rgba(255,255,255,",
      "rgba(233,93,15,",
      "rgba(255,255,255,",
      "rgba(233,220,229,"
    ]

    for (let p = 0; p < 150; p++) {
      this.particles.push(new Particle());
    }
  }

  reset() {
    for (let p = 0; p < 150; p++) {
      this.particles[p].alive = false;
    }
  }

  update(dt) {
    for (let p of this.particles) {
      if (p.alive) p.update(dt);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    for (let p of this.particles) {
      if (p.alive) p.draw(ctx);
    }
    ctx.closePath();
  }

  getPart() {
    for (let p of this.particles) {
      if (!p.alive) return p;
    }
    return null;
  }

  startTrail(x, y) {
    const r = this.getPart();
    if (r) {
      r.x = x;
      r.y = y;
      r.vx = Math.random();
      r.vy = Math.random();
      r.g = 10;
      r.alpha = .5;
      r.color = this.colors[0];
      r.size = Math.random() * 10 + 8;
      r.alive = true;
      r.type = Const.TRAIL;
    }
  }

  startExp(x, y) {
    for (let t = 0; t < 80; t++) {
      const r = this.getPart(),
        ang = Math.random() * Const.TWO_PI;
      if (r) {
        r.x = x;
        r.y = y;
        r.vx = Math.cos(ang) * (Math.random() * 400 + 50);
        r.vy = Math.sin(ang) * (Math.random() * 400 + 50);
        r.g = 900;
        r.alpha = 1;
        r.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        r.size = Math.random() * 4 + 3;
        r.alive = true;
        r.type = Const.EXPLO;
      }
    }
  }

}
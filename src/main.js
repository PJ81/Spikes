import * as Const from "./const.js"
import Game from "./game.js"
import Spikes from "./spikes.js"
import Resources from "./resources.js";
import Background from "./back.js";
import Player from "./player.js";
import Particles from "./particles.js";

class Dont extends Game {
  constructor() {
    super();
    this.top = false;
    this.back;
    this.spikes;
    this.player;
    this.partTimer = 0;
    this.waitTimer = 0;
    this.bestScore = this.score = 0
    this.particles = new Particles();
    this.res = new Resources(() => {
      this.load();
      this.loop(0);
    });
  }

  load() {
    this.canvas.addEventListener("click", () => {
      if (this.waitTimer) return;
      if (!this.player.alive) {
        this.resetGame();
        return;
      }
      if (this.player.waiting) {
        this.spikes.startSide();
        this.player.waiting = false;
      }
      this.player.jump();
    }, false);

    this.back = new Background(this.res);
    this.player = new Player(this.res.images[Const.CKN]);
    this.spikes = new Spikes(this.res.images[Const.BLK], this.res.images[Const.LFT], this.res.images[Const.RGT]);
  }

  resetGame() {
    this.player.reset();
    this.spikes.hideAll();
    this.score = 0;
  }

  update(dt) {
    if (this.waitTimer) {
      if ((this.waitTimer -= dt) < 0) {
        this.waitTimer = 0;
      }
    }

    this.spikes.update(dt);
    this.player.update(dt);
    if (this.player.alive && (this.partTimer -= dt) < 0) {
      this.particles.startTrail(this.player.x, this.player.y);
      this.partTimer = .03;
    }
    this.particles.update(dt);

    if (this.player.alive && this.checkCollision()) {
      this.player.alive = false;
      this.particles.startExp(this.player.x, this.player.y);
      this.spikes.showAll();
      this.waitTimer = 1;
    }
  }

  draw() {
    if (this.player.alive) {
      this.ctx.fillStyle = "#364f80";
      this.ctx.textAlign = "center";
      this.ctx.font = "120px 'Caesar Dressing'";
      this.ctx.fillText(`${this.score}`, Const.WIDTH >> 1, Const.HEIGHT >> 1);
    } else {
      this.ctx.fillStyle = "#0d1d3b";
      this.ctx.textAlign = "center";
      this.ctx.font = "60px 'Caesar Dressing'";
      this.ctx.fillText("GAME OVER", Const.WIDTH >> 1, Const.HEIGHT * .42);
      this.ctx.font = "40px 'Caesar Dressing'";
      this.ctx.fillText(`SCORE: ${(this.score)}`, Const.WIDTH >> 1, Const.HEIGHT * .52);
      this.ctx.font = "40px 'Caesar Dressing'";
      this.ctx.fillText(`BEST: ${(this.bestScore)}`, Const.WIDTH >> 1, Const.HEIGHT * .60);
      this.ctx.font = "25px 'Caesar Dressing'";
      this.ctx.fillText("CLICK TO PLAY", Const.WIDTH >> 1, Const.HEIGHT * .82);
    }

    this.particles.draw(this.ctx);
    this.player.draw(this.ctx);
    this.spikes.draw(this.ctx);
    this.back.draw(this.ctx);

    //this.drawLines();
  }

  checkCollision() {
    if (this.player.right > Const.WIDTH - 40) {
      this.player.x = Const.WIDTH - 40 - (this.player.width >> 1);
      this.player.vx = -this.player.vx;
      this.spikes.startSide();
      this.addScore();
      return false;
    }

    if (this.player.left < 40) {
      this.player.x = 40 + (this.player.width >> 1);
      this.player.vx = -this.player.vx;
      this.spikes.startSide();
      this.addScore();
      return false;
    }
    if (this.player.y < (Const.HEIGHT >> 1)) {
      if (this.lineColision(this.player, this.spikes.colObjectsTop)) return true;
    } else {
      if (this.lineColision(this.player, this.spikes.colObjectsBot)) return true;
    }

    if (this.spikes.side === Const.LFT) {
      if (this.lineColision(this.player, this.spikes.spikesL)) return true;
    } else {
      if (this.lineColision(this.player, this.spikes.spikesR)) return true;
    }

    return false;
  }

  lineColision(p, arr) {
    //http://jeffreythompson.org/collision-detection/line-line.php
    function collide(x1, y1, x2, y2, x3, y3, x4, y4) {
      const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
    }

    for (let s of arr) {
      if (s.alive) {
        if (collide(p.lineTop.start_x, p.lineTop.start_y, p.lineTop.end_x, p.lineTop.end_y,
            s.lineTop.start_x, s.lineTop.start_y, s.lineTop.end_x, s.lineTop.end_y)) return true;
        if (collide(p.lineTop.start_x, p.lineTop.start_y, p.lineTop.end_x, p.lineTop.end_y,
            s.lineBottom.start_x, s.lineBottom.start_y, s.lineBottom.end_x, s.lineBottom.end_y)) return true;

        if (collide(p.lineRight.start_x, p.lineRight.start_y, p.lineRight.end_x, p.lineRight.end_y,
            s.lineTop.start_x, s.lineTop.start_y, s.lineTop.end_x, s.lineTop.end_y)) return true;
        if (collide(p.lineRight.start_x, p.lineRight.start_y, p.lineRight.end_x, p.lineRight.end_y,
            s.lineBottom.start_x, s.lineBottom.start_y, s.lineBottom.end_x, s.lineBottom.end_y)) return true;

        if (collide(p.lineBottom.start_x, p.lineBottom.start_y, p.lineBottom.end_x, p.lineBottom.end_y,
            s.lineTop.start_x, s.lineTop.start_y, s.lineTop.end_x, s.lineTop.end_y)) return true;
        if (collide(p.lineBottom.start_x, p.lineBottom.start_y, p.lineBottom.end_x, p.lineBottom.end_y,
            s.lineBottom.start_x, s.lineBottom.start_y, s.lineBottom.end_x, s.lineBottom.end_y)) return true;

        if (collide(p.lineLeft.start_x, p.lineLeft.start_y, p.lineLeft.end_x, p.lineLeft.end_y,
            s.lineTop.start_x, s.lineTop.start_y, s.lineTop.end_x, s.lineTop.end_y)) return true;
        if (collide(p.lineLeft.start_x, p.lineLeft.start_y, p.lineLeft.end_x, p.lineLeft.end_y,
            s.lineBottom.start_x, s.lineBottom.start_y, s.lineBottom.end_x, s.lineBottom.end_y)) return true;
      }
    }
    return false;
  }

  addScore() {
    this.score++;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  drawLines() {
    function drawLine(ctx, line) {
      ctx.beginPath();
      ctx.moveTo(line.start_x, line.start_y);
      ctx.lineTo(line.end_x, line.end_y);
      ctx.closePath();
      ctx.stroke();
    }

    this.ctx.strokeStyle = "red";
    drawLine(this.ctx, this.player.lineTop);
    drawLine(this.ctx, this.player.lineRight);
    drawLine(this.ctx, this.player.lineBottom);
    drawLine(this.ctx, this.player.lineLeft);

    for (let l of this.spikes.colObjectsTop) {
      if (!l.alive) continue;
      drawLine(this.ctx, l.lineTop);
      drawLine(this.ctx, l.lineBottom);
    }

    for (let l of this.spikes.colObjectsBot) {
      if (!l.alive) continue;
      drawLine(this.ctx, l.lineTop);
      drawLine(this.ctx, l.lineBottom);
    }

    for (let l of this.spikes.spikesL) {
      if (!l.alive) continue;
      drawLine(this.ctx, l.lineTop);
      drawLine(this.ctx, l.lineBottom);
    }

    for (let l of this.spikes.spikesR) {
      if (!l.alive) continue;
      drawLine(this.ctx, l.lineTop);
      drawLine(this.ctx, l.lineBottom);
    }
  }
}

new Dont();
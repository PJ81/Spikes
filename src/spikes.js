import * as Const from "./const.js";

class Spike {
    constructor(pos, y, w, h) {
        this.pos = pos;
        this.width = w;
        this.height = h;
        switch (this.pos) {
            case Const.LFT:
                this.goal = 40;
                this.start = this.goal - 20;
                break;
            case Const.RGT:
                this.goal = Const.WIDTH - 60;
                this.start = this.goal + 20;
                break;
        }
        this.speed = 80;
        this.x = this.start;
        this.y = y;
        this.state = Const.NONE;
        this.alive = false;
    }

    get left() {
        return this.x;
    }

    get top() {
        return this.y;
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    get lineTop() {
        switch (this.pos) {
            case Const.LFT:
                return {
                    start_x: this.left,
                    start_y: this.top,
                    end_x: this.right,
                    end_y: this.top + (this.height >> 1)
                };
            case Const.RGT:
                return {
                    start_x: this.right,
                    start_y: this.top,
                    end_x: this.left,
                    end_y: this.top + (this.height >> 1)
                };
        }
    }

    get lineBottom() {
        switch (this.pos) {
            case Const.LFT:
                return {
                    start_x: this.left,
                    start_y: this.bottom,
                    end_x: this.right,
                    end_y: this.top + (this.height >> 1)
                };
            case Const.RGT:
                return {
                    start_x: this.right,
                    start_y: this.bottom,
                    end_x: this.left,
                    end_y: this.top + (this.height >> 1)
                };
        }
    }

    update(dt) {
        if (this.state === Const.NONE) return;
        let spd = this.speed;
        if ((this.state === Const.SHOW && this.pos === Const.RGT) ||
            (this.state === Const.HIDE && this.pos === Const.LFT)) spd = -spd;

        this.x += dt * spd;

        switch (this.pos) {
            case Const.LFT:
                if (this.x > this.goal) {
                    this.x = this.goal;
                    this.state = Const.NONE;
                } else if (this.x < this.start) {
                    this.x = this.start;
                    this.alive = false;
                }
                break;
            case Const.RGT:
                if (this.x < this.goal) {
                    this.x = this.goal;
                    this.state = Const.NONE;
                } else if (this.x > this.start) {
                    this.x = this.start;
                    this.alive = false;
                }
                break;
        }
    }
}

export default class Spikes {
    constructor(im0, im1, im2) {
        this.images = [im0, im1, im2];
        this.side = Const.LFT;
        this.colObjectsTop = [];
        this.colObjectsBot = [];
        this.spikesL = [];
        this.spikesR = [];

        const w = im1.width,
            h = im1.height;
        for (let l = 0; l < 11; l++) {
            this.spikesL.push(new Spike(Const.LFT, l * im1.height + 80, w, h));
            this.spikesR.push(new Spike(Const.RGT, l * im1.height + 80, w, h));
        }


        const bW = im0.width,
            bH = im0.height,
            sW = h,
            sH = w;
        // top spikes
        for (let s = 1; s < 9; s++) {
            this.colObjectsTop.push({
                alive: true,
                lineTop: {
                    start_x: bW * s,
                    start_y: bH,
                    end_x: bW * s + (sW >> 1),
                    end_y: bH + sH
                },
                lineBottom: {
                    start_x: bW * s + (sW >> 1),
                    start_y: bH + sH,
                    end_x: bW * s + sW,
                    end_y: bH
                }
            });
        }

        // bottom spikes
        for (let s = 1; s < 9; s++) {
            this.colObjectsBot.push({
                alive: true,
                lineTop: {
                    start_x: bW * s,
                    start_y: Const.HEIGHT - bH,
                    end_x: bW * s + (sW >> 1),
                    end_y: Const.HEIGHT - bH - sH
                },
                lineBottom: {
                    start_x: bW * s + (sW >> 1),
                    start_y: Const.HEIGHT - bH - sH,
                    end_x: bW * s + sW,
                    end_y: Const.HEIGHT - bH
                }
            });
        }
    }

    showAll() {
        for (let l of this.spikesL) {
            l.alive = true;
            l.state = Const.SHOW;
        }
        for (let r of this.spikesR) {
            r.alive = true;
            r.state = Const.SHOW;
        }
    }

    hideAll() {
        for (let l of this.spikesL) {
            l.state = Const.HIDE;
        }
        for (let r of this.spikesR) {
            r.state = Const.HIDE;
        }
        this.side = Const.LFT;
    }

    startSide() {
        const count = Math.floor(Math.random() * 3) + 3;
        const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const s = this.side === Const.LFT ? Const.RGT : Const.LFT;

        for (let c = 0; c < count; c++) {
            const n = Math.floor(Math.random() * pool.length);
            const z = s === Const.RGT ? this.spikesR[pool[n]] : this.spikesL[pool[n]];
            z.alive = true;
            z.state = Const.SHOW;
            pool.splice(n, 1);
        }

        switch (this.side) {
            case Const.LFT:
                for (let l of this.spikesL) {
                    if (l.alive) l.state = Const.HIDE;
                }
                break;
            case Const.RGT:
                for (let r of this.spikesR) {
                    if (r.alive) r.state = Const.HIDE;
                }
                break;
        }

        this.side = s;
    }

    update(dt) {
        for (let l of this.spikesL) {
            if (l.alive) l.update(dt);
        }
        for (let r of this.spikesR) {
            if (r.alive) r.update(dt);
        }
    }

    draw(ctx) {
        for (let l of this.spikesL) {
            if (l.alive) ctx.drawImage(this.images[Const.LFT], l.x, l.y);
        }
        for (let r of this.spikesR) {
            if (r.alive) ctx.drawImage(this.images[Const.RGT], r.x, r.y);
        }
    }
}
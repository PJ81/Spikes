import * as Const from "./const.js"

export default class Player {
    constructor(im1) {
        this.image = im1;
        this.width = im1.width;
        this.height = im1.height;
        this.x;
        this.y;
        this.vx;
        this.gravity;
        this.jumpPower;
        this.waiting;
        this.alive;
        this.reset();
    }

    reset() {
        this.x = Const.WIDTH >> 1;
        this.y = Const.HEIGHT >> 1;
        this.vx = 200;
        this.gravity = 180;
        this.jumpPower = -8;
        this.waiting = true;
        this.alive = true;
    }

    update(dt) {
        if (!this.alive || this.waiting) return;
        this.jumpPower += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.jumpPower * dt * 5;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.drawImage(this.image, this.left, this.top)
    }

    jump() {
        if (!this.alive) return;
        this.jumpPower = -80;
    }

    get left() {
        return this.x - (this.width >> 1);
    }

    get top() {
        return this.y - (this.height >> 1);
    }

    get right() {
        return this.x + (this.width >> 1);
    }

    get bottom() {
        return this.y + (this.height >> 1);
    }

    get lineTop() {
        return {
            start_x: this.left,
            start_y: this.top,
            end_x: this.right,
            end_y: this.top
        };
    }

    get lineRight() {
        return {
            start_x: this.right,
            start_y: this.top,
            end_x: this.right,
            end_y: this.bottom
        };
    }

    get lineBottom() {
        return {
            start_x: this.left,
            start_y: this.bottom,
            end_x: this.right,
            end_y: this.bottom
        };
    }

    get lineLeft() {
        return {
            start_x: this.left,
            start_y: this.top,
            end_x: this.left,
            end_y: this.bottom
        };
    }
}
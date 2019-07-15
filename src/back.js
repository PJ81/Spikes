import * as Const from "./const.js"

export default class Background {
  constructor(res) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Const.WIDTH;
    this.canvas.height = Const.HEIGHT;
    const c = this.canvas.getContext("2d"),
      a = res.images[Const.TOP],
      b = res.images[Const.BTM],
      d = res.images[Const.BLK];

    for (let r = 0; r < Const.WIDTH; r += d.width) {
      c.drawImage(d, r, 0);
      c.drawImage(a, r, d.height);
      c.drawImage(b, r, Const.HEIGHT - b.height - d.height);
      c.drawImage(d, r, Const.HEIGHT - d.height);
    }

    for (let r = 0; r < Const.HEIGHT; r += d.height) {
      c.drawImage(d, 0, r);
      c.drawImage(d, Const.WIDTH - d.width, r);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
  }
}
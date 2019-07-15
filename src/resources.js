import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(17);

        Promise.all([
            (this.loadImage("./img/blk.gif")).then((i) => {
                this.images[Const.BLK] = i;
            }),
            (this.loadImage("./img/lft.gif")).then((i) => {
                this.images[Const.LFT] = i;
            }),
            (this.loadImage("./img/rgt.gif")).then((i) => {
                this.images[Const.RGT] = i;
            }),
            (this.loadImage("./img/top.gif")).then((i) => {
                this.images[Const.TOP] = i;
            }),
            (this.loadImage("./img/btm.gif")).then((i) => {
                this.images[Const.BTM] = i;
            }),
            (this.loadImage("./img/CKN.gif")).then((i) => {
                this.images[Const.CKN] = i;
            })
        ]).then(() => {
            cb();
        });
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }
}
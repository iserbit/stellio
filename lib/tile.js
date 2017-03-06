const COORDS = [15, 75, 135, 195, 255, 315, 375, 435];

class Tile {
  constructor(pos, type, queue) {
    // this.id = id;

    this.pos = pos;
    this.row = pos[0];
    this.col = pos[1];

    this.row_coord = COORDS[this.row];
    this.col_coord = COORDS[this.col];

    this.type = type;

    const object = new createjs.Bitmap(queue.getResult(type));

    object.x = this.col_coord;
    object.y = this.row_coord;


    this.queue = queue;
    this.object = object;
  }

  addFadeIn() {
    this.object.alpha = 0;
    createjs.Tween.get(this.object, { loop: false })
      .to({ alpha: 1 }, 500, createjs.Ease.getPowInOut(3));
  }

  addEnlarge() {
    createjs.Tween.get(this.object, { loop: false })
      .wait(1000)
      .to({ scaleX: 1.5, scaleY: 1.5}, 500, createjs.Ease.getPowInOut(3))
      .to({ scaleX: 1, scaleY: 1}, 500, createjs.Ease.getPowInOut(3))
  }

  addDelayedFadeIn() {
    this.object.alpha = 0;
    createjs.Tween.get(this.object, { loop: false })
      .wait(1000)
      .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(3));
  }
};

export default Tile;

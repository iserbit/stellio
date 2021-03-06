const COORDS = [15, 75, 135, 195, 255, 315, 375, 435];

class Tile {
  constructor(pos, type, queue) {
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

  addMatchZoom(removeTiles) {
    createjs.Tween.get(this.object, { loop: false })
      .to({ scaleX: 1.2, scaleY: 1.2}, 300, createjs.Ease.getPowInOut(2))
      .to({ scaleX: 1, scaleY: 1}, 300, createjs.Ease.getPowInOut(2))
      .to({ alpha: 0 }, 300, createjs.Ease.getPowInOut(2))
      .call(() => (removeTiles([this])));
  }

  addDelayedFadeIn() {
    this.object.alpha = 0;
    createjs.Tween.get(this.object, { loop: false })
      .wait(900)
      .to({ alpha: 1 }, 400, createjs.Ease.getPowInOut(3));
  }
}

export default Tile;

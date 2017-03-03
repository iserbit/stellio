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
    createjs.Tween.get(this.object, { loop: false })
      // .set({ visible:false })
      // .set({ visible:true })
      // .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
      // .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
      // .to({ alpha: 0, x: this.col_coor, y: this.row_coord }, 100)
      // .to({ alpha: 0 }, 500, createjs.Ease.getPowInOut(2))
      .to({ alpha: 0 }, 0, createjs.Ease.getPowInOut(2))
      .to({ alpha: 1 }, 800, createjs.Ease.getPowInOut(2));
  }
};

export default Tile;

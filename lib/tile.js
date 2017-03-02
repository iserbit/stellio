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
};

export default Tile;

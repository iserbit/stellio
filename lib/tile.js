const COORDS = [15, 75, 135, 195, 255, 315, 375, 435];

class Tile {

  constructor(pos, type) {
    this.row = pos[0];
    this.col = pos[1];

    this.row_coord = COORDS[this.row];
    this.col_coord = COORDS[this.col];

    this.type = type;

    const bitmap = new createjs.Bitmap(queue.getResult(type));
    bitmap.x = this.col_coord;
    bitmap.y = this.row_coord;

    bitmap.addEventListener('click', () => console.log(this.type));

    this.image = bitmap;
  }
};

export default Tile;

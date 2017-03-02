import Tile from './tile.js';
import random from 'lodash/random';

class Board {
  constructor(stage, queue) {
    const TILES = [ 'earth', 'jupiter', 'mars',
                    'saturn', 'sun', 'blackhole' ];

    this.stage = stage;
    this.queue = queue;
    this.moveTile = this.moveTile.bind(this);

    let board = new Array(8);

    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(8);
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const type = TILES[random(0, 5)];
        const pos = [i, j];
        let tile = new Tile(pos, type, this.queue);
        tile.object.addEventListener('click', () => console.log(tile.type));
        tile.object.on('pressmove', this.moveTile(tile));
        tile.object.on('pressup', () => console.log('mouse up'));

        board[tile.row][tile.col] = tile;
        this.stage.addChild(tile.object);
      };
    };

    this.board = board;
  }

  render() {
    this.stage.update();
  }

  moveTile(tile) {
    return event => {
      const OFFSET = 25;
      const DISTANCE = 60

      const limitRowTop = tile.row_coord - DISTANCE + OFFSET;
      const limitRowBot = tile.row_coord + DISTANCE + OFFSET;
      const limitColTop = tile.col_coord - DISTANCE + OFFSET;
      const limitColBot = tile.col_coord + DISTANCE + OFFSET;

      const row = event.stageY;
      const col = event.stageX;

      if (row < limitRowBot && row > limitRowTop &&
          col < limitColBot && col > limitColTop) {
            event.currentTarget.x = event.stageX - OFFSET;
            event.currentTarget.y = event.stageY - OFFSET;
            this.stage.update();
      } else {
      }
    }
  }
}

export default Board;

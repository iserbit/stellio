import Tile from './tile.js';
import random from 'lodash/random';
import merge from 'lodash/merge';

class Board {
  constructor(stage, queue) {
    this.stage = stage;
    this.queue = queue;
    this.moveTile = this.moveTile.bind(this);
    this.populateBoard = this.populateBoard.bind(this);

    const grid = this.createBoard();
    this.grid = this.populateBoard(grid);

    this.swapTiles = this.swapTiles.bind(this);
    this.render = this.render.bind(this);
    this.isValidMove = this.isValidMove.bind(this);
    this.createTile = this.createTile.bind(this);
    this.findSwapTgt = this.findSwapTgt.bind(this);
    this.removeTile = this.removeTile.bind(this);
  }

  render() {
    this.stage.update();
  }

  createBoard() {
    let grid = new Array(8);
    for (let i = 0; i < grid.length; i++)
      grid[i] = new Array(8);
    return grid;
  }

  populateBoard(grid) {
    const TILES = [ 'earth', 'jupiter', 'mars',
                    'saturn', 'sun', 'blackhole' ];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const id = i + j;

        const type = TILES[random(0, 5)];
        const pos = [i, j];

        const tile = this.createTile(pos, type, this.queue);

        grid[tile.row][tile.col] = tile;
        this.stage.addChild(tile.object);
      };
    };

    return grid;
  }

  createTile(pos, type, queue) {
    const tile = new Tile(pos, type, queue);

    tile.object.addEventListener('pressmove', this.moveTile(tile));
    tile.object.addEventListener('pressup', this.findSwapTgt(tile));

    return tile;
  }

  fillEmptyPos() {

  }

  moveTile(tile) {
    return event => {
      const OFFSET = 25;
      const DISTANCE = 60;

      const limitRowTop = tile.row_coord - DISTANCE + OFFSET;
      const limitRowBot = tile.row_coord + DISTANCE + OFFSET;
      const limitColTop = tile.col_coord - DISTANCE + OFFSET;
      const limitColBot = tile.col_coord + DISTANCE + OFFSET;

      const row = event.stageY;
      const col = event.stageX;

      if (row < limitRowBot && row > limitRowTop &&
          col < limitColBot && col > limitColTop &&
          row > 40 && row < 460 && col > 40 && col < 460) {
        event.currentTarget.x = col - OFFSET;
        event.currentTarget.y = row - OFFSET;
        this.render();
      } else {

      }
    }
  }

  findSwapTgt(tile) {
    return event => {
      const grid = this.grid;

      const src_row = tile.row_coord; // original tile coordinate
      const src_col = tile.col_coord;

      const curr_row = event.target.y; // current tile coordinate
      const curr_col = event.target.x;

      const row_diff = curr_row - src_row;
      const col_diff = curr_col - src_col;

      // console.log('row diff =' + row_diff);
      // console.log('col diff =' + col_diff);

      // LEFT
      if (row_diff > -20 && row_diff <  20 &&
          col_diff > -70 && col_diff < -20) {
        const tgt = grid[tile.row][tile.col - 1];
        console.log('target tile is to the left');
        this.swapTiles(tile, tgt);
      }

      // RIGHT
      if (row_diff > -20 && row_diff < 20 &&
          col_diff >  20 && col_diff < 70) {
        console.log('target tile is to the right');
        const tgt = grid[tile.row][tile.col + 1];
        this.swapTiles(tile, tgt);
      }

      // UP
      if (row_diff > -70 && row_diff < -20 &&
          col_diff > -20 && col_diff < 20) {
        console.log('target tile is to the up');
        const tgt = grid[tile.row - 1][tile.col];
        this.swapTiles(tile, tgt);
      }

      // DOWN
      if (row_diff >  20 && row_diff < 70 &&
          col_diff > -20 && col_diff < 20) {
        console.log('target tile is to the down');
        const tgt = grid[tile.row + 1][tile.col];
        this.swapTiles(tile, tgt);
      }
    };
  }

  swapTiles(src, tgt) {
    if (this.isValidMove(src, tgt)) {
      const newSrc = this.createTile(src.pos, tgt.type, this.queue);
      const newTgt = this.createTile(tgt.pos, src.type, this.queue);

      this.grid[tgt.row][tgt.col] = newTgt;
      this.grid[src.row][src.col] = newSrc;

      this.stage.removeChild(src.object);
      this.stage.removeChild(tgt.object);

      this.stage.addChild(newTgt.object);
      this.stage.addChild(newSrc.object);

      this.stage.update();

      // const placeholder = merge({}, tgt);
      //
      // this.grid[tgt.col][tgt.row] = src;
      // this.grid[src.col][src.row] = tgt;
      //
      // tgt.object.x = src.col_coord;
      // tgt.object.y = src.row_coord;
      //
      // src.object.x = placeholder.col_coord;
      // src.object.y = placeholder.row_coord;
      //
      // tgt = src;
      // src = placeholder;
      //
      // this.stage.update();
    }
  }

  removeTile(tile) {
    console.log(tile.object);
    this.stage.removeChild(tile.object);
    tile.object.removeEventListener('pressmove', this.moveTile(tile));
    tile.object.removeEventListener('pressup', this.findSwapTgt(tile));
    tile = {};
  }

  isValidMove(src, tgt) {
    return true;
  }

  checkMatches(tile) {

  }
}

export default Board;

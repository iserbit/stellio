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
    this.findMatches = this.findMatches.bind(this);
    this.createTile = this.createTile.bind(this);
    this.findSwapTgt = this.findSwapTgt.bind(this);
    this.removeTile = this.removeTile.bind(this);

    this.checkRow = this.checkRow.bind(this);
    this.checkCol = this.checkCol.bind(this);
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
      }
      // else {
      //   event.currentTarget.x = tile.col_coord;
      //   event.currentTarget.y = tile.row_coord;
      // }
    }
  }

  findSwapTgt(tile) {
    return event => {
      let tgt = '';

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
        tgt = grid[tile.row][tile.col - 1];
        console.log('target tile is to the left');
      }

      // RIGHT
      if (row_diff > -20 && row_diff < 20 &&
          col_diff >  20 && col_diff < 70) {
        console.log('target tile is to the right');
        tgt = grid[tile.row][tile.col + 1];
      }

      // UP
      if (row_diff > -70 && row_diff < -20 &&
          col_diff > -20 && col_diff < 20) {
        console.log('target tile is to the up');
        tgt = grid[tile.row - 1][tile.col];
      }

      // DOWN
      if (row_diff >  20 && row_diff < 70 &&
          col_diff > -20 && col_diff < 20) {
        console.log('target tile is to the down');
        tgt = grid[tile.row + 1][tile.col];
      }

      const matches = this.findMatches(tile, tgt);

      if (matches.length > 2) {
        this.swapTiles(tile, tgt, matches);
      } else {
        event.currentTarget.x = tile.col_coord;
        event.currentTarget.y = tile.row_coord;
        this.render();
      }
    }
  }

  swapTiles(src, tgt, matches) {
    const newSrc = this.createTile(src.pos, tgt.type, this.queue);
    const newTgt = this.createTile(tgt.pos, src.type, this.queue);

    this.grid[tgt.row][tgt.col] = newTgt;
    this.grid[src.row][src.col] = newSrc;

    this.stage.removeChild(src.object);
    this.stage.removeChild(tgt.object);

    matches.forEach((tile) => {
      this.stage.removeChild(tile.object);
    });

    this.stage.addChild(newSrc.object);

    this.stage.update();
  }

  removeTile(tile) {
    this.stage.removeChild(tile.object);
    tile.object.removeEventListener('pressmove', this.moveTile(tile));
    tile.object.removeEventListener('pressup', this.findSwapTgt(tile));
    tile = {};
  }

  findMatches(src, tgt) {
    const type = src.type;
    const row = this.grid[tgt.row];
    const rowMatches = this.checkRow(src, tgt);
    const colMatches = this.checkCol(src, tgt);

    const matches = rowMatches.concat(colMatches);
    // debugger;
    return matches;
  }

  checkRow(src, tgt) {
    const row = this.grid[tgt.row];
    const type = src.type;

    const rowMatch = row.filter((tile) => {
      return tile.type === type
      && tile.col >= tgt.col - 2
      && tile.col <= tgt.col + 2
      || tile === tgt;
    });

    return rowMatch;
  }

  checkCol(src, tgt) {
    const type = src.type;
    const col = new Array(8);

    for (let i = 0; i < 8; i++) {
      col[i] = this.grid[i][tgt.col];
    }

    const colMatch = col.filter((tile) => {
      return tile.type === type
      && tile.row >= tgt.row - 2
      && tile.row <= tgt.row + 2
      || tile === tgt;
    });

    return colMatch;
  }

  findConsecutiveMatches(matches) {

  }

  checkMatches(tile) {

  }

  checkBoard() {

  }
}

export default Board;

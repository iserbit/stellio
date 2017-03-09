import Tile from './tile.js';

import random from 'lodash/random';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';

class Board {
  constructor(stage, queue, score) {
    this.types = [ 'earth', 'jupiter', 'mars',
                   'saturn', 'sun', 'blackhole' ];

    this.stage = stage;
    this.queue = queue;
    this.score = score;

    this.grid = this.createBoard();

    this.populateBoard();
    this.checkBoard(true);

    this.populateBoard = this.populateBoard.bind(this);

    this.createRandomTile = this.createRandomTile.bind(this);
    this.removeTile = this.removeTile.bind(this);
    this.replaceTile = this.replaceTile.bind(this);

    this.moveTile = this.moveTile.bind(this);
    this.swapTiles = this.swapTiles.bind(this);

    this.findMatches = this.findMatches.bind(this);
    this.findTileTgt = this.findTileTgt.bind(this);

    this.checkRow = this.checkRow.bind(this);
    this.checkCol = this.checkCol.bind(this);

    this.checkBoard = this.checkBoard.bind(this);
    this.checkBoardMatch = this.checkBoardMatch.bind(this);

    this.setScore = this.setScore.bind(this);
  }

  setScore(matchesCount) {
    switch (matchesCount) {
      case 3:
        this.score.add(100);
        break;
      case 4:
        this.score.add(300);
        break;
      case 5:
        this.score.add(1000);
        break;
      default:
    }
  }

  createBoard() {
    let grid = new Array(8);
    for (let i = 0; i < grid.length; i++)
      grid[i] = new Array(8);
    return grid;
  }

  populateBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.createRandomTile([i, j]);
      };
    };
  }

  createRandomTile(pos) {
    const type = this.types[random(0, 5)];
    const tile = new Tile(pos, type, this.queue);

    tile.object.addEventListener('click', () => console.log(tile));
    tile.object.addEventListener('pressmove', this.moveTile(tile));
    tile.object.addEventListener('pressup', this.findTileTgt(tile));

    this.stage.addChild(tile.object);
    this.grid[tile.row][tile.col] = tile;
  }

  removeTile(tile) {
    // tile.object.
  }

  replaceTile() {
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

      if (row < limitRowBot && row > limitRowTop
       && col < limitColBot && col > limitColTop
       && row > 40 && row < 460
       && col > 40 && col < 460)
      {
        event.currentTarget.x = col - OFFSET;
        event.currentTarget.y = row - OFFSET;
      }
    }
  }

  findTileTgt(tile) {
    return event => {
      let tgt;
      const grid = this.grid;

      const row_diff = event.target.y - tile.row_coord;
      const col_diff = event.target.x - tile.col_coord;

      // LEFT
      if (row_diff > -20 && row_diff <  20
       && col_diff > -70 && col_diff < -20) {
        tgt = grid[tile.row][tile.col - 1];
      }

      // RIGHT
      if (row_diff > -20 && row_diff < 20
       && col_diff >  20 && col_diff < 70) {
        tgt = grid[tile.row][tile.col + 1];
      }

      // UP
      if (row_diff > -70 && row_diff < -20
       && col_diff > -20 && col_diff < 20) {
        tgt = grid[tile.row - 1][tile.col];
      }

      // DOWN
      if (row_diff >  20 && row_diff < 70
       && col_diff > -20 && col_diff < 20) {
        tgt = grid[tile.row + 1][tile.col];
      }

      // L TOP // L BOT // R TOP // R BOT
      if (row_diff < -20 && col_diff < -20
       || row_diff >  20 && col_diff < -20
       || row_diff < -20 && col_diff >  20
       || row_diff >  20 && col_diff > 20) {
        event.currentTarget.x = tile.col_coord;
        event.currentTarget.y = tile.row_coord;
        return;
      }

      if (row_diff > -20 && row_diff < 20 &&
          col_diff > -20 && col_diff < 20 ) {
        event.currentTarget.x = tile.col_coord;
        event.currentTarget.y = tile.row_coord;
        return;
      }
    }
  }

  swapTiles(src, tgt, matches) {
  }

  findMatches(src, tgt) {
  }

  checkRow(src, tgt) {
  }

  checkCol(src, tgt) {
  }

  checkBoard(initial, afterMove) {
  }

  checkBoardMatch(initial, afterMove) {
  }

  checkMatches(tiles) {
  }
}

export default Board;

import Tile from './tile.js';

import random from 'lodash/random';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';

class Board {
  constructor(stage, queue) {
    this.types = [ 'earth', 'jupiter', 'mars',
                   'saturn', 'sun', 'blackhole' ];

    this.stage = stage;
    this.queue = queue;

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    this.grid = this.createBoard();

    this.populateBoard();
    this.checkBoard(true);

    this.render = this.render.bind(this);
    this.populateBoard = this.populateBoard.bind(this);

    this.createTile = this.createTile.bind(this);
    this.removeTile = this.removeTile.bind(this);

    this.moveTile = this.moveTile.bind(this);
    this.swapTiles = this.swapTiles.bind(this);

    this.findMatches = this.findMatches.bind(this);
    this.findSwapTgt = this.findSwapTgt.bind(this);

    this.checkRow = this.checkRow.bind(this);
    this.checkCol = this.checkCol.bind(this);

    this.checkBoard = this.checkBoard.bind(this);
  }

  render() {
    // this.stage.update();
  }

  createBoard() {
    let grid = new Array(8);
    for (let i = 0; i < grid.length; i++)
      grid[i] = new Array(8);
    return grid;
  }

  populateBoard(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const type = this.types[random(0, 5)];
        const pos = [i, j];

        this.createTile(pos, type, this.queue);
      };
    };
  }

  createTile(pos, type) {
    const tile = new Tile(pos, type, this.queue);

    tile.object.addEventListener('click', () => console.log(tile));
    tile.object.addEventListener('pressmove', this.moveTile(tile));
    tile.object.addEventListener('pressup', this.findSwapTgt(tile));

    this.grid[tile.row][tile.col] = tile;
    this.stage.addChild(tile.object);

    return tile;
  }

  removeTile(tile) {
    // tile.object.removeEventListener('pressmove', this.moveTile(tile));
    // tile.object.removeEventListener('pressup', this.findSwapTgt(tile));

    // this.grid[tile.row][tile.col] = '';
    this.stage.removeChild(tile.object);

    tile = '';
  }

  replaceTile(tile, initial) {
    const type = this.types[random(0, 5)];
    const pos = [tile.row, tile.col];

    // tile.object.removeEventListener('pressmove', this.moveTile(tile));
    // tile.object.removeEventListener('pressup', this.findSwapTgt(tile));

    this.stage.removeChild(tile.object);

    const newTile = this.createTile(pos, type);

    if (!initial) {
      newTile.addFadeIn();
    }

    this.grid[tile.row][tile.col] = newTile;

    // tile = '';
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
        this.render();
      }
    }
  }

  findSwapTgt(tile) {
    return event => {
      let tgt;
      const grid = this.grid;

      const row_diff = event.target.y - tile.row_coord;
      const col_diff = event.target.x - tile.col_coord;

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

      // if matches are found, swap the tiles
      if (matches.length > 1) {
        this.swapTiles(tile, tgt, matches);

      // if no matches are found, return the tile to the orig pos
      } else {
        event.currentTarget.x = tile.col_coord;
        event.currentTarget.y = tile.row_coord;
        this.render();
      }
    }
  }

  swapTiles(src, tgt, matches) {
    matches.forEach((tile) => {
      if (tile.pos !== src.pos) {
        this.replaceTile(tile);
      } else {
        this.removeTile(tile);
      }
    });

    this.removeTile(src);
    const newSrc = this.createTile(src.pos, tgt.type, this.queue);
    // const newTgt = this.createTile(tgt.pos, src.type, this.queue);

    this.replaceTile(tgt);

    // this.checkBoard(false);

    this.render();
  }

  findMatches(src, tgt) {
    let rowMatches = this.checkRow(src, tgt);
    let colMatches = this.checkCol(src, tgt);

    if (rowMatches.length < 2)
      rowMatches = [];

    if (colMatches.length < 2)
      colMatches = [];

    // debugger

    return rowMatches.concat(colMatches);
  }

  checkRow(src, tgt) {
    const matches = [];
    const row = this.grid[tgt.row];

    // matches.push(src);

    let i = 1;

    // CHECK LEFT
    while (tgt.col - i >= 0 && row[tgt.col - i].type === src.type) {
      if (tgt.col - i === src.col) {
        break
      }
      matches.push(row[tgt.col - i]);
      i++;
    }

    i = 1;

    // CHECK RIGHT
    while (tgt.col + i <= 7 && row[tgt.col + i].type === src.type) {
      if (tgt.col + i === src.col) {
        break
      }
      matches.push(row[tgt.col + i]);
      i++;
    }

    return matches;
  }

  checkCol(src, tgt) {
    const matches = [];
    const col = new Array(8);

    for (let i = 0; i < 8; i++) {
      col[i] = this.grid[i][tgt.col];
    }

    // matches.push(src);

    let i = 1;

    // CHECK LEFT
    while (tgt.row - i >= 0 && col[tgt.row - i].type === src.type) {
      if (tgt.row - i === src.row) {
        break
      }
      matches.push(col[tgt.row - i]);
      i++;
    }

    i = 1;

    // CHECK RIGHT
    while (tgt.row + i <= 7 && col[tgt.row + i].type === src.type) {
      if (tgt.row + i === src.row) {
        break
      }
      matches.push(col[tgt.row + i]);
      i++;
    }

    return matches;
  }

  checkBoard(initial) {
    let gridCopy = this.grid.slice(0);

    // https://gist.github.com/femto113/1784503
    const transposedGrid = gridCopy.map((_, col) => gridCopy.map(row => row[col]));

    // Iterate through the types
    this.types.forEach(type => {

      // Iterate through the rows
      this.grid.forEach(row => {
        for (let i = 0; i < 5; i++) {
          let rowSlice = row.slice(i, i + 3);
          let matches = rowSlice.filter((slice) => slice.type === type);

          if (matches.length >= 3) {
            matches.forEach((tile) => {
              this.replaceTile(tile, initial);
            });
          }
        }
      });

      // Iterate through the cols
      transposedGrid.forEach(col => {
        for (let i = 0; i < 5; i++) {
          let colSlice = col.slice(i, i + 3);
          let matches = colSlice.filter((slice) => slice.type === type);

          if (matches.length >= 3) {
            matches.forEach((tile) => {
              this.replaceTile(tile, initial);
            });
          }
        }
      });
    });
  }
}

export default Board;

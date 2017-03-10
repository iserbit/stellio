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

    this.createTile = this.createTile.bind(this);
    this.removeTiles = this.removeTiles.bind(this);
    this.replaceTiles = this.replaceTiles.bind(this);

    this.moveTile = this.moveTile.bind(this);
    this.swapTiles = this.swapTiles.bind(this);

    this.findMatches = this.findMatches.bind(this);
    this.findSwapTgt = this.findSwapTgt.bind(this);

    this.checkRow = this.checkRow.bind(this);
    this.checkCol = this.checkCol.bind(this);

    this.checkBoard = this.checkBoard.bind(this);

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
        this.createTile([i, j]);
      };
    };
  }

  createTile(pos, type, initial) {
    type = type || this.types[random(0, 5)];

    const tile = new Tile(pos, type, this.queue);

    tile.object.addEventListener('click', () => console.log(tile));
    tile.object.addEventListener('pressmove', this.moveTile(tile));
    tile.object.addEventListener('pressup', this.findSwapTgt(tile));

    this.stage.addChild(tile.object);

    const oldTile = this.grid[pos[0]][pos[1]];

    if (oldTile) {
      if (initial) {
        this.stage.removeChild(oldTile.object);
      } else {
        oldTile.addMatchZoom(this.removeTiles);
      }
    }

    this.grid[tile.row][tile.col] = tile;

    return tile;
  }

  removeTiles(tiles) {
    tiles.forEach(tile => {
      tile.object.removeEventListener('pressmove', this.moveTile(tile));
      tile.object.removeEventListener('pressup', this.findSwapTgt(tile));
      this.stage.removeChild(tile.object);
    });
  }

  replaceTiles(tiles, initial, afterMove) {
    if (!initial) {
      console.log(tiles.length);
      this.setScore(tiles.length);
    }

    tiles.forEach(tile => {
      const type = this.types[random(0, 5)];
      const pos = [tile.row, tile.col];

      if (!initial) {
        tile.addMatchZoom(this.removeTiles);
      } else {
        this.removeTiles([tile]);
      }

      const newTile = this.createTile(pos, type, initial);

      if (!initial) {
        newTile.addDelayedFadeIn();
      }

      this.grid[tile.row][tile.col] = newTile;
    });
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

  findSwapTgt(tile) {
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

      } else {
        let matches = this.findMatches(tile, tgt);

        if (matches.length < 2) {
          matches = this.findMatches(tgt, tile);
        }

        // if matches are found, swap the tiles
        if (matches.length > 1) {
          this.swapTiles(tile, tgt, matches);

          // if no matches are found, return the tile to the orig pos
        } else {
          event.currentTarget.x = tile.col_coord;
          event.currentTarget.y = tile.row_coord;
        }
      }
    }
  }

  swapTiles(src, tgt, matches) {
    const newTgt = this.createTile(tgt.pos, src.type);
    matches.push(newTgt);

    this.replaceTiles(matches);

    this.removeTiles([src, tgt]);
    this.createTile(src.pos, tgt.type);

    this.checkBoard(false, true);
  }

  findMatches(src, tgt) {
    let rowMatches = this.checkRow(src, tgt);
    let colMatches = this.checkCol(src, tgt);

    if (rowMatches.length < 2)
      rowMatches = [];

    if (colMatches.length < 2)
      colMatches = [];

    return rowMatches.concat(colMatches);
  }

  checkRow(src, tgt) {
    const matches = [];
    const row = this.grid[tgt.row];

    let i = 1;

    // CHECK LEFT
    while (tgt.col - i >= 0 && row[tgt.col - i].type === src.type) {
      if (tgt.col - i === src.col) {
        break;
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

  checkBoard(initial, afterMove) {
    const delay = initial ? 0 : 2000;

    setTimeout(
      () => {
        let cleared = true;
        let gridCopy = this.grid.slice(0);

        // https://gist.github.com/femto113/1784503
        const transposedGrid = gridCopy.map((_, col) => gridCopy.map(row => row[col]));

        //// CHECK ROWS

        this.grid.forEach(row => {
          for (let i = 0; i < 4; i++) {
            const rowSlice = row.slice(i, i + 5);
            if (this.checkMatches(rowSlice)) {
              this.replaceTiles(rowSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        this.grid.forEach(row => {
          for (let i = 0; i < 5; i++) {
            const rowSlice = row.slice(i, i + 4);
            if (this.checkMatches(rowSlice)) {
              this.replaceTiles(rowSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        this.grid.forEach(row => {
          for (let i = 0; i < 6; i++) {
            const rowSlice = row.slice(i, i + 3);
            if (this.checkMatches(rowSlice)) {
              this.replaceTiles(rowSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        //// CHECK COLS

        transposedGrid.forEach(col => {
          for (let i = 0; i < 4; i++) {
            const colSlice = col.slice(i, i + 5);
            if (this.checkMatches(colSlice)) {
              this.replaceTiles(colSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        transposedGrid.forEach(col => {
          for (let i = 0; i < 5; i++) {
            const colSlice = col.slice(i, i + 4);
            if (this.checkMatches(colSlice)) {
              this.replaceTiles(colSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        transposedGrid.forEach(col => {
          for (let i = 0; i < 6; i++) {
            const colSlice = col.slice(i, i + 3);
            if (this.checkMatches(colSlice)) {
              this.replaceTiles(colSlice, initial, afterMove);
              cleared = false;
            }
          }
        });

        if (!cleared) {
          this.checkBoard(initial, afterMove);
        }
      },
    delay, this);
  }

  checkMatches(tiles) {
    const type = tiles[0].type;

    for (let i = 1; i < tiles.length; i++) {
      if (tiles[i].type !== type)
        return false;
    }

    return true;
  }
}

export default Board;

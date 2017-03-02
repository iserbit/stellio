import Tile from './tile.js';
import Board from './board.js';
import random from 'lodash/random';

document.addEventListener('DOMContentLoaded', () => {
  const stage = new createjs.Stage("gameCanvas");
  const queue = new createjs.LoadQueue(true);
  // window.board = new Array(8);
  let board;

  queue.loadFile({id: 'earth', src: '../assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: '../assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: '../assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: '../assets/mars.png'});
  queue.loadFile({id: 'saturn', src: '../assets/saturn.png'});
  queue.loadFile({id: 'sun', src: '../assets/sun.png'});

  // queue.on('complete', populateBoard, this);
  queue.on('complete', () => {
    board = new Board(stage, queue);
    board.render();
  }, this);

  // debugger

});

const moveTile = tile => event => {
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
        stage.update();
  } else {
  }
}

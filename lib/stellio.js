import Tile from './tile.js';
import random from 'lodash/random';

document.addEventListener('DOMContentLoaded', () => {
  window.stage = new createjs.Stage("gameCanvas");
  window.queue = new createjs.LoadQueue(true);
  window.board = new Array(8);

  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(8);
  }

  queue.loadFile({id: 'earth', src: '../assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: '../assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: '../assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: '../assets/mars.png'});
  queue.loadFile({id: 'saturn', src: '../assets/saturn.png'});
  queue.loadFile({id: 'sun', src: '../assets/sun.png'});

  queue.on('complete', populateBoard, this);
});

function populateBoard(event) {
  const TILES = [ 'earth', 'jupiter', 'mars',
                  'saturn', 'sun', 'blackhole' ];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const type = TILES[random(0, 5)];
      const pos = [i, j];
      let tile = new Tile(pos, type);

      tile.object.addEventListener('click', () => console.log(tile.type));
      tile.object.on('pressmove', moveTile(tile));
      tile.object.on('pressup', () => console.log('mouse up'));

      window.board[tile.row][tile.col] = tile;
      stage.addChild(tile.object);
    };
  };

  stage.update();
};

// const moveTile = tile => event => {
const moveTile = tile => event => {
  const limitRowTop = tile.row_coord - 60;
  const limitRowBot = tile.row_coord + 60;
  const limitColTop = tile.col_coord - 60;
  const limitColBot = tile.col_coord + 60;

  const row = event.stageY;
  const col = event.stageX;

  if (row < limitRowBot && row > limitRowTop &&
      col < limitColBot && col > limitColTop) {
        event.currentTarget.x = event.stageX;
        event.currentTarget.y = event.stageY;
        stage.update();
  } else {
  }
}

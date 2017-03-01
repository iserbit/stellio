import Tile from './tile.js';
import random from 'lodash/random';

// COORDINATE = {
//   0: [15, 15],
//   1: [75, 15],
//   2: [135, 15]
// };

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
  const TILES = [ 'earth',
                  'jupiter',
                  'mars',
                  'saturn',
                  'sun',
                  'blackhole' ];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const type = TILES[random(0, 5)];
      const pos = [i, j];
      const tile = new Tile(pos, type);



      window.board[tile.row][tile.col] = tile;
      stage.addChild(tile.image);
    };
  };

  stage.update();
};

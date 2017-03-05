import random from 'lodash/random';

import Game from './game.js';
import Tile from './tile.js';
import Board from './board.js';

document.addEventListener('DOMContentLoaded', () => {
  let board;
  let game;

  const stage = new createjs.Stage("gameCanvas");
  const queue = new createjs.LoadQueue(true);

  loadImages(queue);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);

  queue.on('complete', () => {
    board = new Board(stage, queue);
    board.render();

    game = new Game(board);
    game.play();
  }, this);
});

// function loadImages(queue) {
//   queue.loadFile({id: 'earth', src: 'http://kevinkiklee.com/stellio/assets/earth.png'});
//   queue.loadFile({id: 'blackhole', src: 'http://kevinkiklee.com/stellio/assets/blackhole.png'});
//   queue.loadFile({id: 'jupiter', src: 'http://kevinkiklee.com/stellio/assets/jupiter.png'});
//   queue.loadFile({id: 'mars', src: 'http://kevinkiklee.com/stellio/assets/mars.png'});
//   queue.loadFile({id: 'saturn', src: 'http://kevinkiklee.com/stellio/assets/saturn.png'});
//   queue.loadFile({id: 'sun', src: 'http://kevinkiklee.com/stellio/assets/sun.png'});
// }

function loadImages(queue) {
  queue.loadFile({id: 'earth', src: './assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: './assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: './assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: './assets/mars.png'});
  queue.loadFile({id: 'saturn', src: './assets/saturn.png'});
  queue.loadFile({id: 'sun', src: './assets/sun.png'});
}

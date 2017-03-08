import random from 'lodash/random';

import Game from './game.js';
import Tile from './tile.js';
import Board from './board.js';

document.addEventListener('DOMContentLoaded', () => {
  let board;
  let game;

  const stage = new createjs.Stage("gameCanvas");
  const scoreStage = new createjs.Stage("score");

  const queue = new createjs.LoadQueue(true);

  loadImages(queue);

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", scoreStage);

  queue.on('complete', () => {
    board = new Board(stage, queue, scoreStage);
  }, this);
});

function loadImages(queue) {
  queue.loadFile({id: 'earth', src: './assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: './assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: './assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: './assets/mars.png'});
  queue.loadFile({id: 'saturn', src: './assets/saturn.png'});
  queue.loadFile({id: 'sun', src: './assets/sun.png'});
}

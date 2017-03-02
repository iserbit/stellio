import Tile from './tile.js';
import Board from './board.js';
import random from 'lodash/random';

document.addEventListener('DOMContentLoaded', () => {
  let board;

  const stage = new createjs.Stage("gameCanvas");
  const queue = new createjs.LoadQueue(true);

  loadImages(queue);

  queue.on('complete', () => {
    board = new Board(stage, queue);
    board.render();
  }, this);

});

function loadImages(queue) {
  queue.loadFile({id: 'earth', src: '../assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: '../assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: '../assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: '../assets/mars.png'});
  queue.loadFile({id: 'saturn', src: '../assets/saturn.png'});
  queue.loadFile({id: 'sun', src: '../assets/sun.png'});
}

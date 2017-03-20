import random from 'lodash/random';

import Tile from './tile.js';
import Board from './board.js';
import Score from './score.js';

document.addEventListener('DOMContentLoaded', () => {
  const queue      = new createjs.LoadQueue(true);
  const stage      = new createjs.Stage("gameCanvas");
  const scoreStage = new createjs.Stage("score");

  loadImages(queue);

  createjs.Ticker.setFPS(120);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", scoreStage);
  createjs.Touch.enable(stage);

  queue.on('complete', () => {
    const score = new Score(scoreStage);
    const board = new Board(stage, queue, score);
  }, this);

  const newGame = () => {
    stage.removeAllChildren();
    scoreStage.removeAllChildren();

    const score = new Score(scoreStage);
    const board = new Board(stage, queue, score);
  }

  const newGameBtn = document.querySelector('.new-game-btn');
  newGameBtn.onclick = newGame;
});

function loadImages(queue) {
  queue.loadFile({id: 'earth', src: './assets/earth.png'});
  queue.loadFile({id: 'blackhole', src: './assets/blackhole.png'});
  queue.loadFile({id: 'jupiter', src: './assets/jupiter.png'});
  queue.loadFile({id: 'mars', src: './assets/mars.png'});
  queue.loadFile({id: 'saturn', src: './assets/saturn.png'});
  queue.loadFile({id: 'sun', src: './assets/sun.png'});
}

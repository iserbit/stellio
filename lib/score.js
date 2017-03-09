class Score {
  constructor(stage) {
    this.stage = stage;
    this.scoreValue = 0;

    this.scoreDisplay = new createjs.Text(this.scoreValue, '', '#fe8900');

    this.scoreDisplay.x = 83;
    this.scoreDisplay.y = 0;

    this.scoreDisplay.textAlign = 'center';
    this.scoreDisplay.font = 'bold 45px Open Sans';

    this.stage.addChild(this.scoreDisplay);
    this.stage.update();

    this.add = this.add.bind(this);
  }

  add(value) {
    this.scoreValue += value;
    this.scoreDisplay.text = this.scoreValue;
  }
}


export default Score;

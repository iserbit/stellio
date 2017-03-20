class Score {
  constructor(stage) {
    this.stage = stage;
    this.scoreValue = 0;

    this.scoreDisplay = new createjs.Text(this.scoreValue, '', '#fe8900');

    this.scoreDisplay.x = 83;
    this.scoreDisplay.y = 0;

    this.scoreDisplay.textAlign = 'center';
    this.scoreDisplay.font = 'bold 65px Open Sans';

    this.stage.addChild(this.scoreDisplay);
    this.stage.update();

    this.add = this.add.bind(this);
  }

  receiveCount(matchesCount) {
    switch (matchesCount) {
      case 3:
        this.add(100);
        break;
      case 4:
        this.add(300);
        break;
      case 5:
        this.add(1000);
        break;
      default:
    }
  }

  add(value) {
    this.scoreValue += value;
    this.scoreDisplay.text = this.scoreValue;
  }
}


export default Score;

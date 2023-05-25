class PointWrapper {
    constructor(board, x, y) {
      this.point = board.create('point', [x, y]);
    }
  
    setPosition(x, y) {
      this.point.moveTo([x, y]);
    }
  }
  
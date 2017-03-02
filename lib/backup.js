findMatches(src, tgt, matches) {
  const type = src.type;

  // const tgtLeft = this.grid[tgt.row][tgt.col - 1];
  // const tgtRight = this.grid[tgt.row][tgt.col + 1];
  // const tgtUp = this.grid[tgt.row - 1][tgt.col];
  // const tgtDown = this.grid[tgt.row + 1][tgt.col];

  const tgtLeft1 = this.grid[tgt.row][tgt.col - 1];
  const tgtLeft2 = this.grid[tgt.row][tgt.col - 2];

  const tgtRight1 = this.grid[tgt.row][tgt.col + 1];
  const tgtRight2 = this.grid[tgt.row][tgt.col + 2];

  const tgtUp = this.grid[tgt.row - 1][tgt.col];
  const tgtDown = this.grid[tgt.row + 1][tgt.col];

  // [x, x, o, x, x]
  if (tgtLeft1.type === type &&
      tgtLeft2.type === type &&
      tgtRight1.type === type &&
      tgtRight2.type === type) {
    return [tgtLeft2, tgtLeft1, src, tgtRight1, tgtRight2];
  }

  // [x, x, o, x, _]
  if (tgtLeft1.type === type &&
      tgtLeft2.type === type &&
      tgtRight1.type === type) {
    return [tgtLeft2, tgtLeft1, src, tgtRight1];
  }

  // [_, x, o, x, x]
  if (tgtLeft1.type === type &&
      tgtRight1.type === type &&
      tgtRight2.type === type) {
    return [tgtLeft1, src, tgtRight1, tgtRight2];
  }

  // [x, x, o, _, _]

  if (tgtLeft1.type === type &&
      tgtLeft2.type === type ) {
    return [tgtLeft2, tgtLeft1, src];
  }

  // [x, o, x, _, _]


  // [_, x, o, x, _]

  if (tgtLeft1.type === type &&
      tgtRight1.type === type) {
    return [tgtLeft1, src, tgtRight1];
  }

  // [_, _, x, o, x]

  // [_, _, o, x, x]

  if (tgtRight1.type === type &&
      tgtRight2.type === type) {
    return [src, tgtRight1, tgtRight2];
  }

  return matches;
}

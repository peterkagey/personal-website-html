// Translated from old Ruby code via ChatGPT 5.
export class Tree {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  static build(size) {
    return new TreeGenerator(size).tree();
  }

  equals(other) {
    const bothLeaves = this instanceof Leaf && other instanceof Leaf;
    const neitherLeaves = !(this instanceof Leaf) && !(other instanceof Leaf);
    if (!(bothLeaves || neitherLeaves)) return false;
    return (
      (!this.left && !other.left || this.left?.equals(other.left)) &&
      (!this.right && !other.right || this.right?.equals(other.right))
    );
  }

  toString() {
    return TreeDrawer.makeString(this);
  }

  toArray() {
    return TreeDrawer.makeArray(this);
  }
}

export class Leaf extends Tree {
  constructor() {
    super(null, null);
  }
}

export class TreeDrawer {
  static makeArray(tree) {
    if (tree instanceof Leaf) return [];
    const base = this.concat(tree.left.toArray(), tree.right.toArray());
    return this.withATop(base);
  }

  static makeString(tree) {
    const array = this.makeArray(tree);
    const len = array.length;
    return array
      .map((row, i) => " ".repeat(len - i - 1) + row)
      .join("\n");
  }

  static smoosh(left, right) {
    return left.map((l, i) => l + (right[i] || ""));
  }

  static concat(l, r) {
    return l.length > r.length
      ? this.concatRight(l, r)
      : this.concatLeft(l, r);
  }

  static concatRight(left, right) {
    const diff = left.length - right.length;
    const rightAddendum = Array.from({ length: diff }, () => `${this.buffer(right)}╲`);
    const rightJustified = right.map(
      (str) => str.padStart(2 * right.length + 2, " ")
    );
    const newRight = rightAddendum.concat(rightJustified);
    return this.smoosh(left, newRight);
  }

  static concatLeft(left, right) {
    const diff = right.length - left.length;
    const leftAddendum = Array.from({ length: diff }, () => `╱${this.buffer(left)}`);
    const leftJustified = left.map(
      (str) => str.padEnd(2 * left.length + 2, " ")
    );
    const newLeft = leftAddendum.concat(leftJustified);
    return this.smoosh(newLeft, right);
  }

  static buffer(ary) {
    const size = ary.length === 0 ? 1 : ary[ary.length - 1].length + 1;
    return " ".repeat(size);
  }

  static withATop(ary) {
    if (ary.length === 0) return ["╱╲"];
    const levelsNeeded = Math.floor(ary[ary.length - 1].length / 2) - ary.length;
    const top = Array.from({ length: levelsNeeded }, (_, i) => `╱${" ".repeat(i * 2)}╲`);
    return top.concat(ary);
  }
}

// Utility: cumulative sum
function cumulativeSum(arr) {
  let sum = 0;
  return arr.map((i) => (sum += i));
}

export class TreeGenerator {
  constructor(size) {
    this.size = size;
  }

  tree() {
    if (this.size === 0) return new Leaf();
    const subTreeSize = this.firstTreeSize(this.size);
    const rightTree = new TreeGenerator(subTreeSize).tree();
    const leftTree = new TreeGenerator(this.size - subTreeSize - 1).tree();
    return new Tree(rightTree, leftTree);
  }

  catalan(n) {
    if (n < 2) return 1;
    return Array.from({ length: n - 1 }, (_, i) => {
      const k = i + 2;
      return (n + k) / k;
    }).reduce((a, b) => a * b, 1);
  }

  distribution(n) {
    return Array.from({ length: n }, (_, i) =>
      this.catalan(i) * this.catalan(n - i - 1)
    );
  }

  firstTreeSize(n) {
    const cumSum = cumulativeSum(this.distribution(n));
    const threshold = Math.floor(Math.random() * cumSum[cumSum.length - 1]) + 1;
    for (let i = 0; i < cumSum.length; i++) {
      if (cumSum[i] >= threshold) return i;
    }
    return 0; // fallback
  }
}

export class Player {
  name: string;
  score: number;
  visitScores: number[] = [];

  constructor(name: string, initialScore: number = 0) {
    this.name = name;
    this.score = initialScore;
  }

  addScore(points: number): void {
    this.score += points;
  }

  subtractScore(points: number): void {
    this.score = Math.max(0, this.score - points);
  }

  resetScore(): void {
    this.score = 0;
    this.visitScores = [];
  }

  addVisitScore(points: number): void {
    this.visitScores.push(points);
  }
}

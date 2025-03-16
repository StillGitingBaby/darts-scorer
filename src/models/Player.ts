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

  // Calculate the 3-dart average score
  getThreeDartAverage(): number {
    if (this.visitScores.length === 0) {
      return 0;
    }
    
    const totalScore = this.visitScores.reduce((sum, score) => sum + score, 0);
    return parseFloat((totalScore / this.visitScores.length).toFixed(1));
  }
}

import { Player } from './Player';

export enum GameType {
  X01 = 'X01',
  Cricket = 'Cricket',
  AroundTheClock = 'AroundTheClock',
}

interface ScoreHistoryEntry {
  playerName: string;
  score: number;
  remainingScore: number;
}

export class Game {
  type: GameType;
  startingScore: number;
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  isGameOver: boolean = false;
  winner: Player | null = null;
  private scoreHistory: ScoreHistoryEntry[] = [];
  private doubleOutRequired: boolean;

  constructor(type: GameType, startingScore: number, doubleOutRequired: boolean = false) {
    if (startingScore <= 0) {
      throw new Error('Starting score must be positive');
    }
    if (isNaN(startingScore)) {
      throw new Error('Starting score must be a valid number');
    }
    
    this.type = type;
    this.startingScore = startingScore;
    this.doubleOutRequired = doubleOutRequired;
  }

  addPlayer(name: string): void {
    if (this.players.some(p => p.name === name)) {
      throw new Error('Player name must be unique');
    }
    if (!name.trim()) {
      throw new Error('Player name cannot be empty');
    }
    
    const player = new Player(name, this.startingScore);
    this.players.push(player);
  }

  recordScore(score: number): void {
    if (this.isGameOver) return;
    
    const currentPlayer = this.currentPlayer;
    const remainingScore = currentPlayer.score - score;
    
    // Handle bust scenarios
    if (remainingScore < 0) {
      return; // Score remains unchanged
    }
    
    // Handle double-out rule
    if (this.doubleOutRequired && remainingScore === 0) {
      if (!this.isDoubleScore(score)) {
        return; // Score remains unchanged if not finishing on a double
      }
    }

    // If we're using double-out and the score would leave 1, it's a bust
    if (this.doubleOutRequired && remainingScore === 1) {
      return; // Score remains unchanged
    }
    
    // Record the score
    currentPlayer.subtractScore(score);
    this.scoreHistory.push({
      playerName: currentPlayer.name,
      score,
      remainingScore: currentPlayer.score
    });
    
    // Check for winner
    if (currentPlayer.score === 0) {
      this.isGameOver = true;
      this.winner = currentPlayer;
      return;
    }
    
    this.nextTurn();
  }

  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  reset(): void {
    this.players.forEach(player => player.score = this.startingScore);
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.winner = null;
    this.scoreHistory = [];
  }

  getScoreHistory(): ScoreHistoryEntry[] {
    return [...this.scoreHistory];
  }

  private isDoubleScore(score: number): boolean {
    // Check if the score could be achieved with a double
    return score % 2 === 0 && score <= 40;
  }
} 
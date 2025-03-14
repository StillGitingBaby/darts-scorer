import { Player } from './Player';

export enum GameType {
  X01 = 'X01',
  Cricket = 'Cricket',
  AroundTheClock = 'AroundTheClock',
}

// Define a type for score history
export interface ScoreHistory {
  playerIndex: number;
  score: number;
  previousScore: number;
}

export class Game {
  type: GameType;
  startingScore: number;
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  isGameOver: boolean = false;
  winner: Player | null = null;
  scoreHistory: ScoreHistory[] = [];

  constructor(type: GameType, startingScore: number = 501) {
    this.type = type;
    this.startingScore = startingScore;
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  addPlayer(name: string): void {
    this.players.push(new Player(name, this.startingScore));
  }

  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  recordScore(score: number): void {
    if (this.isGameOver) return;

    const player = this.currentPlayer;
    const previousScore = player.score;

    if (this.type === GameType.X01) {
      // In X01 games, we need to check if the score would go below 0
      if (player.score - score < 0) {
        // Bust - score doesn't count and turn stays with the same player
        return;
      }

      // Record the visit score
      player.addVisitScore(score);

      // Subtract the score
      player.subtractScore(score);

      // Add to score history
      this.scoreHistory.push({
        playerIndex: this.currentPlayerIndex,
        score: score,
        previousScore: previousScore,
      });

      // Check if the player has won
      if (player.score === 0) {
        this.isGameOver = true;
        this.winner = player;
        return;
      }
    }

    // Move to the next player's turn
    this.nextTurn();
  }

  undoLastMove(): void {
    if (this.scoreHistory.length === 0) return;

    // Get the last move
    const lastMove = this.scoreHistory.pop();
    if (!lastMove) return;

    // If the game was over, reset that state
    if (this.isGameOver) {
      this.isGameOver = false;
      this.winner = null;
    }

    // Go back to the previous player
    // We need to adjust the index to go back to the previous player
    this.currentPlayerIndex = lastMove.playerIndex;
    // Get the player who made the last move
    const player = this.players[lastMove.playerIndex];
    // Remove the last visit score
    if (player.visitScores.length > 0) {
      player.visitScores.pop();
    }
    // Restore the previous score
    player.score = lastMove.previousScore;
  }

  reset(): void {
    // Reset all players' scores
    this.players.forEach(player => {
      player.score = this.startingScore;
      player.visitScores = [];
    });

    // Reset game state
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.winner = null;
    this.scoreHistory = [];
  }
}

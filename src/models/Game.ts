import { Player } from './Player';

export enum GameType {
  X01 = 'X01',
  Cricket = 'Cricket',
  AroundTheClock = 'AroundTheClock',
}

export class Game {
  type: GameType;
  startingScore: number;
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  isGameOver: boolean = false;
  winner: Player | null = null;

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
    
    if (this.type === GameType.X01) {
      // In X01 games, we need to check if the score would go below 0
      if (player.score - score < 0) {
        // Bust - score doesn't count and turn stays with the same player
        return;
      }
      
      // Subtract the score
      player.subtractScore(score);
      
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

  reset(): void {
    // Reset all players' scores
    this.players.forEach(player => {
      player.score = this.startingScore;
    });
    
    // Reset game state
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.winner = null;
  }
} 
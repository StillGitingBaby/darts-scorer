import { Game, GameType } from '../../models/Game';

describe('Game', () => {
  it('should create a game with the specified type', () => {
    const game = new Game(GameType.X01, 501);
    expect(game.type).toBe(GameType.X01);
    expect(game.startingScore).toBe(501);
  });

  it('should add players to the game', () => {
    const game = new Game(GameType.X01, 501);
    game.addPlayer('John');
    game.addPlayer('Jane');

    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe('John');
    expect(game.players[1].name).toBe('Jane');
  });

  it('should initialize players with the correct starting score', () => {
    const game = new Game(GameType.X01, 501);
    game.addPlayer('John');

    expect(game.players[0].score).toBe(501);
  });

  it('should track the current player', () => {
    const game = new Game(GameType.X01, 501);
    game.addPlayer('John');
    game.addPlayer('Jane');

    expect(game.currentPlayerIndex).toBe(0);
    expect(game.currentPlayer.name).toBe('John');

    game.nextTurn();
    expect(game.currentPlayerIndex).toBe(1);
    expect(game.currentPlayer.name).toBe('Jane');

    game.nextTurn();
    expect(game.currentPlayerIndex).toBe(0);
    expect(game.currentPlayer.name).toBe('John');
  });

  it('should record scores for the current player', () => {
    const game = new Game(GameType.X01, 501);
    game.addPlayer('John');
    game.addPlayer('Jane');

    game.recordScore(60); // John scores 60
    expect(game.players[0].score).toBe(441); // 501 - 60
    expect(game.currentPlayerIndex).toBe(1); // Now Jane's turn

    game.recordScore(45); // Jane scores 45
    expect(game.players[1].score).toBe(456); // 501 - 45
    expect(game.currentPlayerIndex).toBe(0); // Back to John
  });

  it('should determine when a player has won', () => {
    const game = new Game(GameType.X01, 101);
    game.addPlayer('John');
    game.addPlayer('Jane');

    expect(game.isGameOver).toBe(false);
    expect(game.winner).toBeNull();

    game.recordScore(50); // John scores 50
    game.recordScore(20); // Jane scores 20

    game.recordScore(51); // John scores 51, reaching exactly 0

    expect(game.isGameOver).toBe(true);
    expect(game.winner).not.toBeNull();
    expect(game.winner?.name).toBe('John');
  });

  it('should not allow a player to go below 0 in X01 games', () => {
    const game = new Game(GameType.X01, 50);
    game.addPlayer('John');

    // Try to score more than the remaining points
    game.recordScore(60);

    // Score should remain unchanged and player's turn should not change
    expect(game.players[0].score).toBe(50);
    expect(game.currentPlayerIndex).toBe(0);
  });

  it('should reset the game', () => {
    const game = new Game(GameType.X01, 501);
    game.addPlayer('John');
    game.addPlayer('Jane');

    game.recordScore(60); // John scores 60
    game.recordScore(45); // Jane scores 45

    game.reset();

    expect(game.players[0].score).toBe(501);
    expect(game.players[1].score).toBe(501);
    expect(game.currentPlayerIndex).toBe(0);
    expect(game.isGameOver).toBe(false);
    expect(game.winner).toBeNull();
  });
});

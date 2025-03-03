import { Player } from '../../models/Player';

describe('Player', () => {
  it('should create a player with a name', () => {
    const player = new Player('John');
    expect(player.name).toBe('John');
  });

  it('should have a default score of 0', () => {
    const player = new Player('John');
    expect(player.score).toBe(0);
  });

  it('should be able to add points to score', () => {
    const player = new Player('John');
    player.addScore(50);
    expect(player.score).toBe(50);
    
    player.addScore(25);
    expect(player.score).toBe(75);
  });

  it('should be able to subtract points from score', () => {
    const player = new Player('John', 100);
    player.subtractScore(30);
    expect(player.score).toBe(70);
  });

  it('should not allow score to go below 0', () => {
    const player = new Player('John', 20);
    player.subtractScore(30);
    expect(player.score).toBe(0);
  });

  it('should be able to reset score', () => {
    const player = new Player('John', 100);
    player.resetScore();
    expect(player.score).toBe(0);
  });

  it('should be able to set a custom initial score', () => {
    const player = new Player('John', 501);
    expect(player.score).toBe(501);
  });
}); 
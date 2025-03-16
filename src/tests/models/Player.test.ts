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

  it('should initialize with an empty visitScores array', () => {
    const player = new Player('John');
    expect(player.visitScores).toEqual([]);
  });

  it('should add visit scores to the visitScores array', () => {
    const player = new Player('John');
    player.addVisitScore(60);
    expect(player.visitScores).toEqual([60]);

    player.addVisitScore(45);
    expect(player.visitScores).toEqual([60, 45]);
  });

  it('should clear visitScores when resetting score', () => {
    const player = new Player('John', 501);
    player.addVisitScore(60);
    player.addVisitScore(45);

    player.resetScore();

    expect(player.score).toBe(0);
    expect(player.visitScores).toEqual([]);
  });

  describe('getThreeDartAverage', () => {
    it('should return 0 when no visit scores are recorded', () => {
      const player = new Player('John');
      expect(player.getThreeDartAverage()).toBe(0);
    });

    it('should calculate the average of all visit scores', () => {
      const player = new Player('John');
      player.addVisitScore(60);
      player.addVisitScore(45);
      player.addVisitScore(100);

      // (60 + 45 + 100) / 3 = 68.3333... rounded to 68.3
      expect(player.getThreeDartAverage()).toBe(68.3);
    });

    it('should handle a single visit score', () => {
      const player = new Player('John');
      player.addVisitScore(60);

      expect(player.getThreeDartAverage()).toBe(60);
    });

    it('should update the average when new scores are added', () => {
      const player = new Player('John');
      player.addVisitScore(60);
      expect(player.getThreeDartAverage()).toBe(60);

      player.addVisitScore(45);
      // (60 + 45) / 2 = 52.5
      expect(player.getThreeDartAverage()).toBe(52.5);

      player.addVisitScore(100);
      // (60 + 45 + 100) / 3 = 68.3333... rounded to 68.3
      expect(player.getThreeDartAverage()).toBe(68.3);
    });
  });
});

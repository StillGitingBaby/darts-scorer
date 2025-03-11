import { render, screen } from '@testing-library/react';
import React from 'react';

import PlayerList from '../../components/PlayerList';
import { Player } from '../../models/Player';

// Constants for test data
const PLAYER_NAME_JOHN = 'John';
const PLAYER_NAME_JANE = 'Jane';
const INITIAL_SCORE = 501;
const SCORE_60 = 60;
const SCORE_45 = 45;
const PLAYER_ITEM_TEST_ID = 'player-item';
const LAST_VISIT_TEXT = 'Last visit:';
const VISIT_HISTORY_TEXT = 'Visit history:';
const NO_PLAYERS_MESSAGE = 'No players added yet';

// Create reusable player instances
const createJohnPlayer = () => new Player(PLAYER_NAME_JOHN, INITIAL_SCORE);
const createJanePlayer = () => new Player(PLAYER_NAME_JANE, INITIAL_SCORE);
const createJohnWithScore = () => {
  const player = new Player(PLAYER_NAME_JOHN, 441);
  player.addVisitScore(SCORE_60);
  return player;
};
const createJohnWithHistory = () => {
  const player = new Player(PLAYER_NAME_JOHN, 396);
  player.addVisitScore(SCORE_60);
  player.addVisitScore(SCORE_45);
  return player;
};

// Disable the lint rule for the test file
/* eslint-disable react-perf/jsx-no-new-array-as-prop */

describe('PlayerList', () => {
  it('should render a list of players', () => {
    // Create players array before rendering
    const player1 = createJohnPlayer();
    const player2 = createJanePlayer();
    const players = [player1, player2];
    const currentPlayerIndex = 0;

    render(<PlayerList players={players} currentPlayerIndex={currentPlayerIndex} />);

    expect(screen.getByText(PLAYER_NAME_JOHN)).toBeInTheDocument();
    expect(screen.getByText(PLAYER_NAME_JANE)).toBeInTheDocument();
    expect(screen.getAllByText(INITIAL_SCORE.toString())).toHaveLength(2);
  });

  it('should highlight the current player', () => {
    // Create players array before rendering
    const player1 = createJohnPlayer();
    const player2 = createJanePlayer();
    const players = [player1, player2];
    const currentPlayerIndex = 1;

    render(<PlayerList players={players} currentPlayerIndex={currentPlayerIndex} />);

    const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
    expect(playerItems[0]).not.toHaveClass('bg-blue-100');
    expect(playerItems[1]).toHaveClass('bg-blue-100');
  });

  it('should render an empty message when there are no players', () => {
    const emptyPlayers: Player[] = [];
    render(<PlayerList players={emptyPlayers} currentPlayerIndex={0} />);

    expect(screen.getByText(NO_PLAYERS_MESSAGE)).toBeInTheDocument();
  });

  it('should display the last visit score when available', () => {
    // Create player with visit score
    const player1 = createJohnWithScore();
    const player2 = createJanePlayer();
    const players = [player1, player2];

    render(<PlayerList players={players} currentPlayerIndex={0} />);

    const lastVisitElement = screen.getByText(LAST_VISIT_TEXT).nextSibling;
    expect(lastVisitElement).toHaveTextContent(SCORE_60.toString());
  });

  it('should display visit history when available', () => {
    // Create player with visit history
    const player = createJohnWithHistory();
    const players = [player];

    render(<PlayerList players={players} currentPlayerIndex={0} />);

    const visitHistoryElement = screen.getByText(VISIT_HISTORY_TEXT).nextSibling;
    expect(visitHistoryElement).toHaveTextContent(`${SCORE_60}, ${SCORE_45}`);
  });

  it('should not display visit information when no visits have been made', () => {
    // Create player with no visits
    const player = createJohnPlayer();
    const players = [player];

    render(<PlayerList players={players} currentPlayerIndex={0} />);

    expect(screen.queryByText(LAST_VISIT_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(VISIT_HISTORY_TEXT)).not.toBeInTheDocument();
  });
});

/* eslint-enable react-perf/jsx-no-new-array-as-prop */

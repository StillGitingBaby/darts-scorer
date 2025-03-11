import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import App from '../App';
import { GameType } from '../models/Game';

// Constants for duplicate strings
const STARTING_SCORE = '501';
const PLAYER_1 = 'Player 1';
const PLAYER_2 = 'Player 2';
const PLAYER_ITEM = '[data-testid="player-item"]';
const PLAYER_ITEM_TEST_ID = 'player-item';
const ENTER_SCORE = 'Enter Score:';
const SUBMIT = 'Submit';
const PLAYER_SCORE_441 = '441';
const PLAYER_SCORE_456 = '456';
const BG_BLUE_100 = 'bg-blue-100';
const TURN_TO_THROW = 's turn to throw';
const GAME_TYPE_LABEL = 'Game Type:';
const STARTING_SCORE_LABEL = 'Starting Score:';
const PLAYER_NAME_LABEL = 'Player Name:';
const ADD_PLAYER = 'Add Player';
const START_GAME = 'Start Game';

describe('Darts Scorer System Test', () => {
  it('should allow two players to play a 501 game with turn switching', async () => {
    // Render the full application
    render(<App />);

    // 1. Set up the game with two players
    // Find the game setup form
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE_LABEL);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const startingScoreInput = screen.getByLabelText(STARTING_SCORE_LABEL);
    fireEvent.change(startingScoreInput, { target: { value: STARTING_SCORE } });

    // Add first player
    const playerNameInput = screen.getByLabelText(PLAYER_NAME_LABEL);
    fireEvent.change(playerNameInput, { target: { value: PLAYER_1 } });

    const addPlayerButton = screen.getByRole('button', { name: ADD_PLAYER });
    fireEvent.click(addPlayerButton);

    // Add second player
    fireEvent.change(playerNameInput, { target: { value: PLAYER_2 } });
    fireEvent.click(addPlayerButton);

    // Verify both players are added
    expect(screen.getByText(PLAYER_1)).toBeInTheDocument();
    expect(screen.getByText(PLAYER_2)).toBeInTheDocument();

    // 2. Start the game
    const startGameButton = screen.getByRole('button', { name: START_GAME });
    fireEvent.click(startGameButton);

    // 3. Verify the game has started and Player 1 is the current player
    await waitFor(() => {
      // Check for game title that includes 501
      expect(screen.getByText(`${STARTING_SCORE} X01`)).toBeInTheDocument();

      // Check for the current turn message
      expect(screen.getByText(`${PLAYER_1}'${TURN_TO_THROW}`)).toBeInTheDocument();

      // Verify the score input form is displayed
      expect(screen.getByLabelText(ENTER_SCORE)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: SUBMIT })).toBeInTheDocument();
    });

    // Check that Player 1 is highlighted as the current player
    const player1Element = screen.getByText(PLAYER_1).closest(PLAYER_ITEM);
    expect(player1Element).toHaveClass(BG_BLUE_100);

    // Verify both players have the starting score of 501
    const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
    expect(playerItems[0]).toHaveTextContent(STARTING_SCORE);
    expect(playerItems[1]).toHaveTextContent(STARTING_SCORE);

    // 4. Submit a score for Player 1
    const scoreInput = screen.getByLabelText(ENTER_SCORE);
    fireEvent.change(scoreInput, { target: { value: '60' } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    // 5. Verify Player 1's score is updated and it's now Player 2's turn
    await waitFor(() => {
      // Find all player items
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);

      // Check Player 1's updated score (501 - 60 = 441)
      // First player item should contain Player 1 and their score
      const player1Item = playerItems[0];
      expect(player1Item).toHaveTextContent(PLAYER_1);
      expect(player1Item).toHaveTextContent(PLAYER_SCORE_441);

      // Player 2's score should still be 501
      const player2Item = playerItems[1];
      expect(player2Item).toHaveTextContent(PLAYER_2);
      expect(player2Item).toHaveTextContent(STARTING_SCORE);

      // Check for the current turn message for Player 2
      expect(screen.getByText(`${PLAYER_2}'${TURN_TO_THROW}`)).toBeInTheDocument();

      // Check that Player 2 is now the current player
      const player2Element = screen.getByText(PLAYER_2).closest(PLAYER_ITEM);
      expect(player2Element).toHaveClass(BG_BLUE_100);

      // Player 1 should no longer be highlighted
      const player1ElementAfter = screen.getByText(PLAYER_1).closest(PLAYER_ITEM);
      expect(player1ElementAfter).not.toHaveClass(BG_BLUE_100);
    });

    // 6. Submit a score for Player 2
    fireEvent.change(scoreInput, { target: { value: '45' } });
    fireEvent.click(submitButton);

    // 7. Verify Player 2's score is updated and it's back to Player 1's turn
    await waitFor(() => {
      // Find all player items
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);

      // Player 1's score should still be 441
      const player1Item = playerItems[0];
      expect(player1Item).toHaveTextContent(PLAYER_1);
      expect(player1Item).toHaveTextContent(PLAYER_SCORE_441);

      // Check Player 2's updated score (501 - 45 = 456)
      const player2Item = playerItems[1];
      expect(player2Item).toHaveTextContent(PLAYER_2);
      expect(player2Item).toHaveTextContent(PLAYER_SCORE_456);

      // Check for the current turn message for Player 1
      expect(screen.getByText(`${PLAYER_1}'${TURN_TO_THROW}`)).toBeInTheDocument();

      // Check that Player 1 is now the current player again
      const player1Element = screen.getByText(PLAYER_1).closest(PLAYER_ITEM);
      expect(player1Element).toHaveClass(BG_BLUE_100);

      // Player 2 should no longer be highlighted
      const player2ElementAfter = screen.getByText(PLAYER_2).closest(PLAYER_ITEM);
      expect(player2ElementAfter).not.toHaveClass(BG_BLUE_100);
    });
  });
});

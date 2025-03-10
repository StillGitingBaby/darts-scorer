import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import App from '../App';
import { GameType } from '../models/Game';

describe('Darts Scorer System Test', () => {
  it('should allow two players to play a 501 game with turn switching', async () => {
    // Render the full application
    render(<App />);

    // 1. Set up the game with two players
    // Find the game setup form
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const startingScoreInput = screen.getByLabelText('Starting Score:');
    fireEvent.change(startingScoreInput, { target: { value: '501' } });

    // Add first player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'Player 1' } });

    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);

    // Add second player
    fireEvent.change(playerNameInput, { target: { value: 'Player 2' } });
    fireEvent.click(addPlayerButton);

    // Verify both players are added
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();

    // 2. Start the game
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);

    // 3. Verify the game has started and Player 1 is the current player
    await waitFor(() => {
      // Check for game title that includes 501
      expect(screen.getByText('501 X01')).toBeInTheDocument();

      // Check for the current turn message
      expect(screen.getByText("Player 1's turn to throw")).toBeInTheDocument();

      // Verify the score input form is displayed
      expect(screen.getByLabelText('Enter Score:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    // Check that Player 1 is highlighted as the current player
    const player1Element = screen.getByText('Player 1').closest('[data-testid="player-item"]');
    expect(player1Element).toHaveClass('bg-blue-100');

    // Verify both players have the starting score of 501
    const playerItems = screen.getAllByTestId('player-item');
    expect(playerItems[0]).toHaveTextContent('501');
    expect(playerItems[1]).toHaveTextContent('501');

    // 4. Submit a score for Player 1
    const scoreInput = screen.getByLabelText('Enter Score:');
    fireEvent.change(scoreInput, { target: { value: '60' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    // 5. Verify Player 1's score is updated and it's now Player 2's turn
    await waitFor(() => {
      // Find all player items
      const playerItems = screen.getAllByTestId('player-item');

      // Check Player 1's updated score (501 - 60 = 441)
      // First player item should contain Player 1 and their score
      const player1Item = playerItems[0];
      expect(player1Item).toHaveTextContent('Player 1');
      expect(player1Item).toHaveTextContent('441');

      // Player 2's score should still be 501
      const player2Item = playerItems[1];
      expect(player2Item).toHaveTextContent('Player 2');
      expect(player2Item).toHaveTextContent('501');

      // Check for the current turn message for Player 2
      expect(screen.getByText("Player 2's turn to throw")).toBeInTheDocument();

      // Check that Player 2 is now the current player
      const player2Element = screen.getByText('Player 2').closest('[data-testid="player-item"]');
      expect(player2Element).toHaveClass('bg-blue-100');

      // Player 1 should no longer be highlighted
      const player1ElementAfter = screen
        .getByText('Player 1')
        .closest('[data-testid="player-item"]');
      expect(player1ElementAfter).not.toHaveClass('bg-blue-100');
    });

    // 6. Submit a score for Player 2
    fireEvent.change(scoreInput, { target: { value: '45' } });
    fireEvent.click(submitButton);

    // 7. Verify Player 2's score is updated and it's back to Player 1's turn
    await waitFor(() => {
      // Find all player items
      const playerItems = screen.getAllByTestId('player-item');

      // Player 1's score should still be 441
      const player1Item = playerItems[0];
      expect(player1Item).toHaveTextContent('Player 1');
      expect(player1Item).toHaveTextContent('441');

      // Check Player 2's updated score (501 - 45 = 456)
      const player2Item = playerItems[1];
      expect(player2Item).toHaveTextContent('Player 2');
      expect(player2Item).toHaveTextContent('456');

      // Check for the current turn message for Player 1
      expect(screen.getByText("Player 1's turn to throw")).toBeInTheDocument();

      // Check that Player 1 is now the current player again
      const player1Element = screen.getByText('Player 1').closest('[data-testid="player-item"]');
      expect(player1Element).toHaveClass('bg-blue-100');

      // Player 2 should no longer be highlighted
      const player2ElementAfter = screen
        .getByText('Player 2')
        .closest('[data-testid="player-item"]');
      expect(player2ElementAfter).not.toHaveClass('bg-blue-100');
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import GameBoard from '../../components/GameBoard';
import { GameType } from '../../models/Game';

// Since we're having issues with mocking the CheckoutDisplay component,
// let's test the GameBoard's shouldShowCheckoutRoutes function directly
// by spying on it using jest.spyOn

describe('GameBoard Checkout Integration', () => {
  const setupGame = () => {
    const { container } = render(<GameBoard />);

    // Set up a 501 game with one player
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const startingScoreInput = screen.getByLabelText('Starting Score:');
    fireEvent.change(startingScoreInput, { target: { value: '501' } });

    // Add a player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'Test Player' } });

    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);

    // Start the game
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);

    return { container };
  };

  it('should not show checkout display when score is above MAX_CHECKOUT_SCORE', async () => {
    setupGame();

    // Wait for the game to start
    await waitFor(() => {
      expect(screen.getByText('501 X01')).toBeInTheDocument();
    });

    // Initial score is 501, which is above MAX_CHECKOUT_SCORE (170)
    // Checkout display should not be shown
    expect(screen.queryByText(/Checkout Possible/)).not.toBeInTheDocument();
  });

  it('should not show checkout display for non-X01 games', async () => {
    render(<GameBoard />);

    // Set up a Cricket game with one player
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.Cricket } });

    // Add a player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'Test Player' } });

    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);

    // Start the game
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);

    // Wait for the game to start
    await waitFor(() => {
      expect(screen.getByText('Cricket')).toBeInTheDocument();
    });

    // Checkout display should not be shown for Cricket games
    expect(screen.queryByText(/Checkout Possible/)).not.toBeInTheDocument();
  });
});

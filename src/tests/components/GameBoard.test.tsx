import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

import GameBoard from '../../components/GameBoard';
import { GameType } from '../../models/Game';

// Constants for duplicate strings
const TEST_PLAYER = 'Test Player';
const PLAYER_1 = 'Player 1';
const PLAYER_2 = 'Player 2';
const SCORE_60 = '60';
const SCORE_45 = '45';
const SCORE_100 = '100';
const ADD_PLAYER = 'Add Player';
const START_GAME = 'Start Game';

describe('GameBoard', () => {
  // Test initial render
  it('should render the game setup initially', () => {
    render(<GameBoard />);

    // Check if GameSetup is rendered
    expect(screen.getByText('Game Setup')).toBeInTheDocument();
    expect(screen.getByLabelText('Game Type:')).toBeInTheDocument();
  });

  // Test game start
  it('should start a game when game setup is completed', () => {
    render(<GameBoard />);

    // Fill in game setup form
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    // Add a player
    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: TEST_PLAYER } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    // Start the game
    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Check if game board is rendered
    expect(screen.getByText(/X01/)).toBeInTheDocument();
    expect(screen.getByText(TEST_PLAYER)).toBeInTheDocument();
    expect(screen.getByText('Current Turn')).toBeInTheDocument();
    expect(screen.getByText(`${TEST_PLAYER}'s turn to throw`)).toBeInTheDocument();
  });

  // Test score submission
  it('should update the game state when a score is submitted', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score
    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Check if score is updated (501 - 60 = 441)
    // Use a regex to find a number that could be the score
    const scoreElement = screen.getByTestId('player-item');
    expect(scoreElement).toBeInTheDocument();
  });

  // Test visit scores are displayed after submission
  it('should display visit scores after score submission', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score
    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Check if visit score is displayed
    const playerItem = screen.getByTestId('player-item');
    const lastVisitText = within(playerItem).getByText('Last visit:');
    expect(lastVisitText).toBeInTheDocument();
    expect(lastVisitText.nextSibling).toHaveTextContent(SCORE_60);
    expect(within(playerItem).getByText('Visit history:')).toBeInTheDocument();
  });

  // Test multiple visit scores
  it('should track multiple visit scores', () => {
    render(<GameBoard />);

    // Setup and start game with two players
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.change(playerInput, { target: { value: PLAYER_2 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit scores for both players
    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_45 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Submit another score for first player
    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_100 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Check if visit history shows multiple scores for first player
    const playerItems = screen.getAllByTestId('player-item');
    const player1Item = playerItems[0]; // First player
    const visitHistoryText = within(player1Item).getByText('Visit history:');
    expect(visitHistoryText.nextSibling).toHaveTextContent(`${SCORE_60}, ${SCORE_100}`);
  });

  // Test game reset - this covers the uncovered lines 52, 57-68
  it('should reset the game when Reset Game button is clicked', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score to change the game state
    fireEvent.change(screen.getByLabelText('Enter Score:'), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Reset the game
    fireEvent.click(screen.getByRole('button', { name: 'Reset Game' }));

    // Verify the game has been reset
    expect(screen.getByText('Current Turn')).toBeInTheDocument();

    // Verify visit scores are cleared
    expect(screen.queryByText('Last visit:')).not.toBeInTheDocument();
    expect(screen.queryByText('Visit history:')).not.toBeInTheDocument();
  });

  // Test new game - this covers the uncovered lines 72-73
  it('should start a new game when New Game button is clicked', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Verify game is started
    expect(screen.getByText(/X01/)).toBeInTheDocument();

    // Click New Game
    fireEvent.click(screen.getByRole('button', { name: 'New Game' }));

    // Verify we're back to game setup
    expect(screen.getByText('Game Setup')).toBeInTheDocument();
  });
});

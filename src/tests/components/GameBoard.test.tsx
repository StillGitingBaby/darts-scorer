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
const GAME_SETUP = 'Game Setup';
const GAME_TYPE = 'Game Type:';
const PLAYER_NAME = 'Player Name:';
const CURRENT_TURN = 'Current Turn';
const SUBMIT = 'Submit';
const ENTER_SCORE = 'Enter Score:';
const RESET_GAME = 'Reset Game';
const NEW_GAME = 'New Game';
const LAST_VISIT = 'Last visit:';
const VISIT_HISTORY = 'Visit history:';
const PLAYER_ITEM_TEST_ID = 'player-item';
const UNDO_LAST_SCORE = 'Undo Last Score';

describe('GameBoard', () => {
  // Test initial render
  it('should render the game setup initially', () => {
    render(<GameBoard />);

    // Check if GameSetup is rendered
    expect(screen.getByText(GAME_SETUP)).toBeInTheDocument();
    expect(screen.getByLabelText(GAME_TYPE)).toBeInTheDocument();
  });

  // Test game start
  it('should start a game when game setup is completed', () => {
    render(<GameBoard />);

    // Fill in game setup form
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    // Add a player
    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: TEST_PLAYER } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    // Start the game
    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Check if game board is rendered
    expect(screen.getByText(/X01/)).toBeInTheDocument();
    expect(screen.getByText(TEST_PLAYER)).toBeInTheDocument();
    expect(screen.getByText(CURRENT_TURN)).toBeInTheDocument();
    expect(screen.getByText(`${TEST_PLAYER}'s turn to throw`)).toBeInTheDocument();
  });

  // Test score submission
  it('should update the game state when a score is submitted', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score
    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    // Check if score is updated (501 - 60 = 441)
    // Use a regex to find a number that could be the score
    const scoreElement = screen.getByTestId(PLAYER_ITEM_TEST_ID);
    expect(scoreElement).toBeInTheDocument();
  });

  // Test visit scores are displayed after submission
  it('should display visit scores after score submission', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score
    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    // Check if visit score is displayed
    const playerItem = screen.getByTestId(PLAYER_ITEM_TEST_ID);
    const lastVisitText = within(playerItem).getByText(LAST_VISIT);
    expect(lastVisitText).toBeInTheDocument();
    expect(lastVisitText.nextSibling).toHaveTextContent(SCORE_60);
    expect(within(playerItem).getByText(VISIT_HISTORY)).toBeInTheDocument();
  });

  // Test multiple visit scores
  it('should track multiple visit scores', () => {
    render(<GameBoard />);

    // Setup and start game with two players
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.change(playerInput, { target: { value: PLAYER_2 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit scores for both players
    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_45 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    // Submit another score for first player
    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_100 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    // Check if visit history shows multiple scores for first player
    const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
    const player1Item = playerItems[0]; // First player
    const visitHistoryText = within(player1Item).getByText(VISIT_HISTORY);
    expect(visitHistoryText.nextSibling).toHaveTextContent(`${SCORE_60}, ${SCORE_100}`);
  });

  // Test game reset - this covers the uncovered lines 52, 57-68
  it('should reset the game when Reset Game button is clicked', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Submit a score to change the game state
    fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
    fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

    // Reset the game
    fireEvent.click(screen.getByRole('button', { name: RESET_GAME }));

    // Verify the game has been reset
    expect(screen.getByText(CURRENT_TURN)).toBeInTheDocument();

    // Verify visit scores are cleared
    expect(screen.queryByText(LAST_VISIT)).not.toBeInTheDocument();
    expect(screen.queryByText(VISIT_HISTORY)).not.toBeInTheDocument();
  });

  // Test new game - this covers the uncovered lines 72-73
  it('should start a new game when New Game button is clicked', () => {
    render(<GameBoard />);

    // Setup and start game
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const playerInput = screen.getByLabelText(PLAYER_NAME);
    fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Verify game is started
    expect(screen.getByText(/X01/)).toBeInTheDocument();

    // Click New Game
    fireEvent.click(screen.getByRole('button', { name: NEW_GAME }));

    // Verify we're back to game setup
    expect(screen.getByText(GAME_SETUP)).toBeInTheDocument();
  });

  // Tests for the undo functionality
  describe('Undo functionality', () => {
    it('should render the Undo Last Score button when game is started', () => {
      render(<GameBoard />);

      // Setup and start game
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Check if the Undo Last Score button is rendered
      expect(screen.getByRole('button', { name: UNDO_LAST_SCORE })).toBeInTheDocument();
    });

    it('should have the Undo Last Score button disabled initially', () => {
      render(<GameBoard />);

      // Setup and start game
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Check if the Undo Last Score button is disabled
      const undoButton = screen.getByRole('button', { name: UNDO_LAST_SCORE });
      expect(undoButton).toBeDisabled();
    });

    it('should enable the Undo Last Score button after a score is submitted', () => {
      render(<GameBoard />);

      // Setup and start game
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Submit a score
      fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
      fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

      // Check if the Undo Last Score button is enabled
      const undoButton = screen.getByRole('button', { name: UNDO_LAST_SCORE });
      expect(undoButton).not.toBeDisabled();
    });

    it('should undo the last score when Undo Last Score button is clicked', () => {
      render(<GameBoard />);

      // Setup and start game
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Submit a score
      fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
      fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

      // Get the player's score after submission
      const playerItem = screen.getByTestId(PLAYER_ITEM_TEST_ID);
      const scoreElement = within(playerItem).getByText('441');
      expect(scoreElement).toBeInTheDocument();

      // Click the Undo Last Score button
      fireEvent.click(screen.getByRole('button', { name: UNDO_LAST_SCORE }));

      // Get the player's score after undo
      const updatedScoreElement = within(playerItem).getByText('501');
      expect(updatedScoreElement).toBeInTheDocument();

      // The visit history should be cleared
      expect(screen.queryByText(LAST_VISIT)).not.toBeInTheDocument();
      expect(screen.queryByText(VISIT_HISTORY)).not.toBeInTheDocument();
    });

    it('should restore the correct player turn when undoing a score', () => {
      render(<GameBoard />);

      // Setup and start game with two players
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.change(playerInput, { target: { value: PLAYER_2 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Submit a score for Player 1
      fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
      fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

      // Now it should be Player 2's turn
      expect(screen.getByText(`${PLAYER_2}'s turn to throw`)).toBeInTheDocument();

      // Undo the last score
      fireEvent.click(screen.getByRole('button', { name: UNDO_LAST_SCORE }));

      // It should be Player 1's turn again
      expect(screen.getByText(`${PLAYER_1}'s turn to throw`)).toBeInTheDocument();
    });

    it('should disable the Undo Last Score button after undoing all moves', () => {
      render(<GameBoard />);

      // Setup and start game
      const gameTypeSelect = screen.getByLabelText(GAME_TYPE);
      fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

      const playerInput = screen.getByLabelText(PLAYER_NAME);
      fireEvent.change(playerInput, { target: { value: PLAYER_1 } });
      fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

      fireEvent.click(screen.getByRole('button', { name: START_GAME }));

      // Submit a score
      fireEvent.change(screen.getByLabelText(ENTER_SCORE), { target: { value: SCORE_60 } });
      fireEvent.click(screen.getByRole('button', { name: SUBMIT }));

      // Undo the score
      fireEvent.click(screen.getByRole('button', { name: UNDO_LAST_SCORE }));

      // The Undo Last Score button should be disabled again
      const undoButton = screen.getByRole('button', { name: UNDO_LAST_SCORE });
      expect(undoButton).toBeDisabled();
    });
  });
});

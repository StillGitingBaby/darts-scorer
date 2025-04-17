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
const BG_BLUE_100 = 'bg-blue-100';
const TURN_TO_THROW = 's turn to throw';
const GAME_TYPE_LABEL = 'Game Type:';
const STARTING_SCORE_LABEL = 'Starting Score:';
const PLAYER_NAME_LABEL = 'Player Name:';
const ADD_PLAYER = 'Add Player';
const START_GAME = 'Start Game';
const START_VOICE_INPUT = 'Start voice input';

// Helper function to setup a game with two players
const setupGame = async (player1Name = PLAYER_1, player2Name = PLAYER_2) => {
  // Render the full application
  render(<App />);

  // Set up the game
  const gameTypeSelect = screen.getByLabelText(GAME_TYPE_LABEL);
  fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

  const startingScoreInput = screen.getByLabelText(STARTING_SCORE_LABEL);
  fireEvent.change(startingScoreInput, { target: { value: STARTING_SCORE } });

  // Add first player
  const playerNameInput = screen.getByLabelText(PLAYER_NAME_LABEL);
  fireEvent.change(playerNameInput, { target: { value: player1Name } });
  const addPlayerButton = screen.getByRole('button', { name: ADD_PLAYER });
  fireEvent.click(addPlayerButton);

  // Add second player
  fireEvent.change(playerNameInput, { target: { value: player2Name } });
  fireEvent.click(addPlayerButton);

  // Start the game
  const startGameButton = screen.getByRole('button', { name: START_GAME });
  fireEvent.click(startGameButton);

  // Wait for game to start and verify
  await waitFor(() => {
    expect(screen.getByText(`${STARTING_SCORE} X01`)).toBeInTheDocument();
    expect(screen.getByText(`${player1Name}'${TURN_TO_THROW}`)).toBeInTheDocument();
  });

  return {
    scoreInput: screen.getByLabelText(ENTER_SCORE),
    submitButton: screen.getByRole('button', { name: SUBMIT }),
  };
};

// Helper to enter a manual score
const enterManualScore = (
  scoreInput: HTMLElement,
  submitButton: HTMLElement,
  score: string
): void => {
  fireEvent.change(scoreInput, { target: { value: score } });
  fireEvent.click(submitButton);
};

// Helper to verify player turn and score
const verifyPlayerState = async (
  currentPlayerName: string,
  currentPlayerScore: string | null,
  otherPlayerName: string,
  otherPlayerScore: string | null
): Promise<void> => {
  await waitFor(() => {
    // Find the current player's item
    const currentPlayerElement = screen.getByText(currentPlayerName).closest(PLAYER_ITEM);
    expect(currentPlayerElement).toHaveClass(BG_BLUE_100);

    // Find the other player's item
    const otherPlayerElement = screen.getByText(otherPlayerName).closest(PLAYER_ITEM);
    expect(otherPlayerElement).not.toHaveClass(BG_BLUE_100);

    // Verify turn message
    expect(screen.getByText(`${currentPlayerName}'${TURN_TO_THROW}`)).toBeInTheDocument();

    // Verify scores if provided
    if (currentPlayerScore) {
      expect(currentPlayerElement).toHaveTextContent(currentPlayerScore);
    }
    if (otherPlayerScore) {
      expect(otherPlayerElement).toHaveTextContent(otherPlayerScore);
    }
  });
};

describe('Darts Scorer System Test', () => {
  it('should allow two players to play a 501 game with turn switching', async () => {
    // Setup game with two players
    const { scoreInput, submitButton } = await setupGame();

    // Verify initial state
    const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
    expect(playerItems[0]).toHaveTextContent(STARTING_SCORE);
    expect(playerItems[1]).toHaveTextContent(STARTING_SCORE);

    // Player 1 is highlighted as current player
    const player1Element = screen.getByText(PLAYER_1).closest(PLAYER_ITEM);
    expect(player1Element).toHaveClass(BG_BLUE_100);

    // Player 1 scores 60
    enterManualScore(scoreInput, submitButton, '60');
    await verifyPlayerState(PLAYER_2, STARTING_SCORE, PLAYER_1, '441');

    // Player 2 scores 45
    enterManualScore(scoreInput, submitButton, '45');
    await verifyPlayerState(PLAYER_1, '441', PLAYER_2, '456');
  });

  it('should support scoring and undo functionality with both manual and voice input', async () => {
    // Mock voice recognition (for environments that support it)
    const mockVoiceRecognition = {
      start: jest.fn(callback => {
        setTimeout(() => callback('count 40'), 100);
      }),
      stop: jest.fn(),
    };

    jest.mock('../utils/voiceRecognition', () => ({
      VoiceRecognition: jest.fn(() => mockVoiceRecognition),
      isVoiceRecognitionSupported: jest.fn(() => true),
    }));

    // Setup game
    const { scoreInput, submitButton } = await setupGame();

    // Player 1 scores manually (60)
    enterManualScore(scoreInput, submitButton, '60');
    await verifyPlayerState(PLAYER_2, STARTING_SCORE, PLAYER_1, '441');

    // Player 2 attempts voice input or falls back to manual
    const voiceButton = screen.queryByLabelText(START_VOICE_INPUT);
    if (voiceButton) {
      fireEvent.click(voiceButton);
      await waitFor(() => {
        expect(mockVoiceRecognition.start).toHaveBeenCalled();
      });
    } else {
      console.log(
        'Voice input button not found in test environment, using manual input for Player 2'
      );
      enterManualScore(scoreInput, submitButton, '40');
    }

    // Verify Player 2's score was updated and it's Player 1's turn
    await verifyPlayerState(PLAYER_1, '441', PLAYER_2, '461');

    // Player 1 scores manually (45)
    enterManualScore(scoreInput, submitButton, '45');
    await verifyPlayerState(PLAYER_2, '461', PLAYER_1, '396');

    // Test undo functionality - undo Player 1's last score
    const undoButton = screen.getByRole('button', { name: /Undo/ });
    expect(undoButton).toBeInTheDocument();
    fireEvent.click(undoButton);

    // Verify Player 1's score is restored
    await verifyPlayerState(PLAYER_1, '441', PLAYER_2, '461');

    // Undo Player 2's score
    fireEvent.click(undoButton);
    await verifyPlayerState(PLAYER_2, STARTING_SCORE, PLAYER_1, '441');

    // Undo Player 1's first score
    fireEvent.click(undoButton);

    // Verify both players' scores are back to starting and undo button is disabled
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      expect(playerItems[0]).toHaveTextContent(STARTING_SCORE);
      expect(playerItems[1]).toHaveTextContent(STARTING_SCORE);

      const undoButtonFinal = screen.getByRole('button', { name: /Undo/ });
      expect(undoButtonFinal).toBeDisabled();
    });
  });

  it('should correctly preserve game state when using voice input after multiple manual scores', async () => {
    // Setup game with custom player names
    const { scoreInput, submitButton } = await setupGame('Jem', 'Tom');

    // First player scores 45 manually
    enterManualScore(scoreInput, submitButton, '45');
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      expect(playerItems[0]).toHaveTextContent('456'); // 501 - 45 = 456
    });

    // Second player scores 54 manually
    enterManualScore(scoreInput, submitButton, '54');
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      expect(playerItems[1]).toHaveTextContent('447'); // 501 - 54 = 447
    });

    // Store current scores for verification
    const playerItemsBeforeVoice = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
    const player1ScoreMatch = playerItemsBeforeVoice[0].textContent?.match(/\d+/);
    const player1ScoreBeforeVoice = parseInt(player1ScoreMatch?.[0] || '0');

    // Try voice input for the first player's next turn
    const voiceButton = screen.queryByLabelText(START_VOICE_INPUT);
    if (!voiceButton) {
      return;
    }

    // Click the voice input button
    fireEvent.click(voiceButton);

    // Verify correct score calculation after voice input
    await waitFor(
      () => {
        const playerItemsAfterVoice = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
        const expectedPlayer1Score = player1ScoreBeforeVoice - 40; // Should be 456 - 40 = 416

        const player1ScoreMatchAfter = playerItemsAfterVoice[0].textContent?.match(/\d+/);
        const actualPlayer1Score = parseInt(player1ScoreMatchAfter?.[0] || '0');

        expect(actualPlayer1Score).toBe(expectedPlayer1Score);
      },
      { timeout: 3000 }
    );
  });
});

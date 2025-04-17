import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';

import App from '../App';
import { GameType } from '../models/Game';

// Constants for duplicate strings
const STARTING_SCORE = '501';
const PLAYER_1 = 'Player 1';
const PLAYER_2 = 'Player 2';
const PLAYER_ITEM_TEST_ID = 'player-item';
const TURN_TO_THROW_TEXT = "'s turn to throw";
const GAME_TYPE_LABEL = 'Game Type:';
const STARTING_SCORE_LABEL = 'Starting Score:';
const PLAYER_NAME_LABEL = 'Player Name:';
const ADD_PLAYER = 'Add Player';
const START_GAME = 'Start Game';
const NEW_GAME = 'New Game';
const GAME_OVER = 'Game Over!';
const HAS_WON = 'has won the game!';
const COUNT_100 = 'count 100';
const SCORE_CLASS_SELECTOR = '.text-3xl.font-bold';
const VOICE_INPUT_TEXT = 'Voice Input';

// Mock the confetti function
jest.mock('canvas-confetti', () => jest.fn());

// Mock the voice recognition module
jest.mock('../utils/voiceRecognition', () => {
  // Create a mock implementation
  const mockVoiceRecognition = jest.fn().mockImplementation(() => {
    let callback: ((text: string) => void) | null = null;

    return {
      start: jest.fn(onResult => {
        callback = onResult;
      }),
      stop: jest.fn(),
      // Method to simulate voice input for testing
      simulateVoiceInput: (text: string) => {
        if (callback) {
          callback(text);
        }
      },
    };
  });

  return {
    VoiceRecognition: mockVoiceRecognition,
    isVoiceRecognitionSupported: jest.fn().mockReturnValue(true),
  };
});

describe('Voice Scoring System Test', () => {
  // Import the mocked module
  let voiceRecognitionModule: any;

  beforeEach(() => {
    // Get a reference to the mocked module
    voiceRecognitionModule = require('../utils/voiceRecognition');
    jest.clearAllMocks();
  });

  // Helper function to simulate voice input with act()
  const simulateVoiceInput = async (voiceRecognitionInstance: any, text: string) => {
    await act(async () => {
      voiceRecognitionInstance.simulateVoiceInput(text);
    });
  };

  it('should allow players to use voice commands to input scores', async () => {
    // Render the full application
    render(<App />);

    // Set up the game with two players
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

    // Start the game
    const startGameButton = screen.getByRole('button', { name: START_GAME });
    fireEvent.click(startGameButton);

    // Wait for the game to start
    await waitFor(() => {
      expect(screen.getByText(`${STARTING_SCORE} X01`)).toBeInTheDocument();
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Find the microphone button and click it
    const voiceButton = screen.getByText(VOICE_INPUT_TEXT);
    fireEvent.click(voiceButton);

    // Verify that the app is listening
    expect(screen.getAllByText(/Listening/)[0]).toBeInTheDocument();

    // Get the instance of the VoiceRecognition class that was created
    const voiceRecognitionInstance = voiceRecognitionModule.VoiceRecognition.mock.results[0].value;

    // Simulate voice input for Player 1
    await simulateVoiceInput(voiceRecognitionInstance, 'count 60');

    // Wait for the score to be updated
    await waitFor(() => {
      // Find the score element for Player 1
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player1ScoreElement = playerItems[0].querySelector(SCORE_CLASS_SELECTOR);
      expect(player1ScoreElement).toHaveTextContent('441'); // 501 - 60 = 441

      // Check that it's now Player 2's turn
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Simulate voice input for Player 2
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, 'count 45');

    // Wait for Player 2's score to be updated
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player2ScoreElement = playerItems[1].querySelector(SCORE_CLASS_SELECTOR);
      expect(player2ScoreElement).toHaveTextContent('456'); // 501 - 45 = 456

      // Check that it's back to Player 1's turn
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Test an invalid voice command
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, 'sixty points');

    // Verify that an error message is displayed
    await waitFor(() => {
      const errorElement = screen.getByText(/Please start with 'count'/);
      expect(errorElement).toBeInTheDocument();
    });

    // Test a valid voice command after an invalid one
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, 'count 20');

    // Verify Player 1's score is updated correctly
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player1ScoreElement = playerItems[0].querySelector(SCORE_CLASS_SELECTOR);
      expect(player1ScoreElement).toHaveTextContent('421'); // 441 - 20 = 421
    });
  });

  it('should handle invalid scores and finishing a game with voice input', async () => {
    // Render the full application
    render(<App />);

    // Set up the game with two players
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE_LABEL);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const startingScoreInput = screen.getByLabelText(STARTING_SCORE_LABEL);
    fireEvent.change(startingScoreInput, { target: { value: STARTING_SCORE } });

    // Add players and start the game
    const playerNameInput = screen.getByLabelText(PLAYER_NAME_LABEL);
    fireEvent.change(playerNameInput, { target: { value: PLAYER_1 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.change(playerNameInput, { target: { value: PLAYER_2 } });
    fireEvent.click(screen.getByRole('button', { name: ADD_PLAYER }));

    fireEvent.click(screen.getByRole('button', { name: START_GAME }));

    // Wait for the game to start
    await waitFor(() => {
      expect(screen.getByText(`${STARTING_SCORE} X01`)).toBeInTheDocument();
    });

    // Get the instance of the VoiceRecognition class
    const voiceRecognitionInstance = voiceRecognitionModule.VoiceRecognition.mock.results[0].value;

    // Test an impossible score (179 is not possible in darts)
    const voiceButton = screen.getByText(VOICE_INPUT_TEXT);
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, 'count 179');

    // Verify that an error message is displayed
    await waitFor(() => {
      const errorElement = screen.getByText(/179 is not a possible 3-dart score/);
      expect(errorElement).toBeInTheDocument();
    });

    // Play a quick game to completion
    // Player 1 scores 100
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Wait for Player 2's turn
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Player 2 scores 100
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Wait for Player 1's turn
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Player 1 scores 100
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 2 scores 100
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 1 scores 100
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 2 scores 100
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 1 scores 100
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 2 scores 100
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 1 scores 100, leaving 1 point
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Wait for Player 2's turn
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Player 2 scores 100, leaving 1 point
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, COUNT_100);

    // Player 1 scores 1 to finish the game with "count 1"
    await waitFor(() => {
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });
    fireEvent.click(voiceButton);
    await simulateVoiceInput(voiceRecognitionInstance, 'count 1');

    // Verify that the game is over
    await waitFor(() => {
      expect(screen.getByText(GAME_OVER)).toBeInTheDocument();
      expect(screen.getByText(`${PLAYER_1} ${HAS_WON}`)).toBeInTheDocument();
    });

    // Start a new game
    fireEvent.click(screen.getByRole('button', { name: NEW_GAME }));

    // Wait for the setup screen
    await waitFor(() => {
      expect(screen.getByLabelText(GAME_TYPE_LABEL)).toBeInTheDocument();
    });
  });
});

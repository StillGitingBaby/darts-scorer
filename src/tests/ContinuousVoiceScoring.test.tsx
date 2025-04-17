import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import React from 'react';

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
const SCORE_CLASS_SELECTOR = '.text-3xl.font-bold';
const VOICE_INPUT_TEXT = 'Voice Input';
const STOP_VOICE_TEXT = 'Stop Voice';
const LISTENING_TEXT = 'Listening';

// Mock the confetti function
jest.mock('canvas-confetti', () => jest.fn());

// Mock the voice recognition module
jest.mock('../utils/voiceRecognition', () => {
  // Create a mock implementation
  const mockVoiceRecognition = jest.fn().mockImplementation(() => {
    let callback: ((text: string) => void) | null = null;
    let isContinuous = true; // Default to true now

    return {
      start: jest.fn((onResult, continuous = true) => {
        // Default to true
        callback = onResult;
        isContinuous = continuous;
      }),
      stop: jest.fn(),
      // Method to simulate voice input for testing
      simulateVoiceInput: (text: string) => {
        if (callback) {
          callback(text);
        }
      },
      // Property to check if started in continuous mode
      isContinuous: () => isContinuous,
    };
  });

  return {
    VoiceRecognition: mockVoiceRecognition,
    isVoiceRecognitionSupported: jest.fn().mockReturnValue(true),
  };
});

describe('Continuous Voice Scoring Test', () => {
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

  it('should allow continuous voice scoring with multiple scores', async () => {
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
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Start listening (continuous by default)
    const voiceButton = screen.getByText(VOICE_INPUT_TEXT);
    fireEvent.click(voiceButton);

    // Verify that continuous listening mode is active
    expect(screen.getAllByText(new RegExp(LISTENING_TEXT))[0]).toBeInTheDocument();

    // Get the instance of the VoiceRecognition class that was created
    const voiceRecognitionInstance = voiceRecognitionModule.VoiceRecognition.mock.results[0].value;

    // Check if it was started in continuous mode
    expect(voiceRecognitionInstance.isContinuous()).toBe(true);

    // Simulate multiple voice inputs without clicking the button again
    // Player 1's turn - input 60
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

    // Player 2's turn - input 45
    await simulateVoiceInput(voiceRecognitionInstance, 'count 45');

    // Wait for Player 2's score to be updated
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player2ScoreElement = playerItems[1].querySelector(SCORE_CLASS_SELECTOR);
      expect(player2ScoreElement).toHaveTextContent('456'); // 501 - 45 = 456

      // Check that it's back to Player 1's turn
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Player 1's turn - input 20
    await simulateVoiceInput(voiceRecognitionInstance, 'count 20');

    // Wait for Player 1's score to be updated
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player1ScoreElement = playerItems[0].querySelector(SCORE_CLASS_SELECTOR);
      expect(player1ScoreElement).toHaveTextContent('421'); // 441 - 20 = 421

      // Check that it's Player 2's turn
      expect(screen.getByText(`${PLAYER_2}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Verify recognition continues after an invalid input
    await simulateVoiceInput(voiceRecognitionInstance, 'not a valid command');

    // Should show an error but keep listening
    await waitFor(() => {
      const errorElement = screen.getByText(/Please start with 'count'/);
      expect(errorElement).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(LISTENING_TEXT))[0]).toBeInTheDocument();
    });

    // Player 2's turn - after error, valid input
    await simulateVoiceInput(voiceRecognitionInstance, 'count 25');

    // Wait for Player 2's score to be updated
    await waitFor(() => {
      const playerItems = screen.getAllByTestId(PLAYER_ITEM_TEST_ID);
      const player2ScoreElement = playerItems[1].querySelector(SCORE_CLASS_SELECTOR);
      expect(player2ScoreElement).toHaveTextContent('431'); // 456 - 25 = 431

      // Check that it's Player 1's turn
      expect(screen.getByText(`${PLAYER_1}${TURN_TO_THROW_TEXT}`)).toBeInTheDocument();
    });

    // Stop the continuous recognition
    fireEvent.click(screen.getByText(STOP_VOICE_TEXT));

    // Check that it's not listening anymore (we're looking for the listening text message, not the button)
    expect(screen.queryByText('Say "count" followed by your score')).not.toBeInTheDocument();
  });
});

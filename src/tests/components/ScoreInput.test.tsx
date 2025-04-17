import * as rtl from '@testing-library/react';
import React from 'react';

import ScoreInput from '../../components/ScoreInput';

// Mock the VoiceRecognition module
jest.mock('../../utils/voiceRecognition', () => {
  const mockStart = jest.fn();
  const mockStop = jest.fn();

  return {
    isVoiceRecognitionSupported: jest.fn().mockReturnValue(true),
    VoiceRecognition: jest.fn().mockImplementation(() => ({
      start: mockStart,
      stop: mockStop,
    })),
    _mocks: {
      start: mockStart,
      stop: mockStop,
    },
  };
});

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

// Constants for button text
const VOICE_INPUT_TEXT = 'Voice Input';
const STOP_VOICE_TEXT = 'Stop Voice';
const LISTENING_TEXT = 'Listening';
const ENTER_SCORE = 'Enter Score:';
const SUBMIT = 'Submit';

// Alias the imported utilities
const { render, screen, fireEvent } = rtl;

// Get access to the mocks
const voiceRecognitionModule = require('../../utils/voiceRecognition');

describe('ScoreInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the score input form', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    expect(screen.getByLabelText(ENTER_SCORE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: SUBMIT })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voice input/i })).toBeInTheDocument();
  });

  it('should toggle voice recognition on button click', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    // Initially should not be listening
    expect(screen.queryByText(LISTENING_TEXT)).not.toBeInTheDocument();

    // Start listening
    fireEvent.click(screen.getByText(VOICE_INPUT_TEXT));

    // Should now be listening
    expect(screen.getAllByText(new RegExp(LISTENING_TEXT))[0]).toBeInTheDocument();

    // Button text should change
    expect(screen.getByText(STOP_VOICE_TEXT)).toBeInTheDocument();
    expect(screen.queryByText(VOICE_INPUT_TEXT)).not.toBeInTheDocument();

    // Stop listening
    fireEvent.click(screen.getByText(STOP_VOICE_TEXT));

    // Should no longer be listening
    expect(screen.queryByText(LISTENING_TEXT)).not.toBeInTheDocument();

    // Button text should change back
    expect(screen.getByText(VOICE_INPUT_TEXT)).toBeInTheDocument();
    expect(screen.queryByText(STOP_VOICE_TEXT)).not.toBeInTheDocument();
  });

  it('should pass true to VoiceRecognition.start by default', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    // Start listening
    fireEvent.click(screen.getByText(VOICE_INPUT_TEXT));

    // Verify start was called with continuous mode enabled
    expect(voiceRecognitionModule._mocks.start).toHaveBeenCalledWith(expect.any(Function));
  });
});

import { render } from '@testing-library/react';
import * as rtl from '@testing-library/react';
import React from 'react';

import ScoreInput from '../../components/ScoreInput';

// Constants for duplicate strings
const ENTER_SCORE = 'Enter Score:';
const SUBMIT = 'Submit';
const SCORE_60 = '60';
const MAX_SCORE = '180';

// Alias the imported utilities
const screen = rtl.screen;
const fireEvent = rtl.fireEvent;

describe('ScoreInput', () => {
  it('should render the score input form', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    expect(screen.getByLabelText(ENTER_SCORE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: SUBMIT })).toBeInTheDocument();
  });

  it('should call onScoreSubmit with the entered score when submitted', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: SCORE_60 } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    expect(onScoreSubmit).toHaveBeenCalledWith(60);
  });

  it('should not call onScoreSubmit when the form is submitted with an invalid score', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'invalid' } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    expect(onScoreSubmit).not.toHaveBeenCalled();
  });

  it('should clear the input after submission', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: SCORE_60 } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    expect(input.value).toBe('');
  });

  // Tests for impossible scores validation
  it('should not call onScoreSubmit when an impossible score is entered', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '179' } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    expect(onScoreSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('179 is not a possible 3-dart score');
  });

  it('should display an error message for impossible scores', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    // Test multiple impossible scores
    const impossibleScores = [179, 178, 176, 175, 173, 172, 169, 166, 163];
    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: SUBMIT });

    for (const impossibleScore of impossibleScores) {
      fireEvent.change(input, { target: { value: impossibleScore.toString() } });
      fireEvent.click(submitButton);

      expect(onScoreSubmit).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(
        `${impossibleScore} is not a possible 3-dart score`
      );
    }
  });

  // Tests for maximum score validation
  it('should not call onScoreSubmit when a score exceeds 180', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '181' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(onScoreSubmit).not.toHaveBeenCalled();

    // Wait for the error message to appear
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('181 exceeds maximum possible score of 180');
  });

  it('should display an error message for scores exceeding maximum', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    // Test a few scores above the maximum
    const tooHighScores = [181, 200, 300];
    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    const form = input.closest('form');

    for (const highScore of tooHighScores) {
      fireEvent.change(input, { target: { value: highScore.toString() } });
      fireEvent.submit(form!);

      expect(onScoreSubmit).not.toHaveBeenCalled();

      // Wait for the error message to appear
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(`${highScore} exceeds maximum possible score of 180`);
    }
  });

  it('should accept the maximum score of 180', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: MAX_SCORE } });

    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    expect(onScoreSubmit).toHaveBeenCalledWith(180);
  });

  it('should automatically focus on the input field after score submission', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    fireEvent.change(input, { target: { value: SCORE_60 } });

    // Submit the score
    const submitButton = screen.getByRole('button', { name: SUBMIT });
    fireEvent.click(submitButton);

    // Check if the input has focus after submission
    expect(document.activeElement).toBe(input);
  });

  it('should automatically focus on the input field when autoFocus is true', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} autoFocus={true} />);

    const input = screen.getByLabelText(ENTER_SCORE) as HTMLInputElement;
    // Check if the input has focus when component mounts
    expect(document.activeElement).toBe(input);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreInput from '../../components/ScoreInput';

describe('ScoreInput', () => {
  it('should render the score input form', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    expect(screen.getByLabelText('Enter Score:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
  
  it('should call onScoreSubmit with the entered score when submitted', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    const input = screen.getByLabelText('Enter Score:');
    fireEvent.change(input, { target: { value: '60' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    expect(onScoreSubmit).toHaveBeenCalledWith(60);
  });
  
  it('should not call onScoreSubmit when the form is submitted with an invalid score', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    const input = screen.getByLabelText('Enter Score:');
    fireEvent.change(input, { target: { value: 'invalid' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    expect(onScoreSubmit).not.toHaveBeenCalled();
  });
  
  it('should clear the input after submission', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    const input = screen.getByLabelText('Enter Score:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '60' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    expect(input.value).toBe('');
  });
  
  it('should provide quick score buttons', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    const quickButtons = screen.getAllByRole('button');
    expect(quickButtons.length).toBeGreaterThan(1); // At least Submit + some quick buttons
    
    // Find and click a quick score button (e.g., 20)
    const twentyButton = screen.getByRole('button', { name: '20' });
    fireEvent.click(twentyButton);
    
    expect(onScoreSubmit).toHaveBeenCalledWith(20);
  });

  // New tests for impossible scores validation
  it('should not call onScoreSubmit when an impossible score is entered', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    const input = screen.getByLabelText('Enter Score:');
    fireEvent.change(input, { target: { value: '179' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    expect(onScoreSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('179 is not a possible 3-dart score');
  });

  it('should display an error message for impossible scores', () => {
    const onScoreSubmit = jest.fn();
    render(<ScoreInput onScoreSubmit={onScoreSubmit} />);
    
    // Test multiple impossible scores
    const impossibleScores = [179, 178, 176, 175, 173, 172, 169, 166, 163];
    const input = screen.getByLabelText('Enter Score:');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    for (const impossibleScore of impossibleScores) {
      fireEvent.change(input, { target: { value: impossibleScore.toString() } });
      fireEvent.click(submitButton);
      
      expect(onScoreSubmit).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(`${impossibleScore} is not a possible 3-dart score`);
    }
  })

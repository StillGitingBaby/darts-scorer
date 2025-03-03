import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameSetup from '../../components/GameSetup';
import { GameType } from '../../models/Game';

describe('GameSetup', () => {
  it('should render the game setup form', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    expect(screen.getByLabelText('Game Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Starting Score:')).toBeInTheDocument();
    expect(screen.getByLabelText('Player Name:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Player' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
  });
  
  it('should add a player when the add player button is clicked', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(playerNameInput).toHaveValue(''); // Input should be cleared
  });
  
  it('should not add a player with an empty name', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    expect(screen.queryByTestId('player-item')).not.toBeInTheDocument();
  });
  
  it('should call onGameStart with the correct parameters when the start game button is clicked', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Add a player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    // Set game type and starting score
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });
    
    const startingScoreInput = screen.getByLabelText('Starting Score:');
    fireEvent.change(startingScoreInput, { target: { value: '501' } });
    
    // Start the game
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);
    
    expect(onGameStart).toHaveBeenCalledWith({
      gameType: GameType.X01,
      startingScore: 501,
      playerNames: ['John']
    });
  });
  
  it('should not start the game if no players are added', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);
    
    expect(onGameStart).not.toHaveBeenCalled();
  });
}); 
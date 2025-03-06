import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);
    
    expect(onGameStart).toHaveBeenCalledWith({
      gameType: GameType.X01,
      startingScore: 501,
      playerNames: ['John'],
      doubleOutRequired: false
    });
  });
  
  it('should not start the game if no players are added', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);
    
    expect(onGameStart).not.toHaveBeenCalled();
  });

  it('should not allow duplicate player names', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Add first player named "John"
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    // Try to add another player named "John"
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    fireEvent.click(addPlayerButton);
    
    expect(screen.getByText('Player name must be unique')).toBeInTheDocument();
    // Should only have one "John" in the list
    expect(screen.getAllByText('John')).toHaveLength(1);
  });

  it('should validate starting score based on game type', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Select X01 game type
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });
    
    // Try invalid starting score for X01
    const startingScoreInput = screen.getByLabelText('Starting Score:');
    fireEvent.change(startingScoreInput, { target: { value: '502' } });
    
    expect(screen.getByText('X01 games must start with a score ending in 01')).toBeInTheDocument();
    
    // Set valid score
    fireEvent.change(startingScoreInput, { target: { value: '501' } });
    expect(screen.queryByText('X01 games must start with a score ending in 01')).not.toBeInTheDocument();
  });

  it('should allow configuring double-out rule for X01 games', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Select X01 game type
    const gameTypeSelect = screen.getByLabelText('Game Type:');
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });
    
    // Check double-out checkbox
    const doubleOutCheckbox = screen.getByLabelText('Double Out Required');
    fireEvent.click(doubleOutCheckbox);
    
    // Add a player and start game
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    fireEvent.click(startGameButton);
    
    expect(onGameStart).toHaveBeenCalledWith({
      gameType: GameType.X01,
      startingScore: 501,
      playerNames: ['John'],
      doubleOutRequired: true
    });
  });

  it('should validate minimum number of players', async () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Add a player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    // Remove the player
    const removeButton = screen.getByRole('button', { name: 'Remove John' });
    fireEvent.click(removeButton);
    
    // Try to start game without players
    const startGameButton = screen.getByRole('button', { name: 'Start Game' });
    expect(startGameButton).toBeDisabled();
    
    // Add a player again to enable the button
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    fireEvent.click(addPlayerButton);
    expect(startGameButton).toBeEnabled();
    
    // Remove the player again
    const newRemoveButton = screen.getByRole('button', { name: 'Remove John' });
    fireEvent.click(newRemoveButton);
    
    // Verify the button is disabled and error message is shown
    expect(startGameButton).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('At least one player is required');
    expect(onGameStart).not.toHaveBeenCalled();
  });

  it('should allow removing players from the game', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);
    
    // Add a player
    const playerNameInput = screen.getByLabelText('Player Name:');
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });
    fireEvent.click(addPlayerButton);
    
    // Remove the player
    const removeButton = screen.getByRole('button', { name: 'Remove John' });
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });
}); 
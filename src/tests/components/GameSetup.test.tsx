import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

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
      playerNames: ['John'],
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

    const playerNameInput = screen.getByLabelText('Player Name:');
    const addPlayerButton = screen.getByRole('button', { name: 'Add Player' });

    // Add a player named "John"
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    fireEvent.click(addPlayerButton);

    // Try adding "John" again
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    fireEvent.click(addPlayerButton);

    // Ensure "John" appears only once in the players list
    const playersList = screen.getAllByText('John');
    expect(playersList.length).toBe(1);

    // (Optional) Check for an error message if your UI displays one
    expect(screen.queryByText('Duplicate player names are not allowed')).toBeInTheDocument();

    // Ensure input is cleared after valid entry
    expect(playerNameInput).toHaveValue('');
  });

});

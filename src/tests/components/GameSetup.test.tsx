import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import GameSetup from '../../components/GameSetup';
import { GameType } from '../../models/Game';

// Constants for duplicate strings
const PLAYER_NAME = 'John';
const ADD_PLAYER = 'Add Player';
const START_GAME = 'Start Game';
const STARTING_SCORE = '501';
const PLAYER_NAME_LABEL = 'Player Name:';
const GAME_TYPE_LABEL = 'Game Type:';
const STARTING_SCORE_LABEL = 'Starting Score:';

describe('GameSetup', () => {
  it('should render the game setup form', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);

    expect(screen.getByLabelText(GAME_TYPE_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(STARTING_SCORE_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(PLAYER_NAME_LABEL)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ADD_PLAYER })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: START_GAME })).toBeInTheDocument();
  });

  it('should add a player when the add player button is clicked', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);

    const playerNameInput = screen.getByLabelText(PLAYER_NAME_LABEL);
    fireEvent.change(playerNameInput, { target: { value: PLAYER_NAME } });

    const addPlayerButton = screen.getByRole('button', { name: ADD_PLAYER });
    fireEvent.click(addPlayerButton);

    expect(screen.getByText(PLAYER_NAME)).toBeInTheDocument();
    expect(playerNameInput).toHaveValue(''); // Input should be cleared
  });

  it('should not add a player with an empty name', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);

    const addPlayerButton = screen.getByRole('button', { name: ADD_PLAYER });
    fireEvent.click(addPlayerButton);

    expect(screen.queryByTestId('player-item')).not.toBeInTheDocument();
  });

  it('should call onGameStart with the correct parameters when the start game button is clicked', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);

    // Add a player
    const playerNameInput = screen.getByLabelText(PLAYER_NAME_LABEL);
    fireEvent.change(playerNameInput, { target: { value: PLAYER_NAME } });

    const addPlayerButton = screen.getByRole('button', { name: ADD_PLAYER });
    fireEvent.click(addPlayerButton);

    // Set game type and starting score
    const gameTypeSelect = screen.getByLabelText(GAME_TYPE_LABEL);
    fireEvent.change(gameTypeSelect, { target: { value: GameType.X01 } });

    const startingScoreInput = screen.getByLabelText(STARTING_SCORE_LABEL);
    fireEvent.change(startingScoreInput, { target: { value: STARTING_SCORE } });

    // Start the game
    const startGameButton = screen.getByRole('button', { name: START_GAME });
    fireEvent.click(startGameButton);

    expect(onGameStart).toHaveBeenCalledWith({
      gameType: GameType.X01,
      startingScore: 501,
      playerNames: [PLAYER_NAME],
    });
  });

  it('should not start the game if no players are added', () => {
    const onGameStart = jest.fn();
    render(<GameSetup onGameStart={onGameStart} />);

    const startGameButton = screen.getByRole('button', { name: START_GAME });
    fireEvent.click(startGameButton);

    expect(onGameStart).not.toHaveBeenCalled();
  });
});

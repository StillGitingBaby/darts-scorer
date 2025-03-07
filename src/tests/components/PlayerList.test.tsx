import { render, screen } from '@testing-library/react';
import React from 'react';

import PlayerList from '../../components/PlayerList';
import { Player } from '../../models/Player';

describe('PlayerList', () => {
  it('should render a list of players', () => {
    const players = [new Player('John', 501), new Player('Jane', 501)];
    const currentPlayerIndex = 0;

    render(<PlayerList players={players} currentPlayerIndex={currentPlayerIndex} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getAllByText('501')).toHaveLength(2);
  });

  it('should highlight the current player', () => {
    const players = [new Player('John', 501), new Player('Jane', 501)];
    const currentPlayerIndex = 1;

    render(<PlayerList players={players} currentPlayerIndex={currentPlayerIndex} />);

    const playerItems = screen.getAllByTestId('player-item');
    expect(playerItems[0]).not.toHaveClass('bg-blue-100');
    expect(playerItems[1]).toHaveClass('bg-blue-100');
  });

  it('should render an empty message when there are no players', () => {
    render(<PlayerList players={[]} currentPlayerIndex={0} />);

    expect(screen.getByText('No players added yet')).toBeInTheDocument();
  });
});

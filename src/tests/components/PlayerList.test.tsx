import { render, screen, within } from '@testing-library/react';
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

  it('should display the last visit score when available', () => {
    const player1 = new Player('John', 441);
    player1.addVisitScore(60);
    
    const player2 = new Player('Jane', 501);
    
    render(<PlayerList players={[player1, player2]} currentPlayerIndex={0} />);

    const lastVisitElement = screen.getByText('Last visit:').nextSibling;
    expect(lastVisitElement).toHaveTextContent('60');
  });

  it('should display visit history when available', () => {
    const player = new Player('John', 396);
    player.addVisitScore(60);
    player.addVisitScore(45);
    
    render(<PlayerList players={[player]} currentPlayerIndex={0} />);

    const visitHistoryElement = screen.getByText('Visit history:').nextSibling;
    expect(visitHistoryElement).toHaveTextContent('60, 45');
  });

  it('should not display visit information when no visits have been made', () => {
    const player = new Player('John', 501);
    
    render(<PlayerList players={[player]} currentPlayerIndex={0} />);

    expect(screen.queryByText('Last visit:')).not.toBeInTheDocument();
    expect(screen.queryByText('Visit history:')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import React from 'react';

import CheckoutDisplay from '../../components/CheckoutDisplay';
import * as checkoutRoutes from '../../utils/checkoutRoutes';

// Mock the checkoutRoutes utility
jest.mock('../../utils/checkoutRoutes', () => ({
  isCheckoutPossible: jest.fn(),
  getCheckoutRoutes: jest.fn(),
}));

describe('CheckoutDisplay', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should not render anything when checkout is not possible', () => {
    // Mock isCheckoutPossible to return false
    (checkoutRoutes.isCheckoutPossible as jest.Mock).mockReturnValue(false);

    const { container } = render(<CheckoutDisplay score={180} />);

    // Verify the component doesn't render anything
    expect(container.firstChild).toBeNull();

    // Verify isCheckoutPossible was called with the correct score
    expect(checkoutRoutes.isCheckoutPossible).toHaveBeenCalledWith(180);
  });

  it('should render checkout information when checkout is possible', () => {
    // Mock isCheckoutPossible to return true
    (checkoutRoutes.isCheckoutPossible as jest.Mock).mockReturnValue(true);

    // Mock getCheckoutRoutes to return some routes
    const mockRoutes = ['T20 T20 D20'];
    (checkoutRoutes.getCheckoutRoutes as jest.Mock).mockReturnValue(mockRoutes);

    render(<CheckoutDisplay score={160} />);

    // Verify the component renders the checkout information
    expect(screen.getByText('Checkout Possible: 160')).toBeInTheDocument();
    expect(screen.getByText('Suggested routes:')).toBeInTheDocument();
    expect(screen.getByText('T20 T20 D20')).toBeInTheDocument();

    // Verify the utility functions were called with the correct score
    expect(checkoutRoutes.isCheckoutPossible).toHaveBeenCalledWith(160);
    expect(checkoutRoutes.getCheckoutRoutes).toHaveBeenCalledWith(160);
  });

  it('should render multiple checkout routes when available', () => {
    // Mock isCheckoutPossible to return true
    (checkoutRoutes.isCheckoutPossible as jest.Mock).mockReturnValue(true);

    // Mock getCheckoutRoutes to return multiple routes
    const mockRoutes = ['T20 T19 D16', 'T19 T18 D16'];
    (checkoutRoutes.getCheckoutRoutes as jest.Mock).mockReturnValue(mockRoutes);

    render(<CheckoutDisplay score={143} />);

    // Verify the component renders all checkout routes
    expect(screen.getByText('Checkout Possible: 143')).toBeInTheDocument();
    expect(screen.getByText('T20 T19 D16')).toBeInTheDocument();
    expect(screen.getByText('T19 T18 D16')).toBeInTheDocument();
  });

  it('should handle null routes gracefully', () => {
    // Mock isCheckoutPossible to return true
    (checkoutRoutes.isCheckoutPossible as jest.Mock).mockReturnValue(true);

    // Mock getCheckoutRoutes to return null (shouldn't happen in practice)
    (checkoutRoutes.getCheckoutRoutes as jest.Mock).mockReturnValue(null);

    render(<CheckoutDisplay score={40} />);

    // Verify the component still renders the checkout information
    expect(screen.getByText('Checkout Possible: 40')).toBeInTheDocument();

    // But doesn't render the routes section
    expect(screen.queryByText('Suggested routes:')).not.toBeInTheDocument();
  });
});

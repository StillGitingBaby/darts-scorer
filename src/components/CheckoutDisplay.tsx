import React from 'react';

import { isCheckoutPossible, getCheckoutRoutes } from '../utils/checkoutRoutes';

interface CheckoutDisplayProps {
  score: number;
}

const CheckoutDisplay: React.FC<CheckoutDisplayProps> = ({ score }) => {
  // Only show checkout routes if checkout is possible
  if (!isCheckoutPossible(score)) {
    return null;
  }

  const routes = getCheckoutRoutes(score);

  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
      <p className="font-bold">Checkout Possible: {score}</p>
      {routes && (
        <div className="mt-2">
          <p className="font-medium">Suggested routes:</p>
          <ul className="list-disc list-inside">
            {routes.map((route, index) => (
              <li key={index}>{route}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckoutDisplay;

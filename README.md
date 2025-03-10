# Darts Scorer PWA

A Progressive Web App for scoring darts games, built with React, TypeScript, and Tailwind CSS.

## Features

- Score tracking for different darts games (501, 301, Cricket, Around the Clock)
- Multiple player support
- Offline functionality with PWA capabilities
- Responsive design for mobile and desktop
- Quick score input with common dart scores

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/darts-scorer.git
cd darts-scorer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Testing

Run the tests with:
```bash
npm test
```

## Project Structure

- `src/models/` - Data models for the game logic
- `src/components/` - React components
- `src/tests/` - Test files
- `public/` - Static assets and PWA manifest

## Game Types

### X01 (501, 301, etc.)
- Players start with a set score (e.g., 501) and take turns throwing three darts
- The score for each turn is subtracted from the player's total
- The first player to reach exactly zero wins
- If a player would go below zero in a turn, the turn is a "bust" and their score remains unchanged

### Cricket (Coming Soon)
- Players take turns throwing three darts at numbers 15-20 and the bullseye
- To close a number, a player must hit it three times
- Points are scored by hitting a number that is closed by you but not by your opponent
- The first player to close all numbers and have the highest score wins

### Around the Clock (Coming Soon)
- Players take turns throwing darts at numbers 1-20 in sequence
- A player must hit the current number to advance to the next
- The first player to hit all numbers in sequence wins

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Contributing

### Branch Protection

This project has branch protection rules to maintain code quality:

1. Direct commits and pushes to the `main` branch are not allowed
2. All changes must be made through pull requests
3. Pull requests require at least one review before merging
4. All status checks must pass before merging

### Setting Up Git Hooks

To prevent accidental commits/pushes to protected branches, run:

```bash
./scripts/setup-git-hooks.sh
```

This will install pre-commit and pre-push hooks that block direct commits to the main branch.

### Contribution Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request to `main`
4. Address any review comments
5. Once approved and all checks pass, your PR can be merged 
# Darts Scoring PWA Development Log

## Project Setup

We're building a Darts Scoring Progressive Web App using:

- React with TypeScript
- Vite as the build tool
- Jest for testing (switched from Vitest due to configuration issues)
- Tailwind CSS for styling
- PWA features for offline functionality

The project structure is already initialized with the following directories:

- `src/components/` - For React components
- `src/models/` - For data models and game logic
- `src/tests/` - For test files

## Development Approach

We're following Test-Driven Development (TDD) principles:

1. Write a failing test
2. Implement the minimum code to make the test pass
3. Refactor while keeping tests passing

## Commands Used

```
# Install Jest and related packages
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev jest-environment-jsdom

# Run tests
npm test

# Start development server
npm run dev
```

## Development Progress

### Phase 1: Project Setup and Initial Implementation

- [x] Examine project structure
- [x] Set up test configuration
- [x] Implement Player model
- [x] Implement Game model
- [x] Implement basic UI components
- [x] Add PWA features

### Current Implementation Details

#### Player Model

We've implemented a basic Player model with the following features:

- Player name
- Score tracking (add, subtract, reset)
- Initial score setting (useful for games like 501)

#### Game Model

We've implemented a Game model with the following features:

- Support for different game types (X01, Cricket, Around the Clock)
- Player management (adding players, tracking current player)
- Score recording with game rules
- Win condition detection
- Game state management (reset, game over)

#### UI Components

We've implemented the following UI components:

- PlayerList: Displays a list of players with their scores, highlighting the current player
- ScoreInput: Allows users to input scores manually or using quick score buttons
- GameSetup: Allows users to configure a new game (game type, starting score, players)
- GameBoard: Main component that integrates all other components and manages game state

#### PWA Features

We've added the following PWA features:

- Service worker for offline functionality
- Web app manifest for installation capability
- Icons for the app
- Responsive design using Tailwind CSS

### Issues Encountered and Resolved

#### Node.js/Vite Compatibility Issue

We encountered compatibility issues with Node.js v16.20.2 and Vite v6.2.0, which requires Node.js v18.0.0 or higher:

```
TypeError: crypto$2.getRandomValues is not a function
```

To fix this issue, we:

1. Installed nvm (Node Version Manager) using Homebrew
2. Set up nvm by creating the necessary directory and adding configuration to the shell profile
3. Installed Node.js 18.20.3 using nvm
4. Verified that all tests pass with the new Node.js version

#### PostCSS Configuration Issue

We encountered an issue with the PostCSS configuration using ES modules syntax:

```
Pre-transform error: Failed to load PostCSS config (searchPath: /Users/jeremylaw/projects/stillgitingbaby/darts-scorer): [SyntaxError] Unexpected token 'export'
```

To fix this issue, we:

1. Updated the PostCSS configuration file to use CommonJS syntax instead of ES modules
2. Changed `export default {` to `module.exports = {`

#### Tailwind CSS PostCSS Plugin Issue

We encountered an issue with the Tailwind CSS PostCSS plugin:

```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

To fix this issue, we:

1. Installed the `@tailwindcss/postcss` package: `npm install --save-dev @tailwindcss/postcss`
2. Updated the PostCSS configuration to use the new package:
   ```js
   module.exports = {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   };
   ```

### Current Status

- All tests are passing
- The development server is running successfully on port 3001 (port 3000 was already in use by other processes)
- The app can be accessed at http://localhost:3001 in a web browser

### Next Steps

#### Immediate Next Steps

- [ ] Test the application in a browser
- [ ] Verify PWA functionality
- [ ] Address any remaining issues

#### Phase 2: Enhancements

- [ ] Add Cricket game implementation
- [ ] Add Around the Clock game implementation
- [ ] Implement player statistics
- [ ] Add game history
- [ ] Enhance UI with animations and transitions
- [ ] Add sound effects

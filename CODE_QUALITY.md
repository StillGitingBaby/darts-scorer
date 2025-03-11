# Code Quality Tools

This document outlines the code quality tools available in this project.

## ESLint with Enhanced Plugins

ESLint is configured with additional plugins for React, accessibility, performance, and code quality.

### Key Plugins:

- **react-perf**: Identifies React performance issues like inline function creation
- **jsx-a11y**: Ensures accessibility best practices
- **sonarjs**: Detects code smells, duplications, and complexity issues
- **typescript-eslint**: Enforces TypeScript best practices and type safety

```bash
# Run ESLint to check for issues
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

### Common Issues:

1. **React Performance Issues** (`react-perf/jsx-no-new-function-as-prop`):

   - Problem: Creating functions inline in JSX props causes unnecessary re-renders
   - Solution: Use `useCallback` to memoize functions

2. **TypeScript Return Types** (`@typescript-eslint/explicit-function-return-type`):

   - Problem: Missing return type annotations on functions
   - Solution: Add explicit return types to functions

3. **Duplicate Strings** (`sonarjs/no-duplicate-string`):
   - Problem: Repeated string literals
   - Solution: Extract into constants

## Bundle Analyzer

Visualize the size and composition of your bundle to identify optimization opportunities.

```bash
# Build and analyze bundle
npm run analyze:bundle
```

This will generate a visualization at `dist/stats.html` that shows:

- The size of each module in your bundle
- Dependencies that might be unnecessarily large
- Opportunities for code splitting and tree shaking

## Recommended VS Code Extensions

For real-time code quality feedback:

- ESLint
- Error Lens
- Import Cost
- Prettier

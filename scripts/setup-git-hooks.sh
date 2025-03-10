#!/bin/bash

# Create scripts directory if it doesn't exist
mkdir -p "$(dirname "$0")"

# Create hooks directory if it doesn't exist
HOOKS_DIR=".git/hooks"
mkdir -p "$HOOKS_DIR"

# Create pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Get current branch
BRANCH=$(git symbolic-ref --short HEAD)

# Block commits directly to main branch
if [ "$BRANCH" = "main" ]; then
  echo "ERROR: Direct commits to the main branch are not allowed."
  echo "Please create a feature branch and submit a pull request instead."
  exit 1
fi

exit 0
EOF

# Create pre-push hook
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

# This hook prevents pushing directly to the main branch

# Parse the arguments passed to the pre-push hook
# The pre-push hook receives the following arguments:
# $1 - Name of the remote to which the push is being done
# $2 - URL to which the push is being done

remote="$1"
url="$2"

# Get the current branch name
BRANCH=$(git symbolic-ref --short HEAD)

# Block pushes directly to main branch
if [ "$BRANCH" = "main" ]; then
  echo "ERROR: Direct pushes to the main branch are not allowed."
  echo "Please create a feature branch and submit a pull request instead."
  exit 1
fi

# If pushing to a different branch, allow the push
exit 0
EOF

# Make the hooks executable
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-push"

echo "Git hooks installed successfully!"
echo "Direct commits and pushes to the main branch are now blocked."
echo "Use feature branches and pull requests instead." 
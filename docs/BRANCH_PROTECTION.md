# Branch Protection Setup

This document explains how to set up branch protection for the `main` branch to prevent direct commits and pushes.

## GitHub Branch Protection Rules

To set up branch protection on GitHub:

1. Go to the repository on GitHub
2. Click on "Settings"
3. In the left sidebar, click on "Branches"
4. Under "Branch protection rules", click "Add rule"
5. In the "Branch name pattern" field, enter `main`
6. Configure the following settings:

### Required Settings

- ✅ "Require a pull request before merging"
  - ✅ "Require approvals" (set to at least 1)
  - ✅ "Dismiss stale pull request approvals when new commits are pushed"

- ✅ "Require status checks to pass before merging"
  - ✅ "Require branches to be up to date before merging"
  - Add the following status checks:
    - `test-and-lint` (from the main.yml workflow)
    - `check-direct-push` (from the branch-protection.yml workflow)

- ✅ "Do not allow bypassing the above settings"

- ❌ "Allow force pushes"
- ❌ "Allow deletions"

7. Click "Create" or "Save changes"

## Local Git Hooks

To prevent accidental commits or pushes to the `main` branch from your local machine, you can set up Git hooks:

```bash
# Option 1: Run the setup script directly
./scripts/setup-git-hooks.sh

# Option 2: Use the npm script
npm run setup:hooks
```

This will install pre-commit and pre-push hooks that block direct commits and pushes to the `main` branch.

## How It Works

The protection works at two levels:

1. **Local protection**: Git hooks prevent developers from accidentally committing or pushing directly to `main`
2. **Server protection**: GitHub branch protection rules enforce that all changes to `main` must come through pull requests

## Troubleshooting

### Bypassing Hooks (Emergency Only)

In case you need to bypass the hooks for a legitimate reason (which should be rare), you can use:

```bash
git commit --no-verify
git push --no-verify
```

**Note**: This will bypass the local hooks, but GitHub's branch protection will still block direct pushes to `main`.

### Hook Not Working

If the hooks aren't working:

1. Check if they're executable: `ls -la .git/hooks/`
2. Make them executable if needed: `chmod +x .git/hooks/pre-commit .git/hooks/pre-push`
3. Run the setup script again: `npm run setup:hooks` 
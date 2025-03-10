# Branch Protection Settings

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
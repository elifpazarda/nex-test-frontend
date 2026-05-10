---
name: commit
description: Commits staged/unstaged changes using Conventional Commits v1.0.0 format.
argument-hint: "commit message (optional)"
disable-model-invocation: true
---

# Git Commit Skill

Analyze current changes and commit following the Conventional Commits v1.0.0 specification.

## CRITICAL RULE

**DO NOT trust your memory of what was changed.** You MUST run `git status` and `git diff` and base ALL decisions (type, scope, message, which files to stage) ONLY on the actual command output. Never assume or guess what the changes contain.

## Conventional Commits v1.0.0

### Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, semicolons (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or external dependencies |
| `ci` | CI configuration |
| `chore` | Other (no src/test modification) |
| `revert` | Reverts a previous commit |

### Breaking Changes

Indicate with `!` before colon OR `BREAKING CHANGE:` footer:
```
feat!: remove deprecated endpoint
```
```
feat: new auth flow

BREAKING CHANGE: token format changed from JWT to opaque
```

### Examples

```
feat(auth): add OAuth2 login flow

- Add Google OAuth provider configuration
- Create callback handler for token exchange
- Store refresh tokens in secure cookie
```

```
fix(api): handle null response from payment gateway

- Add null check before accessing response.data
- Return proper error message to client
```

```
refactor: extract validation logic into shared utils

- Move email validation to lib/validators
- Move phone validation to lib/validators
- Update imports in affected components
```

## Steps

1. **Gather actual state** — Run these in parallel:
   - `git status` — see all changed/untracked files
   - `git diff` — see unstaged changes
   - `git diff --cached` — see already staged changes
   - `git log --oneline -5` — check recent commit style

2. **Analyze based on output** (NOT your memory):
   - Determine type from the actual diff content
   - Identify scope from changed file paths
   - Never stage `.env`, `*.pem`, `*.key`, `credentials*` — warn user if present

3. **Create commit message**:
   - If user provided an argument, use it as the description: `$ARGUMENTS`
   - Otherwise, generate based on the diff output
   - Language: always English
   - Title: short, imperative mood, focus on "why" not "what"
   - Body: mandatory — bullet points listing what changed and why

4. **Commit**:
   - Stage files with `git add <specific-files>` (NEVER `git add .` or `git add -A`)
   - Commit with HEREDOC:
     ```bash
     git commit -m "$(cat <<'EOF'
     <type>[scope]: <description>

     - <change 1>
     - <change 2>
     EOF
     )"
     ```
   - Verify with `git status`

5. **On pre-commit hook failure**:
   - Fix the issue
   - Re-stage and create a NEW commit (never amend)

## Rules

- **Never add Co-Authored-By** — no AI attribution in commits
- Never use `git add -A` or `git add .`
- Never force push or delete branches
- Never commit secret files (`.env`, keys, credentials)
- Do not create empty commits — report if nothing to commit
- If changes span multiple types, prefer splitting into separate commits
- Do not amend existing commits unless user explicitly asks

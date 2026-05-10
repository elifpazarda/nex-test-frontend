#!/bin/bash
# PreToolUse hook: Block dangerous git commands

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block git force push
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f|--force)'; then
  echo "BLOCKED: git push --force is not allowed."
  exit 1
fi

# Block git branch delete (-d or -D)
if echo "$COMMAND" | grep -qE 'git\s+branch\s+.*-[dD]'; then
  echo "BLOCKED: git branch deletion is not allowed."
  exit 1
fi

# Block git reset --hard
if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
  echo "BLOCKED: git reset --hard is not allowed."
  exit 1
fi

# Block git clean -f
if echo "$COMMAND" | grep -qE 'git\s+clean\s+.*-f'; then
  echo "BLOCKED: git clean -f is not allowed."
  exit 1
fi

# Block git checkout . (discard all changes)
if echo "$COMMAND" | grep -qE 'git\s+checkout\s+\.'; then
  echo "BLOCKED: git checkout . (discard all changes) is not allowed."
  exit 1
fi

# Block git rebase
if echo "$COMMAND" | grep -qE 'git\s+rebase'; then
  echo "BLOCKED: git rebase is not allowed."
  exit 1
fi

exit 0

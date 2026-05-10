#!/bin/bash
# PreToolUse hook: Block dangerous bash commands

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block rm commands (any form of deletion)
if echo "$COMMAND" | grep -qE '\brm\b'; then
  echo "BLOCKED: rm command is not allowed. File deletion must be done manually."
  exit 1
fi

# Block kill / killall
if echo "$COMMAND" | grep -qE '\b(kill|killall)\b'; then
  echo "BLOCKED: kill/killall is not allowed."
  exit 1
fi

# Block chmod 777
if echo "$COMMAND" | grep -qE 'chmod\s+777'; then
  echo "BLOCKED: chmod 777 is not allowed (too permissive)."
  exit 1
fi

exit 0

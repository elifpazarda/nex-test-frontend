#!/bin/bash
# PostToolUse hook: Run eslint --fix and prettier after file edits

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format supported file extensions
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
  npx eslint --fix "$FILE_PATH" 2>/dev/null
  npx prettier --write "$FILE_PATH" 2>/dev/null
elif [[ "$FILE_PATH" =~ \.(css|json)$ ]]; then
  npx prettier --write "$FILE_PATH" 2>/dev/null
fi

exit 0

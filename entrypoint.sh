#!/bin/sh
echo "PORT: $PORT"

test -n "$PORT"

find /app/apps/web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PORT#$PORT#g"

echo "Starting Nextjs"
exec "$@"

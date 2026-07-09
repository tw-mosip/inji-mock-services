#!/usr/bin/env bash
# Stops the OVP verifier backend, mock issuer, and OVP verifier UI processes
# started by scripts/start-remote.sh.
#
# Usage: scripts/stop-remote.sh

set -e

for pattern in "node app.js" "node src/server.js" "react-scripts/scripts/start.js"; do
    pids=$(pgrep -f "$pattern" || true)
    if [ -n "$pids" ]; then
        echo "Stopping '$pattern' (pid(s): $pids)"
        kill $pids 2>/dev/null || true
    else
        echo "'$pattern' not running."
    fi
done

echo "Done."

#!/usr/bin/env bash
# Starts the OVP verifier backend, mock issuer, and OVP verifier UI as background
# processes. Intended for environments where a reverse proxy already terminates
# TLS/HTTPS in front of these services (e.g. GitHub Codespaces port forwarding),
# so the issuer runs in plain HTTP mode (USE_HTTPS=false) instead of using its
# local self-signed certificate.
#
# Re-run this after the environment (e.g. a Codespace) resumes from a stop, since
# these background processes do not persist across a stop/start cycle.
#
# Usage: scripts/start-remote.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="/tmp/ims-logs"
mkdir -p "$LOG_DIR"

start_if_not_running() {
    local label="$1"
    local pattern="$2"
    local dir="$3"
    local log_file="$4"
    shift 4

    if pgrep -f "$pattern" > /dev/null 2>&1; then
        echo "$label already running, skipping."
        return
    fi

    echo "Starting $label..."
    (cd "$dir" && nohup "$@" > "$log_file" 2>&1 &)
}

start_if_not_running "OVP verifier backend (port 3000)" "node app.js" \
    "$REPO_ROOT/openid4vp-service" "$LOG_DIR/ovp-backend.log" \
    node app.js

start_if_not_running "Issuer service (port 4000, HTTP)" "node src/server.js" \
    "$REPO_ROOT/mock-issuer-service" "$LOG_DIR/issuer.log" \
    env USE_HTTPS=false node src/server.js

start_if_not_running "OVP verifier UI (port 3001)" "react-scripts/scripts/start.js" \
    "$REPO_ROOT/openid4vp-service/ovp-client" "$LOG_DIR/ovp-ui.log" \
    npm start

sleep 3
echo ""
echo "Done. Logs: $LOG_DIR/{ovp-backend,issuer,ovp-ui}.log"
echo "Check status:  ps aux | grep -E 'node app.js|node src/server.js|react-scripts'"
echo "Check ports:   gh codespace ports"

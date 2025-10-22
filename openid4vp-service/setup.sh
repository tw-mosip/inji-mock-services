#!/bin/bash

# Extract current baseUrl from constants.js
currentBaseUrl=$(grep -E '^const baseUrl = "' constants.js | sed -E 's/^const baseUrl = "(.*)"/\1/')

# Detect OS for sed compatibility
if [[ "$(uname)" == "Darwin" ]]; then
  SED_CMD="sed -i ''"
else
  SED_CMD="sed -i"
fi

echo "If you are running the backend locally, use http://localhost:3000 else provide the URL of your backend server."
echo "If you are running the backend locally and want to access / test it from another device, expose the backend port 3000 & the frontend port 3001 to the remote network via localtunnel or ngrok."
echo "Note: If you are accessing / testing from another device for Same device flow, make sure to expose the frontend port 3000 as well."

# Ask user for backend URL, showing current value
read -p "🌐 Please enter your base URL (press Enter to keep current value '$currentBaseUrl'): " backend_url

# Validate and update config
if [ ! -z "$backend_url" ]; then
    echo -e "\033[1;32m🔄 Updating configuration files...\033[0m"
    # Update constants.js
    if [ -w "constants.js" ]; then
      $SED_CMD "s|^const baseUrl = \".*\"|const baseUrl = \"$backend_url\"|" "constants.js" && \
      echo -e "\033[1;32m✅ 1/2 configuration updated!\033[0m" || echo -e "\033[1;31m❌ Failed to update constants.js!\033[0m"
    else
      echo -e "\033[1;31m❌ 1/2 configuration not found or not writable!\033[0m"
    fi
    # Update mockui-constants.js
    if [ -w "ovp-client/src/constants/mockui-constants.js" ]; then
      $SED_CMD "s|^export const BACKEND_URL = \".*\"|export const BACKEND_URL = \"$backend_url\"|" "ovp-client/src/constants/mockui-constants.js" && \
      echo -e "\033[1;32m✅ 2/2 configuration updated!\033[0m" || echo -e "\033[1;31m❌ Failed to update mockui-constants.js!\033[0m"
    else
      echo -e "\033[1;31m❌2/2 configuration not found or not writable!\033[0m"
    fi
fi

# Start frontend app in background, log output
echo -e "\033[1;34m🚀 Starting frontend\033[0m"
cd ovp-client
npm start > frontend.log 2>&1 &
frontend_pid=$!
sleep 2
if ! ps -p $frontend_pid > /dev/null; then
  echo -e "\033[1;31m❌ Frontend failed to start. Check ovp-client/frontend.log for details.\033[0m"
  exit 1
fi
cd ..
echo -e "\033[1;34m Frontend running with PID $frontend_pid. Logs: ovp-client/frontend.log\033[0m"

# Trap Ctrl+C and cleanup
cleanup() {
  echo -e "\n\033[1;33m🛑 Stopping Backend\033[0m"
  echo -e "\n\033[1;33m🛑 Stopping frontend (PID $frontend_pid)...\033[0m"
  kill $frontend_pid 2>/dev/null
  echo -e "\033[1;32m✅ Cleanup complete.\033[0m"
  exit 0
}
trap cleanup SIGINT

echo -e "\033[1;34m🚀 Starting backend\033[0m"
# Start backend app in foreground, show output live
npm start

#!/bin/bash
# Rebuild and redeploy the backtest UI via PM2
set -e
cd "$(dirname "$0")"
echo "Building..."
npm run build
echo "Restarting PM2..."
pm2 serve /home/noufal/projects/ava-backtest-ui/dist 8203 --name ava-backtest-ui --spa --force
pm2 save
echo "✓ Live at http://100.90.137.65:8203"

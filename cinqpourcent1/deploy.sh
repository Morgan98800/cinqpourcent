#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Install gh-pages
echo "Installing gh-pages..."
npm install gh-pages --save-dev

# Build the app for production
echo "Building the React app..."
npm run build

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npm run deploy

echo "Deployment successful! The game should be available at the URL specified in package.json."

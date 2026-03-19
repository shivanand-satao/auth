#!/bin/bash

# FireAuth Deployment Script for GitHub Pages

echo "🚀 Starting deployment to GitHub Pages..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized!"
    echo "Run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote | grep -q origin; then
    echo "❌ Git remote 'origin' not set!"
    echo "Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO/"
    echo ""
    echo "⚠️  Remember to:"
    echo "   1. Update vite.config.js base to match your repo name"
    echo "   2. Add your GitHub Pages domain to Firebase authorized domains"
else
    echo "❌ Deployment failed!"
    exit 1
fi

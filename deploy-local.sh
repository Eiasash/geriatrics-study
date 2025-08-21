#!/bin/bash
# Local deployment script to gh-pages branch

echo "🚀 Starting local deployment to gh-pages..."

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Build H5P packages
echo "📦 Building H5P packages..."
cd h5p
npm run build
npm run build:qset
npm run build:mega
cd ..

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "📁 Using temp directory: $TEMP_DIR"

# Copy files to temp
cp -r h5p/dist $TEMP_DIR/
cp h5p/index.html $TEMP_DIR/
cp h5p/timer-embed.html $TEMP_DIR/
cp -r h5p/README.md $TEMP_DIR/

# Switch to gh-pages branch
echo "🔄 Switching to gh-pages branch..."
git checkout gh-pages 2>/dev/null || git checkout --orphan gh-pages

# Clear everything
git rm -rf . 2>/dev/null || true

# Copy from temp
cp -r $TEMP_DIR/* .

# Add and commit
git add .
git commit -m "Deploy H5P content from $CURRENT_BRANCH"

# Push to gh-pages
echo "📤 Pushing to gh-pages..."
git push origin gh-pages --force

# Switch back
git checkout $CURRENT_BRANCH

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://eiasash.github.io/geriatrics-study/"
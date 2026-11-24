#!/bin/bash

# Build script for Fyntix WordPress theme and blocks

echo "Building Fyntix WordPress packages..."

# Create release directory if it doesn't exist
mkdir -p release

# Build theme ZIP
echo "Building fyntix-theme.zip..."
cd fyntix-theme
zip -r ../release/fyntix-theme.zip . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Build blocks plugin ZIP
echo "Building fyntix-blocks.zip..."
cd fyntix-blocks
zip -r ../release/fyntix-blocks.zip . -x "*.DS_Store" -x "__MACOSX/*" -x "node_modules/*"
cd ..

echo "✓ Build complete! ZIP files are in the release/ folder"
echo ""
echo "Files created:"
ls -lh release/*.zip


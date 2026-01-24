#!/bin/bash

# Image optimization script for production deployment
# Converts PNG/JPG to WebP and optimizes sizes

echo "🖼️  Optimizing images for production..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    # On macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually"
        exit 1
    fi
fi

# Create optimized directory
mkdir -p public/images/optimized

# Convert all PNG images to WebP
echo "📸 Converting PNG to WebP..."
find public/upload -name "*.png" -type f | while read -r file; do
    filename=$(basename "$file" .png)
    dirname=$(dirname "$file")
    output_dir="public/images/optimized/$(basename "$dirname")"
    mkdir -p "$output_dir"

    echo "Converting $file..."
    convert "$file" \
        -quality 80 \
        -define webp:lossless=false \
        -define webp:method=6 \
        "$output_dir/$filename.webp"
done

# Convert all JPG images to WebP
echo "📸 Converting JPG to WebP..."
find public/upload -name "*.jpg" -o -name "*.jpeg" | while read -r file; do
    filename=$(basename "$file" | sed 's/\.jpg\|\.jpeg//')
    dirname=$(dirname "$file")
    output_dir="public/images/optimized/$(basename "$dirname")"
    mkdir -p "$output_dir"

    echo "Converting $file..."
    convert "$file" \
        -quality 80 \
        -define webp:lossless=false \
        -define webp:method=6 \
        "$output_dir/$filename.webp"
done

echo "✅ Image optimization complete!"
echo "📁 Optimized images are in: public/images/optimized/"
echo "💡 Update your image paths in components to use the optimized versions"
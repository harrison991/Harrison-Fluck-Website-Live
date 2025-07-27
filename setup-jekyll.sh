#!/bin/bash

# Jekyll Blog Setup and Testing Script
# This script helps you serve your Jekyll blog locally for testing

echo "🚀 Harrison's Jekyll Blog Setup"
echo "================================"

# Check if Jekyll is installed
if ! command -v jekyll &> /dev/null; then
    echo "❌ Jekyll is not installed. Installing Jekyll..."
    
    # Check if Ruby is installed
    if ! command -v ruby &> /dev/null; then
        echo "❌ Ruby is not installed. Please install Ruby first:"
        echo "   brew install ruby"
        exit 1
    fi
    
    # Install Jekyll
    gem install jekyll bundler
fi

echo "✅ Jekyll is installed"

# Check if Gemfile exists and install dependencies
if [ -f "Gemfile" ]; then
    echo "📦 Installing dependencies from Gemfile..."
    bundle install
else
    echo "⚠️  No Gemfile found. Creating a basic one..."
    cat > Gemfile << EOF
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-seo-tag"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end
EOF
    bundle install
fi

echo ""
echo "🎯 Your blog setup is complete!"
echo ""
echo "📝 To add a new blog post:"
echo "   1. Create a new .md file in _posts/ directory"
echo "   2. Use this naming format: YYYY-MM-DD-title.md"
echo "   3. Add front matter with title, date, category, tags, etc."
echo "   4. Write your content in Markdown"
echo ""
echo "🌐 To serve your blog locally:"
echo "   bundle exec jekyll serve"
echo "   Then visit: http://localhost:4000"
echo ""
echo "🚀 To build for production:"
echo "   bundle exec jekyll build"
echo ""
echo "📁 Jekyll will automatically:"
echo "   ✅ Generate HTML pages for each .md file in _posts/"
echo "   ✅ Use the layout specified in front matter (default: post)"
echo "   ✅ Create SEO-friendly URLs like /blog/post-title/"
echo "   ✅ Generate RSS feed, sitemap, and meta tags"
echo "   ✅ Process Liquid templating in your HTML files"
echo ""

# Ask if user wants to serve now
read -p "🤔 Would you like to serve the blog locally now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting Jekyll server..."
    bundle exec jekyll serve --livereload
fi

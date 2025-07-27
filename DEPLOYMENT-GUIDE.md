# 🚀 GitHub Pages Deployment Guide

## ✅ Your Jekyll Blog is Ready for GitHub Pages!

When you push this repository to GitHub, your blog will automatically work on GitHub Pages because:

### 🎯 **What's Set Up:**
- ✅ **Jekyll Configuration**: `_config.yml` configured for GitHub Pages
- ✅ **GitHub Actions**: Automatic build and deployment workflow
- ✅ **Compatible Dependencies**: Using `github-pages` gem for compatibility
- ✅ **Proper Layouts**: Jekyll will use your `_layouts/post.html` for blog posts
- ✅ **Automatic Generation**: Blog posts from `_posts/*.md` files will be generated automatically

### 🌐 **How It Works on GitHub Pages:**

1. **Push to GitHub**: When you `git push` to the `main` branch
2. **GitHub Actions**: Automatically builds your Jekyll site
3. **Live Site**: Your blog appears at `https://harrisonfluck.me/`

### 📝 **Your Blog URLs Will Be:**
- **Blog Index**: `https://harrisonfluck.me/blog.html`
- **Individual Posts**: `https://harrisonfluck.me/blog/vision-valley-adventure/`
- **Wallpapers**: `https://harrisonfluck.me/wallpapers.html`

### 🔧 **To Deploy:**

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Jekyll blog system with automatic post generation"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Enable GitHub Pages** (if not already enabled):
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: "GitHub Actions"
   - Your site will be live in a few minutes!

### 📱 **Adding New Blog Posts** (Live Site):

1. **Create new markdown file**: `_posts/2025-01-27-my-new-post.md`
2. **Add front matter**:
   ```yaml
   ---
   layout: post
   title: "My New Post"
   date: 2025-01-27
   category: adventure
   tags: [adventure, fun]
   featured_image: /images/my-image.jpg
   excerpt: "Short description of the post"
   ---
   ```
3. **Write content in Markdown**
4. **Commit and push**:
   ```bash
   git add _posts/2025-01-27-my-new-post.md
   git commit -m "Add new blog post: My New Post"
   git push origin main
   ```
5. **Live in minutes**: GitHub Pages automatically rebuilds and deploys!

### 🎨 **Features That Work on GitHub Pages:**
- ✅ **Automatic post generation** from markdown files
- ✅ **SEO optimization** with meta tags and sitemaps
- ✅ **RSS feed** at `/feed.xml`
- ✅ **Category filtering** on blog index
- ✅ **Responsive design** on all devices
- ✅ **Fast loading** with optimized assets
- ✅ **Search engine friendly** URLs

### 🐛 **If Something Doesn't Work:**
1. Check the "Actions" tab in your GitHub repository for build errors
2. Ensure your `_posts/*.md` files have proper front matter
3. Make sure image paths start with `/` for absolute URLs
4. GitHub Pages may take 5-10 minutes to reflect changes

### 🌟 **Pro Tips:**
- **Images**: Put images in `/images/` directory and reference as `/images/photo.jpg`
- **Drafts**: Create files in `_drafts/` folder (won't be published)
- **Local Testing**: Run `bundle exec jekyll serve` before pushing
- **Build Status**: Check GitHub Actions for deployment status

Your blog is now a professional Jekyll-powered site that updates automatically! 🎉

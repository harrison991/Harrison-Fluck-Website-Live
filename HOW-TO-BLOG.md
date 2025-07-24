# How to Create New Blog Posts

## Quick Start Guide

Creating new blog posts is now super easy! Just create a new Markdown file in the `_posts` folder and Jekyll will automatically convert it to a beautiful blog post.

## File Naming Convention

All blog posts must be named with this format:
```
YYYY-MM-DD-title-with-hyphens.md
```

Examples:
- `2024-12-25-christmas-adventure.md`
- `2024-11-15-stage-crew-behind-scenes.md`
- `2024-10-20-basketball-season-reflections.md`

## Blog Post Template

Copy this template to create a new post:

```markdown
---
layout: post
title: "Your Post Title Here"
subtitle: "Optional subtitle for more context"
date: 2024-12-25
category: adventure
tags: [tag1, tag2, tag3]
author: Harrison Fluck
excerpt: "A brief summary of your post that appears in the blog listing."
---

## Your First Heading

Write your content here using Markdown formatting.

### Subheadings

You can create subheadings like this.

**Bold text** and *italic text* are easy to format.

- Bullet points
- Are simple
- To create

1. Numbered lists
2. Work too
3. Very straightforward

> Quotes look great for highlighting important thoughts or memorable moments.

## Adding Images

To add images, place them in an `images` folder and reference them like this:
```markdown
![Alt text](/images/your-image.jpg)
```

## Code Blocks

You can include code blocks like this:

```javascript
function example() {
    console.log("This is a code block!");
}
```

## Links

[Create links like this](https://example.com)

---

*Add a footer note or call to action at the end of your post.*
```

## Available Categories

Use one of these categories in your front matter:

- `adventure` - Outdoor expeditions, hiking, wilderness experiences
- `activities` - Stage crew, school activities, creative projects  
- `sports` - Rowing, basketball, athletic experiences
- `school` - Academic experiences, school projects, student life
- `tech` - Technical projects, coding, digital creativity
- `personal` - Personal reflections, life lessons, growth

## How to Publish

1. Create your new `.md` file in the `_posts` folder
2. Write your content using the template above
3. Commit and push to GitHub
4. GitHub Pages will automatically build and publish your post!

## Testing Locally (Optional)

If you want to preview your posts before publishing:

1. Install Ruby and Jekyll on your computer
2. Run `bundle install` in your website folder
3. Run `bundle exec jekyll serve`
4. Open `http://localhost:4000` in your browser

## Tips for Great Posts

- **Start with an engaging introduction** - Hook your readers from the first paragraph
- **Use descriptive headings** - Help readers scan and navigate your content
- **Include personal insights** - Share what you learned or how you felt
- **Add details** - Specific stories and examples make posts more interesting
- **End with a question or call to action** - Encourage reader engagement

## Examples

Check out the existing posts in the `_posts` folder to see how they're structured:
- `2024-08-15-vision-valley-adventure.md`
- `2024-09-20-stage-crew-life.md`
- `2024-11-10-rowing-season-reflections.md`

Happy blogging! 🎉

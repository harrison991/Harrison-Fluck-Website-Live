// Automatic blog post HTML generator for Jekyll
// This script generates individual blog post HTML files from markdown files

class BlogPostGenerator {
    constructor() {
        this.postsDirectory = '_posts';
        this.outputDirectory = '.';
        this.posts = [];
    }

    async init() {
        console.log('🚀 Starting automatic blog post generation...');
        await this.loadMarkdownPosts();
        this.generateBlogIndexUpdate();
        console.log('✅ Blog post generation complete!');
    }

    async loadMarkdownPosts() {
        // For now, we'll use the known post files
        // In a real Jekyll setup, this would be handled automatically
        const postFiles = [
            '2024-08-15-vision-valley-adventure.md',
            '2024-09-20-stage-crew-life.md',
            '2024-11-10-rowing-season-reflections.md'
        ];

        for (const filename of postFiles) {
            try {
                const response = await fetch(`${this.postsDirectory}/${filename}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = this.parseMarkdownPost(content, filename);
                    if (post) {
                        this.posts.push(post);
                        this.generatePostHTML(post);
                    }
                }
            } catch (error) {
                console.error(`Error loading post ${filename}:`, error);
            }
        }

        // Sort posts by date (newest first)
        this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    parseMarkdownPost(content, filename) {
        try {
            // Split front matter and content
            const parts = content.split('---');
            if (parts.length < 3) {
                console.warn(`Invalid front matter in ${filename}`);
                return null;
            }

            const frontMatter = parts[1];
            const post = {
                filename: filename,
                slug: filename.replace('.md', ''),
                frontMatter: frontMatter.trim()
            };

            // Parse front matter
            frontMatter.split('\n').forEach(line => {
                line = line.trim();
                if (line && line.includes(':')) {
                    const [key, ...valueParts] = line.split(':');
                    const value = valueParts.join(':').trim();
                    const cleanValue = value.replace(/^["']|["']$/g, '');
                    
                    if (key.trim() === 'tags' && cleanValue.startsWith('[')) {
                        post[key.trim()] = cleanValue
                            .replace(/[\[\]]/g, '')
                            .split(',')
                            .map(tag => tag.trim());
                    } else {
                        post[key.trim()] = cleanValue;
                    }
                }
            });

            return post;
        } catch (error) {
            console.error(`Error parsing post ${filename}:`, error);
            return null;
        }
    }

    generatePostHTML(post) {
        // Since Jekyll handles this automatically, we don't need to generate individual HTML files
        // Jekyll will automatically generate pages for markdown files in _posts with proper front matter
        console.log(`📝 Post ready for Jekyll: ${post.title}`);
    }

    generateBlogIndexUpdate() {
        // Update blog.html to use Jekyll liquid syntax
        const blogHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Harrison Fluck</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">Harrison Fluck</a>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="activities.html" class="nav-link">Activities</a>
                <a href="tours.html" class="nav-link">Tours</a>
                <a href="blog.html" class="nav-link active">Blog</a>
                <a href="wallpapers.html" class="nav-link">Wallpapers</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <main>
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-container">
                <h1 class="hero-title">My Blog</h1>
                <p class="hero-description">Adventures, experiences, and insights from my journey</p>
            </div>
        </section>

        <!-- Blog Posts Section -->
        <section class="blog-posts-section">
            <div class="container">
                <div class="section-header">
                    <h2>Latest Posts</h2>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All Posts</button>
                        <button class="filter-btn" data-filter="adventure">Adventure</button>
                        <button class="filter-btn" data-filter="sports">Sports</button>
                        <button class="filter-btn" data-filter="personal">Personal</button>
                        <button class="filter-btn" data-filter="technology">Technology</button>
                    </div>
                </div>
                
                <div class="blog-posts-grid" id="blog-posts-grid">
                    {% for post in site.posts %}
                    <article class="blog-post" data-category="{{ post.category }}">
                        <div class="post-image">
                            {% if post.featured_image %}
                                <img src="{{ post.featured_image | relative_url }}" alt="{{ post.title }}" onerror="this.src='https://via.placeholder.com/400x250/4a90e2/ffffff?text={{ post.title | url_encode }}'">
                            {% else %}
                                <img src="https://via.placeholder.com/400x250/4a90e2/ffffff?text={{ post.title | url_encode }}" alt="{{ post.title }}">
                            {% endif %}
                        </div>
                        <div class="post-content">
                            <div class="post-meta">
                                <span class="post-category {{ post.category }}">{{ post.category | capitalize }}</span>
                                <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
                                <span class="read-time">
                                    <i class="fas fa-clock"></i>
                                    {% assign words = post.content | number_of_words %}
                                    {% assign read_time = words | divided_by: 200 | at_least: 1 %}
                                    {{ read_time }} min read
                                </span>
                            </div>
                            <h3 class="post-title">
                                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                            </h3>
                            <p class="post-excerpt">
                                {% if post.excerpt %}
                                    {{ post.excerpt | strip_html | truncate: 200 }}
                                {% else %}
                                    {{ post.content | strip_html | truncate: 200 }}
                                {% endif %}
                            </p>
                            {% if post.tags %}
                            <div class="post-tags">
                                {% for tag in post.tags %}
                                <span class="tag">{{ tag }}</span>
                                {% endfor %}
                            </div>
                            {% endif %}
                            <a href="{{ post.url | relative_url }}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                    {% endfor %}
                </div>

                <!-- Empty State -->
                <div class="no-posts" id="no-posts" style="display: none;">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No posts found</h3>
                        <p>Try selecting a different category or check back later for new content.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter Signup -->
        <section class="newsletter-section">
            <div class="container">
                <div class="newsletter-card">
                    <div class="newsletter-content">
                        <h3>Stay Updated</h3>
                        <p>Get notified when I publish new blog posts about my adventures and experiences.</p>
                    </div>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Harrison Fluck</h3>
                    <p>15-year-old student passionate about adventures, technology, and creativity.</p>
                    <div class="social-links">
                        <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Email"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="activities.html">Activities</a></li>
                        <li><a href="tours.html">Tours</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="wallpapers.html">Wallpapers</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Latest Posts</h4>
                    <ul>
                        {% for post in site.posts limit:3 %}
                        <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; {{ 'now' | date: '%Y' }} Harrison Fluck. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
    <script src="blog.js"></script>
    <script src="jekyll-blog.js"></script>
</body>
</html>`;

        console.log('📄 Generated Jekyll-powered blog index');
        return blogHTML;
    }
}

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Jekyll Blog System Ready');
});

// Export for manual usage
window.BlogPostGenerator = BlogPostGenerator;

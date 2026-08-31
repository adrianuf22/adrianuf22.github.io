import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_OUTPUT_FILE = path.join(process.cwd(), 'public', 'posts.json');
const ROOT_OUTPUT_FILE = path.join(process.cwd(), 'posts.json');
const PUBLIC_POSTS_DIR = path.join(process.cwd(), 'public', 'posts');

// Ensure output directories exist
if (!fs.existsSync(path.dirname(PUBLIC_OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(PUBLIC_OUTPUT_FILE), { recursive: true });
}
if (!fs.existsSync(PUBLIC_POSTS_DIR)) {
  fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });
}

function generatePostHTML(post) {
  const currentYear = new Date().getFullYear();
  const tagsHTML = (post.tags || []).map(tag => `<span class="post-tag">#${tag}</span>`).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | adrianuf22 :: software engineer</title>

  <!-- SEO & Meta Tags -->
  <meta name="description" content="${post.summary}">
  <meta name="author" content="Adriano Caetano">
  <meta name="theme-color" content="#0b1320">

  <!-- Open Graph / Social Sharing -->
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.summary}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="/images/favicon.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/images/favicon.png">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body class="post-page-body">
  <div class="app-container">
    <!-- Header -->
    <header>
      <div class="topbar">
        <div class="left-content">
          <a href="/" class="heading-title" aria-label="adrianuf22.github.io Home">
            <h1>adrianu<span class="heading-blue">f22</span></h1>
            <span class="title-tag">Software Engineer</span>
          </a>
        </div>

        <div class="right-content">
          <a href="/" class="back-home-btn" aria-label="Back to home page">← Back to Home</a>
        </div>
      </div>
    </header>

    <!-- Main Article Body -->
    <main class="post-page-main">
      <article class="post-page-container">
        <div class="post-card-meta" style="margin-bottom: 16px;">
          <span class="post-date">📅 ${post.formattedDate || post.date}</span>
          <span class="post-reading-time">⏱️ ${post.readingTime || ''}</span>
        </div>

        <h1 class="post-page-title">${post.title}</h1>

        <div class="post-card-tags" style="margin-bottom: 24px;">
          ${tagsHTML}
        </div>

        <div class="post-article">
          ${post.html}
        </div>
      </article>
    </main>

    <!-- Footer -->
    <footer>
      <div class="copyright">
        &copy; ${currentYear} Adriano Caetano. All rights reserved.
      </div>
      <div class="dev-credits">
        <span>Hosted on <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a></span>
      </div>
    </footer>
  </div>
</body>
</html>
`;
}

function compilePosts() {
  console.log('Compiling markdown posts from /posts ...');

  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`Posts directory ${POSTS_DIR} does not exist. Creating empty directory...`);
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  const posts = [];

  files.forEach(filename => {
    const filePath = path.join(POSTS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(rawContent);

    const slug = filename.replace(/\.md$/, '');
    const htmlContent = marked.parse(content);

    // Calculate estimated reading time
    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const postObj = {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
      formattedDate: frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      summary: frontmatter.summary || '',
      tags: frontmatter.tags || [],
      readingTime: `${readingTimeMinutes} min read`,
      html: htmlContent
    };

    posts.push(postObj);

    // Generate static HTML post page
    const postHTML = generatePostHTML(postObj);
    const publicPostFile = path.join(PUBLIC_POSTS_DIR, `${slug}.html`);
    const rootPostFile = path.join(POSTS_DIR, `${slug}.html`);

    fs.writeFileSync(publicPostFile, postHTML, 'utf-8');
    fs.writeFileSync(rootPostFile, postHTML, 'utf-8');
  });

  // Sort posts by date descending (latest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write JSON output
  const jsonContent = JSON.stringify(posts, null, 2);
  fs.writeFileSync(PUBLIC_OUTPUT_FILE, jsonContent, 'utf-8');
  fs.writeFileSync(ROOT_OUTPUT_FILE, jsonContent, 'utf-8');

  console.log(`Successfully compiled ${posts.length} markdown post(s) to HTML & JSON -> public/posts/ & posts/`);
}

compilePosts();

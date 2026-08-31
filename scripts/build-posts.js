import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_OUTPUT_FILE = path.join(process.cwd(), 'public', 'posts.json');
const ROOT_OUTPUT_FILE = path.join(process.cwd(), 'posts.json');

// Ensure output directories exist
if (!fs.existsSync(path.dirname(PUBLIC_OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(PUBLIC_OUTPUT_FILE), { recursive: true });
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

    posts.push({
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
    });
  });

  // Sort posts by date descending (latest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write JSON output
  const jsonContent = JSON.stringify(posts, null, 2);
  fs.writeFileSync(PUBLIC_OUTPUT_FILE, jsonContent, 'utf-8');
  fs.writeFileSync(ROOT_OUTPUT_FILE, jsonContent, 'utf-8');

  console.log(`Successfully compiled ${posts.length} markdown post(s) -> public/posts.json`);
}

compilePosts();

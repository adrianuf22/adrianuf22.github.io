# Blog Post Creation Guide

This document explains how to create, format, preview, and publish blog posts for `adrianuf22.github.io`.

## 📝 How to Create a New Blog Post

All blog posts are authored in **Markdown** (`.md`) files inside the [`posts/`](./posts/) directory.

### 1. File Location & Naming (Slug)

Create a new file in the `posts/` folder following the `YYYY-MM-DD-slug-name.md` naming convention:

```text
posts/2026-09-01-my-first-post.md
```

- **Date Prefix**: Helps keep your posts chronologically organized in the folder.
- **Slug**: The filename (without `.md`) becomes the post slug and determines the standalone page URL:
  - **Local/Build URL**: `posts/2026-09-01-my-first-post.html`
  - **Live URL**: `https://adrianuf22.github.io/posts/2026-09-01-my-first-post.html`

---

### 2. Post Frontmatter Structure

Every `.md` post **must start with a YAML frontmatter block** enclosed between `---` dividers at the top of the file:

```yaml
---
title: "Getting Started with Modern Web Development"
date: 2026-09-01
summary: "An introduction to building fast, light, static web applications."
tags: [web-dev, javascript, vite]
---
```

#### Frontmatter Field Reference

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | **Yes** | Main headline displayed on the home page card, browser tab, and article header. |
| `date` | Date (`YYYY-MM-DD`) | **Yes** | Publication date. Posts on the home page are automatically sorted **latest to oldest** by date. |
| `summary` | String | **Yes** | A 1-2 sentence description shown on the home page post card and social Open Graph tags. |
| `tags` | Array of Strings | Optional | Topic tags (e.g. `[javascript, Vite, CSS]`). Rendered as `#tag` badges. |

---

### 3. Writing the Content (Markdown Syntax)

Below the frontmatter block, write your post using standard Markdown syntax.

#### Example Post Template

```markdown
---
title: "My Journey into Open Source"
date: 2026-09-01
summary: "Lessons learned while building open-source projects and contributing to web developer tooling."
tags: [open-source, career, engineering]
---

# My Journey into Open Source

Welcome! In this post, I want to share my experience contributing to open-source software.

## Key Takeaways

1. **Start Small**: Fixing documentation or small bugs is a great way to start.
2. **Read the Code**: Inspecting repository patterns teaches best practices.

### Code Example

Here is a simple JavaScript snippet showing how we log greeting messages:

```js
function greetUser(name) {
  console.log(`Hello, ${name}! Welcome to the blog.`);
}

greetUser('Developer');
```

> **Note**: Markdown formatting supports blockquotes, lists, bold/italic text, code blocks, tables, and links.
```

---

## 🛠️ Building & Previewing Locally

When you add or update a post, compile and preview it locally using `yarn` or `npm`:

### 1. Start Development Server (Auto-compiles posts)
```bash
yarn dev
# or
npm run dev
```
This automatically compiles your Markdown files to HTML/JSON and starts the Vite development server on `http://localhost:3000/`.

### 2. Compile Posts Only
```bash
yarn build:posts
# or
npm run build:posts
```
Generates updated `posts.json` and static HTML post pages in both `public/posts/` and `posts/`.

### 3. Production Build
```bash
yarn build
# or
npm run build
```
Compiles all posts and bundles the static site into `dist/` ready for production deployment.

---

## 🚀 Publishing to GitHub Pages

1. Compile the posts and verify build:
   ```bash
   yarn build
   ```
2. Commit your new markdown post, generated HTML, and `posts.json`:
   ```bash
   git add posts/ public/posts/ posts.json public/posts.json
   git commit -m "Add post: Getting Started with Modern Web Development"
   git push origin master
   ```
3. GitHub Pages will serve your new post live at `https://adrianuf22.github.io/posts/2026-09-01-my-first-post.html`!

---

## 📁 File Naming & Slug

All blog post source files are stored in the [`posts/`](./posts/) directory as `.md` files.

### Naming Format:
```text
posts/YYYY-MM-DD-your-post-slug.md
```

**Example**:
`posts/2026-09-01-welcome-to-my-blog.md`

- **Slug**: `2026-09-01-welcome-to-my-blog`
- **Generated Page URL**: `https://adrianuf22.github.io/posts/2026-09-01-welcome-to-my-blog.html`

---

## 📋 YAML Frontmatter Specification

Every post must begin with a YAML block enclosed between `---` dividers at the top of the file:

```yaml
---
title: "Your Article Title"
date: 2026-09-01
summary: "A brief summary of your post to display on home page cards and social shares."
tags: [tag1, tag2, tag3]
---
```

### Fields:

1. **`title`** *(string, required)*:
   The main headline of your article.
2. **`date`** *(YYYY-MM-DD, required)*:
   Publication date. Posts on the home page are sorted **latest to oldest** based on this field.
3. **`summary`** *(string, required)*:
   A short 1-2 sentence preview text for card listings and Open Graph social sharing tags.
4. **`tags`** *(array of strings, optional)*:
   Topic tags displayed as `#tag` badges (e.g., `[javascript, Vite, CSS]`).

---

## ✍️ Writing Markdown Content

Below the frontmatter block, write your post using standard GitHub Flavored Markdown:

```markdown
# Section Heading

Paragraph text with **bold**, *italic*, and [links](https://github.com/adrianuf22).

## Subheading

- List item 1
- List item 2

```js
// Code snippet with syntax highlighting
function hello() {
  console.log("Hello World");
}
```
```

---

## ⚙️ Compiling & Publishing

To process new posts and update static files:

1. **Compile Posts**:
   ```bash
   yarn build:posts
   ```
2. **Preview Locally**:
   ```bash
   yarn dev
   ```
3. **Publish to GitHub**:
   ```bash
   git add posts/ public/posts/ posts.json public/posts.json
   git commit -m "Add new post"
   git push origin master
   ```

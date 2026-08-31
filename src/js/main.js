/**
 * Modern Application Logic for adrianuf22.github.io
 * Character Avatar Switcher & Markdown Blog Engine
 */

const CHARACTERS = [
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'wolverine', name: 'Wolverine', icon: '⚡' },
  { id: 'dog', name: 'Dog', icon: '🐶' },
  { id: 'felix', name: 'Felix', icon: '🐱‍👤' }
];

class AvatarApp {
  constructor() {
    this.currentIndex = 0;
    this.container = document.getElementById('slide-body');
    this.badgeContainer = document.getElementById('character-badges');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.socialMenu = document.querySelector('.social-menu');
    this.postsHeading = document.getElementById('posts-heading');
    this.postsGrid = document.getElementById('posts-grid');
    this.postModal = document.getElementById('post-modal');
    this.postModalClose = document.getElementById('post-modal-close');
    this.postModalBackdrop = document.getElementById('post-modal-backdrop');
    this.postArticle = document.getElementById('post-article');

    // Touch / Gesture state
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isSwiping = false;

    // Blog posts
    this.posts = [];

    this.init();
  }

  init() {
    this.initScrollbarBehavior();
    this.renderBadges();
    this.updateAvatar(this.currentIndex, 'forward');
    this.bindEvents();
    this.loadPosts();
  }

  initScrollbarBehavior() {
    let isUnlocked = false;

    const lockScroll = () => {
      isUnlocked = false;
      document.body.classList.add('lock-scroll');
      document.documentElement.classList.add('lock-scroll');
    };

    const unlockScroll = () => {
      isUnlocked = true;
      document.body.classList.remove('lock-scroll');
      document.documentElement.classList.remove('lock-scroll');
    };

    const unlockScrollAndScrollToPosts = () => {
      unlockScroll();
      const postsSection = document.getElementById('posts-section');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Lock scroll initially on page load
    lockScroll();

    // Re-lock scrollbar when scrolling back to top
    window.addEventListener('scroll', () => {
      if (window.scrollY <= 0 && isUnlocked) {
        lockScroll();
      }
    }, { passive: true });

    // Unlock on wheel scroll down, or re-lock on scroll up at top
    window.addEventListener('wheel', (e) => {
      if (e.deltaY > 0 && !isUnlocked) {
        unlockScrollAndScrollToPosts();
      } else if (e.deltaY < 0 && window.scrollY <= 10 && isUnlocked) {
        lockScroll();
      }
    }, { passive: true });

    // Click or keypress on "Posts" heading unlocks scroll and smooth scrolls to posts section
    if (this.postsHeading) {
      this.postsHeading.addEventListener('click', unlockScrollAndScrollToPosts);

      this.postsHeading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          unlockScrollAndScrollToPosts();
        }
      });
    }
  }

  bindEvents() {
    // Stage Click (Cycle next avatar body)
    const stageContainer = document.querySelector('.slide-body-container');
    if (stageContainer) {
      stageContainer.addEventListener('click', (e) => {
        if (this.isSwiping) return;
        this.nextCharacter();
      });

      // Pointer / Touch Gestures for Swipe
      stageContainer.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
      stageContainer.addEventListener('pointerup', (e) => this.handlePointerUp(e));
      stageContainer.addEventListener('pointercancel', () => { this.isSwiping = false; });
    }

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        this.nextCharacter();
      } else if (e.key === 'ArrowLeft') {
        this.prevCharacter();
      } else if (e.key === 'Escape') {
        this.closePostModal();
      }
    });

    // Mobile Navigation Drawer Toggle
    if (this.mobileToggle && this.socialMenu) {
      this.mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.socialMenu.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!this.socialMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
          this.socialMenu.classList.remove('open');
        }
      });
    }

    // Post Modal Reader Controls
    if (this.postModalClose) {
      this.postModalClose.addEventListener('click', () => this.closePostModal());
    }
    if (this.postModalBackdrop) {
      this.postModalBackdrop.addEventListener('click', () => this.closePostModal());
    }
  }

  handlePointerDown(e) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
    this.isSwiping = false;
  }

  handlePointerUp(e) {
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    const deltaTime = Date.now() - this.startTime;

    if (deltaTime < 400 && Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      this.isSwiping = true;
      if (deltaX < 0) {
        this.nextCharacter();
      } else {
        this.prevCharacter();
      }
    } else {
      this.isSwiping = false;
    }
  }

  nextCharacter() {
    const nextIdx = (this.currentIndex + 1) % CHARACTERS.length;
    this.updateAvatar(nextIdx, 'forward');
  }

  prevCharacter() {
    const prevIdx = (this.currentIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
    this.updateAvatar(prevIdx, 'backward');
  }

  selectCharacter(index) {
    if (index === this.currentIndex) return;
    const direction = index > this.currentIndex ? 'forward' : 'backward';
    this.updateAvatar(index, direction);
  }

  updateAvatar(newIndex, direction = 'forward') {
    const updateDOM = () => {
      const oldChar = CHARACTERS[this.currentIndex];
      const newChar = CHARACTERS[newIndex];

      if (this.container) {
        this.container.classList.remove(`body-${oldChar.id}`);
        this.container.classList.add(`body-${newChar.id}`);
      }

      this.currentIndex = newIndex;
      this.updateBadges();

      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition({
        update: updateDOM,
        types: [direction]
      });
    } else {
      updateDOM();
    }
  }

  renderBadges() {
    if (!this.badgeContainer) return;
    this.badgeContainer.innerHTML = '';

    CHARACTERS.forEach((char, index) => {
      const btn = document.createElement('button');
      btn.className = `badge-btn ${index === this.currentIndex ? 'active' : ''}`;
      btn.setAttribute('aria-label', `Select ${char.name} avatar body`);
      btn.innerHTML = `<span>${char.name}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCharacter(index);
      });
      this.badgeContainer.appendChild(btn);
    });
  }

  updateBadges() {
    if (!this.badgeContainer) return;
    const buttons = this.badgeContainer.querySelectorAll('.badge-btn');
    buttons.forEach((btn, idx) => {
      if (idx === this.currentIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Blog Posts Fetching & Rendering
  async loadPosts() {
    try {
      // Try root or relative paths for GitHub Pages compatibility
      const res = await fetch('posts.json').catch(() => fetch('/posts.json'));
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      this.posts = await res.json();
      this.renderPosts();
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      if (this.postsGrid) {
        this.postsGrid.innerHTML = `<p style="color: rgba(255,255,255,0.7); text-align: center;">No posts available yet.</p>`;
      }
    }
  }

  renderPosts() {
    if (!this.postsGrid) return;
    this.postsGrid.innerHTML = '';

    if (!this.posts || this.posts.length === 0) {
      this.postsGrid.innerHTML = `<p style="color: rgba(255,255,255,0.7); text-align: center;">No posts found.</p>`;
      return;
    }

    this.posts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Read ${post.title}`);

      const tagsHTML = (post.tags || []).map(tag => `<span class="post-tag">#${tag}</span>`).join('');

      card.innerHTML = `
        <div class="post-card-meta">
          <span class="post-date">📅 ${post.formattedDate || post.date}</span>
          <span class="post-reading-time">⏱️ ${post.readingTime || ''}</span>
        </div>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-summary">${post.summary}</p>
        <div class="post-card-tags">${tagsHTML}</div>
      `;

      card.addEventListener('click', () => this.openPostModal(post));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.openPostModal(post);
      });

      this.postsGrid.appendChild(card);
    });
  }

  openPostModal(post) {
    if (!this.postModal || !this.postArticle) return;
    this.postArticle.innerHTML = `
      <div class="post-card-meta" style="margin-bottom: 16px;">
        <span class="post-date">📅 ${post.formattedDate || post.date}</span>
        <span class="post-reading-time">⏱️ ${post.readingTime || ''}</span>
      </div>
      ${post.html}
    `;
    this.postModal.classList.add('open');
    this.postModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closePostModal() {
    if (!this.postModal) return;
    this.postModal.classList.remove('open');
    this.postModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AvatarApp();
});

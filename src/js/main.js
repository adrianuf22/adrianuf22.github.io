/**
 * Modern Application Logic for adrianu.com.br
 * Character Avatar Switcher & Interactive Web Application
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

    // Touch / Gesture state
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isSwiping = false;

    this.init();
  }

  init() {
    this.renderBadges();
    this.updateAvatar(this.currentIndex, 'forward');
    this.bindEvents();
  }

  bindEvents() {
    // Stage Click (Cycle next)
    const stageContainer = document.querySelector('.slide-body-container');
    if (stageContainer) {
      stageContainer.addEventListener('click', (e) => {
        // Prevent click trigger if completing a swipe gesture
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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.nextCharacter();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.prevCharacter();
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

    // Check if horizontal swipe criterion is met (> 40px within 400ms, mostly horizontal)
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

      // Update character body class
      if (this.container) {
        this.container.classList.remove(`body-${oldChar.id}`);
        this.container.classList.add(`body-${newChar.id}`);
      }

      this.currentIndex = newIndex;
      this.updateBadges();

      // Trigger light vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    };

    // Use View Transitions API if available, else immediate fallback
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
}

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AvatarApp();
});

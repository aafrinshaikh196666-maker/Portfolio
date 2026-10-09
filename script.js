/**
 * Aafrin Shaikh - Personal Portfolio Website
 * Modular Vanilla JavaScript Application Logic
 * 
 * Features:
 * - Theme Switcher (Dark/Light) with LocalStorage & OS detection
 * - Typewriter Animation with dynamic word cycling
 * - Mobile Navigation Drawer with focus trap & ARIA support
 * - Scroll-based Sticky Header & Active Nav IntersectionObserver
 * - Smooth Scroll Reveal Animations
 * - Desktop Fluid Custom Cursor (disabled on touch)
 * - Project Details Accessible Modal System
 * - Interactive Contact Form with Real-time Validation & Mailto Fallback
 * - Back-to-Top Smooth Action
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Theme Controller (Dark / Light Theme)
  // ==========================================================================
  const ThemeController = {
    html: document.documentElement,
    toggleBtn: document.getElementById('themeToggleBtn'),
    sunIcon: document.querySelector('.sun-icon'),
    moonIcon: document.querySelector('.moon-icon'),
    STORAGE_KEY: 'aafrin_portfolio_theme',

    init() {
      if (!this.toggleBtn) return;

      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Determine initial theme
      const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
      this.applyTheme(initialTheme);

      // Event listener
      this.toggleBtn.addEventListener('click', () => {
        const currentTheme = this.html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
      });

      // Listen to OS system changes if no explicit user override
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    },

    applyTheme(theme, save = true) {
      this.html.setAttribute('data-theme', theme);
      if (save) {
        localStorage.setItem(this.STORAGE_KEY, theme);
      }

      // Update meta theme-color for mobile address bars
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', theme === 'dark' ? '#050d1a' : '#f8fafc');
      }

      // Toggle icons
      if (this.sunIcon && this.moonIcon) {
        if (theme === 'dark') {
          this.sunIcon.style.display = 'block';
          this.moonIcon.style.display = 'none';
        } else {
          this.sunIcon.style.display = 'none';
          this.moonIcon.style.display = 'block';
        }
      }
    }
  };

  // ==========================================================================
  // 2. Typewriter Effect
  // ==========================================================================
  const TypewriterEffect = {
    element: document.getElementById('typewriter'),
    phrases: [
      'Frontend Developer',
      'Computer Engineering Student',
      'Web Development Enthusiast',
      'AI Explorer'
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseBetween: 2000,
    phraseIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timeoutId: null,

    init() {
      if (!this.element) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.element.textContent = this.phrases[0];
        return;
      }
      this.type();
    },

    type() {
      const currentPhrase = this.phrases[this.phraseIndex];

      if (this.isDeleting) {
        this.charIndex--;
        this.element.textContent = currentPhrase.substring(0, this.charIndex);
      } else {
        this.charIndex++;
        this.element.textContent = currentPhrase.substring(0, this.charIndex);
      }

      let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

      if (!this.isDeleting && this.charIndex === currentPhrase.length) {
        speed = this.pauseBetween;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        speed = 500;
      }

      this.timeoutId = setTimeout(() => this.type(), speed);
    }
  };

  // ==========================================================================
  // 3. Navigation Controller (Sticky, Active Links, Mobile Drawer)
  // ==========================================================================
  const NavController = {
    navbar: document.getElementById('navbar'),
    mobileToggle: document.getElementById('mobileNavToggle'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    sections: document.querySelectorAll('section[id]'),

    init() {
      this.bindStickyScroll();
      this.bindMobileMenu();
      this.bindActiveObserver();
    },

    bindStickyScroll() {
      if (!this.navbar) return;
      const onScroll = () => {
        if (window.scrollY > 30) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },

    bindMobileMenu() {
      if (!this.mobileToggle || !this.mobileDrawer) return;

      const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !this.mobileDrawer.classList.contains('open');
        this.mobileDrawer.classList.toggle('open', isOpen);
        this.mobileToggle.setAttribute('aria-expanded', String(isOpen));
        this.mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      };

      this.mobileToggle.addEventListener('click', () => toggleMenu());

      // Close on link click
      this.mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.mobileDrawer.classList.contains('open')) {
          toggleMenu(false);
          this.mobileToggle.focus();
        }
      });
    },

    bindActiveObserver() {
      if (!this.sections.length) return;

      const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.setActiveLink(id);
          }
        });
      }, observerOptions);

      this.sections.forEach(sec => sectionObserver.observe(sec));
    },

    setActiveLink(id) {
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
      this.mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    }
  };

  // ==========================================================================
  // 4. Scroll Reveal Animations
  // ==========================================================================
  const ScrollReveal = {
    init() {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reveals.forEach(el => el.classList.add('revealed'));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(el => observer.observe(el));
    }
  };

  // ==========================================================================
  // 5. Desktop Custom Interactive Cursor
  // ==========================================================================
  const CursorController = {
    cursor: document.getElementById('customCursor'),
    follower: document.getElementById('cursorFollower'),
    mouseX: -100,
    mouseY: -100,
    followerX: -100,
    followerY: -100,

    init() {
      if (!this.cursor || !this.follower) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      });

      this.animateFollower();

      // Expand on hoverable elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-panel, .skill-badge');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => this.follower.classList.add('cursor-grow'));
        el.addEventListener('mouseleave', () => this.follower.classList.remove('cursor-grow'));
      });
    },

    animateFollower() {
      const speed = 0.18;
      this.followerX += (this.mouseX - this.followerX) * speed;
      this.followerY += (this.mouseY - this.followerY) * speed;
      this.follower.style.transform = `translate(${this.followerX}px, ${this.followerY}px)`;
      requestAnimationFrame(() => this.animateFollower());
    }
  };

  // ==========================================================================
  // 6. Back-to-Top Button
  // ==========================================================================
  const BackToTop = {
    btn: document.getElementById('backToTopBtn'),

    init() {
      if (!this.btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          this.btn.classList.add('visible');
        } else {
          this.btn.classList.remove('visible');
        }
      }, { passive: true });

      this.btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ==========================================================================
  // 7. Project Details Modal System
  // ==========================================================================
  const ProjectModal = {
    modal: document.getElementById('projectModal'),
    title: document.getElementById('modalTitle'),
    tags: document.getElementById('modalTags'),
    body: document.getElementById('modalBody'),
    actions: document.getElementById('modalActions'),
    closeBtn: document.getElementById('modalCloseBtn'),
    dismissBtn: document.getElementById('modalDismissBtn'),
    lastFocusedElement: null,

    projectData: {
      scamshield: {
        title: 'ScamShield AI',
        tags: ['Python', 'Machine Learning', 'NLP', 'Cybersecurity'],
        description: 'An AI-powered tool designed to detect and prevent online scams by analyzing patterns in text and URLs.',
        details: [
          {
            heading: 'Problem Statement & Motivation',
            content: 'Online phishing, deceptive SMS/messaging scams, and spoofed URLs target everyday users at alarming rates. ScamShield AI was created to evaluate incoming text snippets and web links in real-time to alert users before they fall prey to fraudulent activities.'
          },
          {
            heading: 'Technical Architecture',
            content: 'Built using Python and Machine Learning techniques. The NLP subsystem vectorizes message tokens using TF-IDF and computes a phishing likelihood score against known threat corpora. The URL analyzer inspects domain entropy, IP address obfuscation, and suspicious top-level domains.'
          },
          {
            heading: 'Key Capabilities',
            content: '• Real-time classification of deceptive text patterns.\n• Heuristic and pattern-based URL safety checks.\n• Clean, user-friendly reporting dashboard for instant threat evaluation.'
          },
          {
            heading: 'Project Status & Open Source',
            content: 'Under active research and expansion as part of academic engineering exploration.'
          }
        ]
      },
      scholartechies: {
        title: 'ScholarTechies',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Firebase', 'Academic Platform'],
        description: 'A collaborative platform for students to share resources, form study groups, and track academic progress.',
        details: [
          {
            heading: 'Purpose & Vision',
            content: 'Navigating engineering semester coursework often suffers from fragmented study notes, scattered lab manuals, and lack of peer collaboration. ScholarTechies solves this by providing a unified, student-driven hub for engineering cohorts.'
          },
          {
            heading: 'Frontend & Architecture',
            content: 'Developed with a clean responsive web interface utilizing HTML5, modern CSS3 flex/grid systems, and Vanilla JavaScript. Backend persistence and real-time state synchronization are powered by Firebase Realtime Database & Authentication.'
          },
          {
            heading: 'Core Features',
            content: '• Resource-sharing repository with categorized course materials and lab code.\n• Study group formation pods where peers collaborate on specific topics.\n• Personal and group progress-tracking dashboards to monitor semester milestones.'
          },
          {
            heading: 'Impact',
            content: 'Empowers students to cultivate a community-first study routine with zero setup friction.'
          }
        ]
      },
      drishti: {
        title: 'Drishti AI',
        tags: ['Python', 'OpenCV', 'Computer Vision', 'Text-to-Speech', 'Accessibility'],
        description: 'A computer vision application focusing on accessibility, providing auditory descriptions of visual surroundings.',
        details: [
          {
            heading: 'Accessibility Mission',
            content: 'Named after the Sanskrit word for "vision", Drishti AI is an assistive technology application created to empower visually impaired individuals by translating camera feeds into informative spoken audio cues.'
          },
          {
            heading: 'Core Pipeline & OpenCV Integration',
            content: 'Implements an efficient object detection pipeline using Python and OpenCV. Captured frames are analyzed in real-time to isolate objects, measure proximity, and extract printed text via optical character recognition.'
          },
          {
            heading: 'Auditory Narration Output',
            content: 'A lightweight Text-to-Speech (TTS) integration synthesizes detected environmental obstacles and readings into natural audio descriptions, delivered via a mobile-first user interface.'
          },
          {
            heading: 'Key Highlights',
            content: '• High-speed frame processing with OpenCV.\n• Low-latency auditory feedback for enhanced spatial awareness.\n• Designed with high-contrast accessibility standards.'
          }
        ]
      }
    },

    init() {
      if (!this.modal) return;

      // Bind all open buttons
      document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const key = e.currentTarget.getAttribute('data-project');
          if (key && this.projectData[key]) {
            this.open(key, e.currentTarget);
          }
        });
      });

      // Bind close buttons
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.dismissBtn) this.dismissBtn.addEventListener('click', () => this.close());

      // Backdrop click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('open')) {
          this.close();
        }
      });
    },

    open(key, triggerBtn) {
      this.lastFocusedElement = triggerBtn;
      const data = this.projectData[key];

      this.title.textContent = data.title;

      // Tags
      this.tags.innerHTML = data.tags.map(tag => 
        `<span class="tech-tag">${tag}</span>`
      ).join('');

      // Body
      let bodyHtml = `<p style="font-size: 1.05rem; color: var(--text-primary); font-weight: 500;">${data.description}</p>`;
      data.details.forEach(sec => {
        bodyHtml += `
          <div>
            <h4 class="modal-section-title">${sec.heading}</h4>
            <p style="white-space: pre-line; color: var(--text-secondary); font-size: 0.92rem;">${sec.content}</p>
          </div>
        `;
      });
      this.body.innerHTML = bodyHtml;

      // Open state
      this.modal.classList.add('open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (this.closeBtn) this.closeBtn.focus();
    },

    close() {
      this.modal.classList.remove('open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }
  };

  // ==========================================================================
  // 8. Contact Form Controller (Real Validation & Mailto Fallback)
  // ==========================================================================
  const ContactForm = {
    form: document.getElementById('contactForm'),
    nameInput: document.getElementById('contactName'),
    emailInput: document.getElementById('contactEmail'),
    subjectInput: document.getElementById('contactSubject'),
    messageInput: document.getElementById('contactMessage'),
    submitBtn: document.getElementById('submitBtn'),
    submitBtnText: document.getElementById('submitBtnText'),
    submitBtnIcon: document.getElementById('submitBtnIcon'),
    statusAlert: document.getElementById('formStatusAlert'),
    isSubmitting: false,

    init() {
      if (!this.form) return;

      // Real-time input validation on blur / input
      this.nameInput.addEventListener('input', () => this.validateField(this.nameInput, 'nameError', val => val.trim().length >= 2));
      this.emailInput.addEventListener('input', () => this.validateField(this.emailInput, 'emailError', val => this.isValidEmail(val)));
      this.subjectInput.addEventListener('input', () => this.validateField(this.subjectInput, 'subjectError', val => val.trim().length >= 3));
      this.messageInput.addEventListener('input', () => this.validateField(this.messageInput, 'messageError', val => val.trim().length >= 15));

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      return emailRegex.test(email.trim());
    },

    validateField(field, errorId, validationFn) {
      const errorEl = document.getElementById(errorId);
      const isValid = validationFn(field.value);

      if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.classList.add('visible');
        return false;
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        field.setAttribute('aria-invalid', 'false');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
      }
    },

    showAlert(message, type) {
      if (!this.statusAlert) return;
      this.statusAlert.className = `form-status-alert ${type}`;
      this.statusAlert.textContent = message;
      this.statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    clearAlert() {
      if (!this.statusAlert) return;
      this.statusAlert.className = 'form-status-alert';
      this.statusAlert.textContent = '';
    },

    handleSubmit(e) {
      e.preventDefault();

      if (this.isSubmitting) return;

      // Anti-spam check (honeypot field)
      const honeypot = this.form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission suppressed.');
        return;
      }

      // Validate all fields
      const isNameValid = this.validateField(this.nameInput, 'nameError', val => val.trim().length >= 2);
      const isEmailValid = this.validateField(this.emailInput, 'emailError', val => this.isValidEmail(val));
      const isSubjectValid = this.validateField(this.subjectInput, 'subjectError', val => val.trim().length >= 3);
      const isMessageValid = this.validateField(this.messageInput, 'messageError', val => val.trim().length >= 15);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        this.showAlert('Please correct the highlighted errors before submitting.', 'error');
        // Focus first invalid input
        if (!isNameValid) this.nameInput.focus();
        else if (!isEmailValid) this.emailInput.focus();
        else if (!isSubjectValid) this.subjectInput.focus();
        else if (!isMessageValid) this.messageInput.focus();
        return;
      }

      this.isSubmitting = true;
      this.setLoading(true);
      this.clearAlert();

      // Extract sanitized values
      const name = this.nameInput.value.trim();
      const email = this.emailInput.value.trim();
      const subject = this.subjectInput.value.trim();
      const message = this.messageInput.value.trim();

      // In a client-only static deployment without backend secrets,
      // create a direct mailto composer link with pre-populated message fields.
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Hi Aafrin,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`
      );
      const mailtoUrl = `mailto:aafrinshaikh1966@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        // Trigger default mail client
        window.location.href = mailtoUrl;

        this.showAlert(
          `Thank you, ${name}! Your default email client has been launched with your message pre-filled to aafrinshaikh1966@gmail.com. You can also reach me directly at that address.`,
          'info'
        );

        this.form.reset();
        [this.nameInput, this.emailInput, this.subjectInput, this.messageInput].forEach(input => {
          input.classList.remove('is-valid', 'is-invalid');
          input.removeAttribute('aria-invalid');
        });

        this.setLoading(false);
        this.isSubmitting = false;
      }, 700);
    },

    setLoading(loading) {
      if (!this.submitBtn) return;
      if (loading) {
        this.submitBtn.disabled = true;
        if (this.submitBtnText) this.submitBtnText.textContent = 'Preparing Message...';
        if (this.submitBtnIcon) {
          this.submitBtnIcon.innerHTML = `
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" style="animation: spin 0.8s linear infinite;"/>
          `;
        }
      } else {
        this.submitBtn.disabled = false;
        if (this.submitBtnText) this.submitBtnText.textContent = 'Send Message';
        if (this.submitBtnIcon) {
          this.submitBtnIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          `;
        }
      }
    }
  };

  // Add keyframe for button spinner dynamically
  const spinnerStyle = document.createElement('style');
  spinnerStyle.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(spinnerStyle);

  // ==========================================================================
  // 9. Document Ready Initialization
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    TypewriterEffect.init();
    NavController.init();
    ScrollReveal.init();
    CursorController.init();
    BackToTop.init();
    ProjectModal.init();
    ContactForm.init();
  });

})();

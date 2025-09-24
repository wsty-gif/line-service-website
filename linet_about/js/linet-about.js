/* ========================================
 * LINET ABOUT PAGE - 修正版
 * - 無限再帰の修正（init() <-> bindEvents() の相互呼び出しを解消）
 * - initLazyLoading -> setupLazyLoading に変更
 * - 初期化フラグ追加（多重初期化防止）
 * - handleError のログ改善
 * - destroy の安全なイベント解除
 * ======================================== */

const LinetAbout = {
    // 設定
    config: {
        animationDuration: 800,
        scrollOffset: 80,
        throttleDelay: 16,
        debounceDelay: 250,
        intersectionThreshold: 0.1
    },

    // 状態管理
    state: {
        isMenuOpen: false,
        isScrolling: false,
        currentSection: 'hero',
        observers: new Map(),
        isInitialized: false
    },

    // 初期化
    init() {
        // 多重初期化防止
        if (this.state.isInitialized) return;
        this.state.isInitialized = true;

        // 初期化処理（bindEvents は外で呼ばれるようにしているためここでは呼ばない）
        this.initNavigation();
        this.initScrollAnimations();
        this.initContactForm();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initPerformanceOptimizations();

        console.log('✅ LinetAbout.js initialized successfully');
    },

    // イベントバインディング
    bindEvents() {
        // DOM読み込み完了時に init を呼ぶ（既に読み込み済みなら即実行）
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // DOM が既に読み込まれている場合は即初期化
            this.init();
        }

        // ページ読み込み完了（リソース読み込み後）の処理
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });

        // リサイズイベント
        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, this.config.throttleDelay));

        // エラーハンドリング
        window.addEventListener('error', (errorEvent) => {
            this.handleError(errorEvent);
        });
    },

    // ========================================
    // ナビゲーション関連
    // ========================================
    initNavigation() {
        const nav = document.querySelector('.linet-navigation');
        if (!nav) return;

        // スクロール時の背景変更
        this.handleNavScroll = this.throttle(() => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }, this.config.throttleDelay);

        window.addEventListener('scroll', this.handleNavScroll);

        // アクティブリンクの更新
        this.updateActiveNavLink();
        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNavLink();
        }, this.config.throttleDelay));
    },

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.linet-nav-link');
        const scrollPos = window.scrollY + this.config.scrollOffset;

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        if (currentSection && currentSection !== this.state.currentSection) {
            this.state.currentSection = currentSection;

            // 既存のアクティブクラスを削除
            navLinks.forEach(link => link.classList.remove('active'));

            // 対応するナビリンクにアクティブクラスを追加
            const activeLink = document.querySelector(`.linet-nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    },

    // ========================================
    // スムーススクロール
    // ========================================
    initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');

        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleSmoothScroll(e);
            });
        });
    },

    handleSmoothScroll(e) {
        e.preventDefault();

        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        const nav = document.querySelector('.linet-navigation');
        const navHeight = nav ? nav.offsetHeight : 0;
        const offset = navHeight + 20;
        const targetPosition = targetElement.offsetTop - offset;

        // スクロール実行
        this.smoothScrollTo(targetPosition);

        // クリック効果
        if (e.currentTarget.classList.contains('linet-point-item')) {
            this.addClickEffect(e.currentTarget);
        }

        // モバイルメニューを閉じる
        this.closeMobileMenu();
    },

    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = this.config.animationDuration;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    },

    // イージング関数
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },

    // ========================================
    // スクロールアニメーション
    // ========================================
    initScrollAnimations() {
        const observerOptions = {
            threshold: this.config.intersectionThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('linet-animate');
                    mainObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll(
            '.linet-point-section, .linet-problem-item'
        );

        animateElements.forEach(element => {
            mainObserver.observe(element);
        });

        this.state.observers.set('main', mainObserver);

        // 数値カウントアニメーション
        this.initCountAnimation();
    },

    initCountAnimation() {
        const countElements = document.querySelectorAll('[data-count]');

        if (countElements.length === 0) return;

        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(element => {
            countObserver.observe(element);
        });

        this.state.observers.set('count', countObserver);
    },

    animateCount(element) {
        const targetCount = parseInt(element.getAttribute('data-count')) || 0;
        const duration = 2000; // 2秒
        const start = Date.now();
        const startCount = 0;

        const updateCount = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = this.easeOutExpo(progress);
            const currentCount = Math.floor(startCount + (targetCount - startCount) * easedProgress);

            element.textContent = currentCount.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = targetCount.toLocaleString();
            }
        };

        updateCount();
    },

    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },

    // ========================================
    // モバイルメニュー
    // ========================================
    initMobileMenu() {
        const hamburger = document.querySelector('.linet-hamburger');
        const navMenu = document.querySelector('.linet-nav-menu');

        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        const navLinks = navMenu.querySelectorAll('.linet-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        this.state.isMenuOpen = !this.state.isMenuOpen;

        const hamburger = document.querySelector('.linet-hamburger');
        const navMenu = document.querySelector('.linet-nav-menu');

        if (this.state.isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeMobileMenu() {
        if (!this.state.isMenuOpen) return;

        this.state.isMenuOpen = false;

        const hamburger = document.querySelector('.linet-hamburger');
        const navMenu = document.querySelector('.linet-nav-menu');

        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    // ========================================
    // お問い合わせフォーム
    // ========================================
    initContactForm() {
        const contactForm = document.querySelector('.linet-contact-form');

        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },

    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;

        if (!this.validateForm(form)) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';

        if (submitButton) this.setSubmitButtonState(submitButton, 'loading');

        try {
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData);

            await this.submitForm(formObject);

            this.showFormMessage('お問い合わせありがとうございます。24時間以内にご連絡いたします。', 'success');
            form.reset();

        } catch (error) {
            this.showFormMessage('送信に失敗しました。しばらく時間をおいて再度お試しください。', 'error');
            console.error('Form submission error:', error);

        } finally {
            if (submitButton) this.setSubmitButtonState(submitButton, 'normal', originalText);
        }
    },

    async submitForm(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', formData);
                resolve();
            }, 2000);
        });
    },

    setSubmitButtonState(button, state, originalText = '') {
        switch (state) {
            case 'loading':
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
                break;
            case 'normal':
            default:
                button.disabled = false;
                button.innerHTML = originalText || '<i class="fas fa-paper-plane"></i> 送信する';
                break;
        }
    },

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        const emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value && !this.validateField(emailField)) {
            isValid = false;
        }

        return isValid;
    },

    validateField(field) {
        const value = (field.value || '').trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'このフィールドは必須です。';
        }

        if (field.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                isValid = false;
                errorMessage = '正しいメールアドレスを入力してください。';
            }
        }

        if (field.type === 'tel' && value) {
            if (!this.isValidPhone(value)) {
                isValid = false;
                errorMessage = '正しい電話番号を入力してください。';
            }
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPhone(phone) {
        const phoneRegex = /^[\d\-\(\)\+\s]{10,}$/;
        return phoneRegex.test(phone);
    },

    showFieldError(field, message) {
        this.clearFieldError(field);

        field.style.borderColor = 'var(--linet-accent-color)';
        field.setAttribute('aria-invalid', 'true');

        const errorElement = document.createElement('div');
        errorElement.className = 'linet-field-error';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');

        field.parentNode.appendChild(errorElement);
    },

    clearFieldError(field) {
        if (!field) return;
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');

        const errorElement = field.parentNode ? field.parentNode.querySelector('.linet-field-error') : null;
        if (errorElement) {
            errorElement.remove();
        }
    },

    showFormMessage(message, type) {
        const existingMessage = document.querySelector('.linet-form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `linet-form-message ${type}`;
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');

        const form = document.querySelector('.linet-contact-form');
        if (!form || !form.parentNode) return;

        form.parentNode.insertBefore(messageElement, form);

        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';

        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 5000);
    },

    // ========================================
    // ユーティリティ関数
    // ========================================

    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },

    // ========================================
    // パフォーマンス最適化
    // ========================================
    initPerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupPrefetch();
    },

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });

        this.state.observers.set('images', imageObserver);
    },

    setupPrefetch() {
        const importantLinks = document.querySelectorAll('a[href^="#"]');

        importantLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const images = targetSection.querySelectorAll('img[src]');
                    images.forEach(img => {
                        if (!img.complete) {
                            const preloadLink = document.createElement('link');
                            preloadLink.rel = 'prefetch';
                            preloadLink.href = img.src;
                            document.head.appendChild(preloadLink);
                        }
                    });
                }
            }, { once: true });
        });
    },

    // ========================================
    // イベントハンドラー
    // ========================================
    handlePageLoad() {
        document.body.classList.add('loaded');

        // setupLazyLoading を呼び出す（存在する関数名へ変更）
        if (typeof this.setupLazyLoading === 'function') {
            this.setupLazyLoading();
        }

        console.log('✅ LinetAbout page loaded completely');
    },

    handleResize() {
        if (this.state.isMenuOpen && window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    },

    handleError(errorEvent) {
        // errorEvent は window.onerror の形式や ErrorEvent で来るため柔軟に扱う
        try {
            console.error('LinetAbout JavaScript Error:', errorEvent);

            if (window.location.hostname !== 'localhost') {
                this.reportError(errorEvent);
            }
        } catch (e) {
            console.error('Error in handleError:', e);
        }
    },

    reportError(error) {
        try {
            const payload = {
                message: error.message || (error.error && error.error.message) || 'Unknown error',
                filename: error.filename || null,
                lineno: error.lineno || null,
                colno: error.colno || null,
                stack: error.error && error.error.stack ? error.error.stack : null,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            };

            // /api/error-report が環境にない場合はここで失敗するため try/catch
            fetch('/api/error-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            }).catch(err => {
                // 404 等はログに残すだけにする
                console.warn('Error report failed (non-fatal):', err);
            });
        } catch (reportError) {
            console.warn('Failed to prepare error report:', reportError);
        }
    },

    // ========================================
    // クリーンアップ
    // ========================================
    destroy() {
        try {
            if (this.handleNavScroll) {
                window.removeEventListener('scroll', this.handleNavScroll);
            }

            // Intersection Observer の削除
            this.state.observers.forEach(observer => {
                try { observer.disconnect(); } catch (e) { /* noop */ }
            });
            this.state.observers.clear();

            // モバイルメニューを閉じる
            this.closeMobileMenu();

            console.log('🧹 LinetAbout destroyed and cleaned up');
        } catch (e) {
            console.error('Error during destroy:', e);
        }
    }
};

// 即座実行（IIFE）
(() => {
    'use strict';

    // LinetAbout のイベントを先にバインドしておく（DOMContentLoaded 内で init を呼ぶ流れ）
    LinetAbout.bindEvents();

    // グローバルアクセス用（デバッグ時など）
    if (typeof window !== 'undefined') {
        window.LinetAbout = LinetAbout;
    }
})();

// エクスポート（モジュール使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinetAbout;
}

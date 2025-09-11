/**
 * LINE Business Solutions - Main JavaScript
 * インタラクティブな機能とアニメーションを実装
 */

(function() {
    'use strict';

    // DOM要素の取得
    const elements = {
        header: document.getElementById('header'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        scrollTopBtn: document.getElementById('scrollTop'),
        contactForm: document.getElementById('contactForm')
    };

    // アニメーション用のクラス
    const ANIMATION_CLASSES = {
        fadeIn: 'fade-in',
        slideInLeft: 'slide-in-left',
        slideInRight: 'slide-in-right',
        scaleIn: 'scale-in',
        visible: 'visible'
    };

    // 初期化
    function init() {
        setupEventListeners();
        setupScrollAnimations();
        setupIntersectionObserver();
        setupParallaxEffects();
        setupCounterAnimations();
        setupTypewriterEffect();
        setupSmoothScroll();
    }

    // イベントリスナーの設定
    function setupEventListeners() {
        // モバイルメニューのトグル
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // スムーズスクロール
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // スクロールイベント
        window.addEventListener('scroll', throttle(handleScroll, 16));

        // トップに戻るボタン
        if (elements.scrollTopBtn) {
            elements.scrollTopBtn.addEventListener('click', scrollToTop);
        }

        // フォーム送信
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmit);
        }

        // ウィンドウリサイズ
        window.addEventListener('resize', throttle(handleResize, 250));

        // キーボードナビゲーション
        document.addEventListener('keydown', handleKeyboardNavigation);

        // プランカードのインタラクション
        setupPlanCardInteractions();

        // 選択カードのアニメーション
        setupChoiceCardAnimations();
    }

    // モバイルメニューのトグル
    function toggleMobileMenu() {
        if (!elements.navMenu) return;
        
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
        
        // アニメーション効果
        const spans = elements.navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = elements.navToggle.classList.contains('active') 
                ? getHamburgerAnimation(index)
                : 'rotate(0deg) translateY(0px)';
        });

        // ボディのスクロールを制御
        document.body.style.overflow = elements.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // ハンバーガーメニューのアニメーション
    function getHamburgerAnimation(index) {
        const animations = [
            'rotate(45deg) translateY(7px)',
            'opacity: 0',
            'rotate(-45deg) translateY(-7px)'
        ];
        return animations[index] || '';
    }

    // スムーズスクロールの処理
    function handleSmoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // ヘッダーの高さを考慮
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // モバイルメニューが開いていれば閉じる
            if (elements.navMenu && elements.navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    }

    // スクロール処理
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // ヘッダーの背景変更
        updateHeaderBackground(scrollY);
        
        // トップに戻るボタンの表示制御
        updateScrollTopButton(scrollY);
        
        // パララックス効果
        applyParallaxEffects(scrollY);
    }

    // ヘッダー背景の更新
    function updateHeaderBackground(scrollY) {
        if (!elements.header) return;
        
        if (scrollY > 100) {
            elements.header.style.background = 'rgba(255, 255, 255, 0.98)';
            elements.header.style.backdropFilter = 'blur(15px)';
        } else {
            elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
            elements.header.style.backdropFilter = 'blur(10px)';
        }
    }

    // トップに戻るボタンの表示制御
    function updateScrollTopButton(scrollY) {
        if (!elements.scrollTopBtn) return;
        
        if (scrollY > 300) {
            elements.scrollTopBtn.classList.add('visible');
        } else {
            elements.scrollTopBtn.classList.remove('visible');
        }
    }

    // トップにスクロール
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Intersection Observerの設定
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(ANIMATION_CLASSES.visible);
                    
                    // カウンターアニメーションの開始
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // アニメーション対象要素の監視
        const animationTargets = document.querySelectorAll(`
            .${ANIMATION_CLASSES.fadeIn},
            .${ANIMATION_CLASSES.slideInLeft},
            .${ANIMATION_CLASSES.slideInRight},
            .${ANIMATION_CLASSES.scaleIn},
            .problem-item,
            .choice-card,
            .service-item,
            .plan-card,
            .stat-item
        `);

        animationTargets.forEach(target => {
            if (!target.classList.contains(ANIMATION_CLASSES.visible)) {
                target.classList.add(ANIMATION_CLASSES.fadeIn);
            }
            observer.observe(target);
        });
    }

    // パララックス効果の設定
    function setupParallaxEffects() {
        // ヒーローセクションの背景要素
        const heroShapes = document.querySelector('.hero-shapes');
        if (heroShapes) {
            heroShapes.style.transition = 'transform 0.1s ease-out';
        }
    }

    // パララックス効果の適用
    function applyParallaxEffects(scrollY) {
        const heroShapes = document.querySelector('.hero-shapes');
        if (heroShapes) {
            const speed = 0.5;
            heroShapes.style.transform = `translateY(${scrollY * speed}px)`;
        }

        // 電話モックアップのパララックス
        const phoneMockup = document.querySelector('.phone-mockup');
        if (phoneMockup) {
            const speed = 0.3;
            phoneMockup.style.transform = `translateY(${scrollY * speed}px)`;
        }
    }

    // カウンターアニメーションの設定
    function setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            counter.setAttribute('data-target', counter.textContent);
            counter.textContent = '0';
        });
    }

    // カウンターアニメーション
    function animateCounter(element) {
        if (element.hasAttribute('data-animated')) return;
        
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数（ease-out）
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeProgress);
            
            element.textContent = current + (element.getAttribute('data-target').includes('%') ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = element.getAttribute('data-target');
                element.setAttribute('data-animated', 'true');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // タイプライター効果の設定
    function setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            setTimeout(() => {
                typeText(element, text, 50);
            }, 1000);
        });
    }

    // テキストタイプアニメーション
    function typeText(element, text, delay) {
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, delay);
            }
        }
        
        type();
    }

    // プランカードのインタラクション
    function setupPlanCardInteractions() {
        const planCards = document.querySelectorAll('.plan-card');
        
        planCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('popular')) {
                    card.style.transform = 'translateY(0) scale(1.05)';
                } else {
                    card.style.transform = 'translateY(0) scale(1)';
                }
                card.style.zIndex = '1';
            });
        });
    }

    // 選択カードのアニメーション
    function setupChoiceCardAnimations() {
        const choiceCards = document.querySelectorAll('.choice-card');
        
        choiceCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                // 他のカードをフェードアウト
                choiceCards.forEach((otherCard, otherIndex) => {
                    if (otherIndex !== index) {
                        otherCard.style.opacity = '0.7';
                        otherCard.style.transform = 'scale(0.95)';
                    }
                });
                
                // ホバーしたカードを強調
                card.style.opacity = '1';
                card.style.transform = 'translateY(-15px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                // すべてのカードを元に戻す
                choiceCards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                    otherCard.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
    }

    // フォーム送信処理
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // ローディング状態
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        submitBtn.disabled = true;
        
        // バリデーション
        const validation = validateForm(formData);
        if (!validation.isValid) {
            showFormError(validation.errors);
            resetSubmitButton(submitBtn, originalText);
            return;
        }
        
        // 送信シミュレーション（実際の送信処理に置き換える）
        setTimeout(() => {
            showFormSuccess();
            resetSubmitButton(submitBtn, originalText);
            e.target.reset();
        }, 2000);
    }

    // フォームバリデーション
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.get('company').trim()) {
            errors.push('会社名を入力してください');
        }
        
        if (!formData.get('name').trim()) {
            errors.push('お名前を入力してください');
        }
        
        const email = formData.get('email').trim();
        if (!email) {
            errors.push('メールアドレスを入力してください');
        } else if (!isValidEmail(email)) {
            errors.push('正しいメールアドレスを入力してください');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // メールアドレス検証
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // フォームエラー表示
    function showFormError(errors) {
        const errorHtml = `
            <div class="form-error" style="
                background: #ffebee;
                color: #c62828;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border-left: 4px solid #c62828;
            ">
                <strong>入力エラーがあります：</strong>
                <ul style="margin: 0.5rem 0 0 1rem;">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        
        showMessage(errorHtml);
    }

    // フォーム成功メッセージ表示
    function showFormSuccess() {
        const successHtml = `
            <div class="form-success" style="
                background: #e8f5e8;
                color: #2e7d32;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border-left: 4px solid #4caf50;
            ">
                <strong><i class="fas fa-check-circle"></i> 送信完了</strong><br>
                お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。
            </div>
        `;
        
        showMessage(successHtml);
    }

    // メッセージ表示
    function showMessage(html) {
        const existingMessage = document.querySelector('.form-error, .form-success');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        elements.contactForm.insertAdjacentHTML('afterbegin', html);
        
        // 3秒後に自動削除
        setTimeout(() => {
            const message = document.querySelector('.form-error, .form-success');
            if (message) {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }

    // 送信ボタンリセット
    function resetSubmitButton(btn, originalText) {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }

    // スムーズスクロールの設定
    function setupSmoothScroll() {
        // ページ内リンクの自動検出とスムーズスクロール適用
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.style.cursor = 'pointer';
        });
    }

    // スクロールアニメーション
    function setupScrollAnimations() {
        // 要素が画面に入ったときのアニメーション設定
        const animatedElements = document.querySelectorAll('.problem-item, .advantage-item, .feature, .plan-card');
        
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // キーボードナビゲーション
    function handleKeyboardNavigation(e) {
        // Escapeキーでモバイルメニューを閉じる
        if (e.key === 'Escape' && elements.navMenu && elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Tabキーでのフォーカス管理
        if (e.key === 'Tab') {
            handleTabNavigation(e);
        }
    }

    // Tab ナビゲーション処理
    function handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(`
            a[href], button, input, textarea, select,
            [tabindex]:not([tabindex="-1"])
        `);
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // ウィンドウリサイズ処理
    function handleResize() {
        // モバイルメニューの状態をリセット
        if (window.innerWidth > 768 && elements.navMenu && elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // アニメーションのリセット
        resetAnimations();
    }

    // アニメーションリセット
    function resetAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in.visible');
        animatedElements.forEach(element => {
            element.style.transition = 'none';
            element.offsetHeight; // リフロー強制
            element.style.transition = '';
        });
    }

    // スロットリング関数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // デバウンス関数
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // パフォーマンス監視
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }
    }

    // アクセシビリティの向上
    function enhanceAccessibility() {
        // フォーカス可視化の改善
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // ARIAラベルの動的設定
        const interactiveElements = document.querySelectorAll('button, a, input');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                element.setAttribute('aria-label', '操作ボタン');
            }
        });
    }

    // エラーハンドリング
    function setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // ページ読み込み完了後の初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ページロード完了後の処理
    window.addEventListener('load', () => {
        monitorPerformance();
        enhanceAccessibility();
        setupErrorHandling();
        
        // プリローダーの削除（存在する場合）
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    });

    // 外部APIへの公開（必要な場合）
    window.LineBusinessSolutions = {
        scrollToSection: function(sectionId) {
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        openMobileMenu: function() {
            if (elements.navMenu && !elements.navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        },
        
        closeMobileMenu: function() {
            if (elements.navMenu && elements.navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    };

})();
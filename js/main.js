// ========================================
// DOM読み込み完了後に実行
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 各機能を初期化
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initMobileMenu();
    initSmoothScroll();
});

// ========================================
// ナビゲーション関連機能
// ========================================
function initNavigation() {
    const nav = document.getElementById('navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // スクロール時のナビゲーション背景変更
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // アクティブなナビゲーションリンクの更新
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // 既存のアクティブクラスを削除
            navLinks.forEach(link => link.classList.remove('active'));
            
            // 対応するナビリンクにアクティブクラスを追加
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ========================================
// スムーススクロール機能
// ========================================
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const nav = document.getElementById('navigation');
                const navHeight = nav ? nav.offsetHeight : 0;
                
                // 少し余裕を持たせてスクロール
                const offset = navHeight + 20;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // スクロールナビゲーションボタンにクリック効果を追加
                if (this.classList.contains('point_item')) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }

                // モバイルメニューが開いている場合は閉じる
                closeMobileMenu();
            }
        });
    });
}

// ========================================
// スクロールアニメーション
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.point-section, .problem-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // 数値カウントアニメーション（必要に応じて追加）
    initCountAnimation();
}

function initCountAnimation() {
    const countElements = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(element => {
        countObserver.observe(element);
    });
}

function animateCount(element) {
    const targetCount = parseInt(element.getAttribute('data-count'));
    let currentCount = 0;
    const increment = targetCount / 100;
    
    const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            element.textContent = targetCount.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toLocaleString();
        }
    }, 20);
}

// ========================================
// モバイルメニュー機能
// ========================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // メニューリンクをクリックした時にメニューを閉じる
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // ボディのスクロールを制御
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// お問い合わせフォーム
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });

        // リアルタイムバリデーション
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function handleFormSubmit(form) {
    // フォームバリデーション
    if (!validateForm(form)) {
        return;
    }

    // 送信ボタンを無効化
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';

    // フォームデータを取得
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // 実際の送信処理（ここではシミュレーション）
    setTimeout(() => {
        // 成功メッセージを表示
        showFormMessage('お問い合わせありがとうございます。24時間以内にご連絡いたします。', 'success');
        
        // フォームをリセット
        form.reset();
        
        // 送信ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 必須フィールドチェック
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'このフィールドは必須です。';
    }
    
    // メールアドレス形式チェック
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = '正しいメールアドレスを入力してください。';
    }
    
    // エラー表示の更新
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#FF6B6B';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#FF6B6B';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // スタイルを設定
    messageElement.style.padding = '15px 20px';
    messageElement.style.borderRadius = '10px';
    messageElement.style.marginBottom = '20px';
    messageElement.style.textAlign = 'center';
    messageElement.style.fontWeight = '500';
    
    if (type === 'success') {
        messageElement.style.background = '#D4EDDA';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #C3E6CB';
    } else if (type === 'error') {
        messageElement.style.background = '#F8D7DA';
        messageElement.style.color = '#721C24';
        messageElement.style.border = '1px solid #F5C6CB';
    }
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form);
    
    // 5秒後にメッセージを自動削除
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// ========================================
// パフォーマンス最適化
// ========================================
// スクロールイベントのスロットリング
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

// リサイズイベントのデバウンス
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// ページ読み込み完了後の追加初期化
// ========================================
window.addEventListener('load', function() {
    // ローディングアニメーション終了（必要に応じて）
    document.body.classList.add('loaded');
    
    // 遅延画像読み込み（Lazy Loading）
    initLazyLoading();
});

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// エラーハンドリング
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 本番環境では、エラーログをサーバーに送信することも可能
});

// ========================================
// ユーティリティ関数
// ========================================
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + getScrollPosition(),
        left: rect.left + window.pageXOffset
    };
}
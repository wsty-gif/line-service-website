// LINE Pro Solutions - メイン JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // チャット機能
    initChatWidget();
    
    // FAQ機能
    initFAQ();
    
    // スムーススクロール
    initSmoothScroll();
    
    // モバイルメニュー
    initMobileMenu();
    
    // スクロールアニメーション
    initScrollAnimation();
    
    // ヘッダーの背景変更
    initHeaderScroll();
});

// チャット機能の初期化
function initChatWidget() {
    const chatButton = document.getElementById('chatButton');
    const chatModal = document.getElementById('chatModal');
    const closeChat = document.getElementById('closeChat');
    
    if (!chatButton || !chatModal || !closeChat) return;
    
    // チャットボタンクリックでモーダル表示
    chatButton.addEventListener('click', function() {
        chatModal.style.display = chatModal.style.display === 'block' ? 'none' : 'block';
    });
    
    // 閉じるボタン
    closeChat.addEventListener('click', function() {
        chatModal.style.display = 'none';
    });
    
    // モーダル外クリックで閉じる
    document.addEventListener('click', function(e) {
        if (!chatModal.contains(e.target) && !chatButton.contains(e.target)) {
            chatModal.style.display = 'none';
        }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            chatModal.style.display = 'none';
        }
    });
}

// FAQ機能の初期化
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // 他のFAQを閉じる
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // クリックされたFAQをトグル
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// スムーススクロールの初期化
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// モバイルメニューの初期化
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // メニュー項目クリックで閉じる
    navMenu.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
}

// スクロールアニメーションの初期化
function initScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// ヘッダーのスクロール効果
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // スクロール方向に応じてヘッダーを隠す/表示する
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ユーティリティ関数
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
    }
}

// フォーム検証ヘルパー
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\-\(\)\+\s]+$/;
    return phone === '' || re.test(phone);
}

// アニメーション用クラス
function addFadeInAnimation(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// ローディング表示
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    button.disabled = true;
    return originalText;
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// 通知メッセージ表示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // CSS スタイルを追加
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // アニメーションで表示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 5秒後に削除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
// お問い合わせフォーム JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (form) {
        initContactForm();
    }
});

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // リアルタイム検証
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // フォーム送信処理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// フィールド検証
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // 必須フィールドチェック
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'この項目は必須です';
    }
    
    // 個別検証
    switch (field.type) {
        case 'email':
            if (value && !validateEmail(value)) {
                isValid = false;
                message = 'メールアドレスの形式が正しくありません';
            }
            break;
        case 'tel':
            if (value && !validatePhone(value)) {
                isValid = false;
                message = '電話番号の形式が正しくありません';
            }
            break;
    }
    
    // エラー表示
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// フォーム全体検証
function validateForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// フィールドエラー表示
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#f44336';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

// フィールドエラークリア
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// フォーム送信
async function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // ローディング状態
    const originalText = showLoading(submitBtn);
    
    // フォームデータを収集
    const formData = new FormData(form);
    const data = {
        company: formData.get('company'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        service: formData.get('service'),
        employees: formData.get('employees') || '',
        industry: formData.get('industry') || '',
        timeline: formData.get('timeline') || '',
        message: formData.get('message'),
        referrer: formData.get('referrer') || '',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    try {
        // EmailJSを使用してメール送信をシミュレート
        // 実際の実装では、バックエンドAPIまたはEmailJSなどのサービスを使用
        const success = await sendEmail(data);
        
        if (success) {
            // 成功
            hideLoading(submitBtn, originalText);
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // 成功通知
            showNotification('お問い合わせを送信しました', 'success');
            
            // ページトップにスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            throw new Error('送信に失敗しました');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        hideLoading(submitBtn, originalText);
        errorMessage.classList.remove('hidden');
        
        // エラー通知
        showNotification('送信に失敗しました。直接メールでお問い合わせください。', 'error');
    }
}

// メール送信処理（シミュレーション）
async function sendEmail(data) {
    // 実際の実装では、ここでバックエンドAPIにデータを送信
    // または EmailJS, Formspree, Netlify Forms などのサービスを使用
    
    return new Promise((resolve) => {
        // シミュレーション: 2秒後に成功とする
        setTimeout(() => {
            // データをローカルストレージに保存（デモ用）
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(data);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // 実際のメール送信は以下のようなコードになります：
            /*
            // EmailJS の場合
            emailjs.send('service_id', 'template_id', {
                to_email_1: 'tetote.hashimoto@gmail.com',
                to_email_2: 'tetote.d.fukai@gmail.com',
                from_name: data.name,
                from_company: data.company,
                from_email: data.email,
                phone: data.phone,
                service: data.service,
                employees: data.employees,
                industry: data.industry,
                timeline: data.timeline,
                message: data.message,
                referrer: data.referrer,
                timestamp: data.timestamp
            }).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
            */
            
            // バックエンドAPI の場合
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(() => {
                resolve(false);
            });
            */
            
            // デモ用: 90% の確率で成功
            resolve(Math.random() > 0.1);
        }, 2000);
    });
}

// フォームリセット（管理用）
function resetForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    form.reset();
    form.style.display = 'block';
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // フィールドエラーをクリア
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        clearFieldError(input);
    });
}

// 入力アシスト機能
function setupInputAssist() {
    // 会社名入力時の提案
    const companyInput = document.getElementById('company');
    if (companyInput) {
        companyInput.addEventListener('input', function() {
            // 株式会社、有限会社の自動補完提案などを実装可能
        });
    }
    
    // 電話番号自動フォーマット
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                // 03-1234-5678 形式にフォーマット
                if (value.startsWith('03') || value.startsWith('06')) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                } else {
                    value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                }
            }
            this.value = value;
        });
    }
}

// 初期化時に入力アシストを設定
document.addEventListener('DOMContentLoaded', function() {
    setupInputAssist();
});

// デバッグ用（開発時のみ使用）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.resetContactForm = resetForm;
    window.getSubmissions = function() {
        return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    };
}
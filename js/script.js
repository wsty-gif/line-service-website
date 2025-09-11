// スムーススクロール
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションメニューのトグル
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.section, .feature-card, .pricing-card, .problem-category');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// チャット機能
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [
            {
                type: 'bot',
                content: 'こんにちは！LINE公式アカウント導入についてご質問がございましたら、お気軽にお聞かせください。',
                timestamp: new Date()
            }
        ];
        this.init();
    }

    init() {
        this.createChatElements();
        this.bindEvents();
        this.renderMessages();
    }

    createChatElements() {
        // チャットボタン
        const chatButton = document.createElement('div');
        chatButton.className = 'chat-button';
        chatButton.innerHTML = '💬';
        chatButton.id = 'chatButton';
        document.body.appendChild(chatButton);

        // チャットウィジェット
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.id = 'chatWidget';
        chatWidget.innerHTML = `
            <div class="chat-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>LINE導入サポート</span>
                    <span id="closeChatBtn" style="cursor: pointer; font-size: 1.2rem;">&times;</span>
                </div>
            </div>
            <div class="chat-content" id="chatContent">
                <!-- メッセージがここに表示されます -->
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="メッセージを入力...">
                <button id="sendChatBtn" style="display: none;">送信</button>
            </div>
        `;
        document.body.appendChild(chatWidget);
    }

    bindEvents() {
        const chatButton = document.getElementById('chatButton');
        const chatWidget = document.getElementById('chatWidget');
        const closeChatBtn = document.getElementById('closeChatBtn');
        const chatInput = document.getElementById('chatInput');
        const sendChatBtn = document.getElementById('sendChatBtn');

        chatButton.addEventListener('click', () => this.toggleChat());
        closeChatBtn.addEventListener('click', () => this.closeChat());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        if (sendChatBtn) {
            sendChatBtn.addEventListener('click', () => this.sendMessage());
        }
    }

    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWidget = document.getElementById('chatWidget');
        chatWidget.style.display = 'flex';
        this.isOpen = true;
    }

    closeChat() {
        const chatWidget = document.getElementById('chatWidget');
        chatWidget.style.display = 'none';
        this.isOpen = false;
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
            // ユーザーメッセージを追加
            this.messages.push({
                type: 'user',
                content: message,
                timestamp: new Date()
            });

            chatInput.value = '';
            this.renderMessages();

            // ボットの返答を生成
            setTimeout(() => {
                const botResponse = this.generateBotResponse(message);
                this.messages.push({
                    type: 'bot',
                    content: botResponse,
                    timestamp: new Date()
                });
                this.renderMessages();
            }, 1000);
        }
    }

    generateBotResponse(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        // キーワードに基づく応答
        if (lowercaseMessage.includes('料金') || lowercaseMessage.includes('価格') || lowercaseMessage.includes('費用')) {
            return '料金についてお問い合わせいただき、ありがとうございます。<br><br>集客用プランは月額4,980円〜、バックオフィス用プランは月額29,800円〜となっております。詳しい料金表は各サービスページでご確認いただけます。<br><br>お客様のご状況に応じた最適なプランをご提案させていただきますので、お問い合わせフォームからご連絡ください。';
        }
        
        if (lowercaseMessage.includes('集客') || lowercaseMessage.includes('マーケティング')) {
            return '集客用LINE公式アカウントについてお聞かせいただき、ありがとうございます。<br><br>私たちの集客用サービスでは、リッチメニューの完全オーダーメイド制作、配信代行、分析レポートなどを通じて、お客様との関係性を深めるお手伝いをいたします。<br><br>詳細は「集客用サービス」ページをご覧ください。';
        }
        
        if (lowercaseMessage.includes('業務') || lowercaseMessage.includes('効率') || lowercaseMessage.includes('マニュアル') || lowercaseMessage.includes('バックオフィス')) {
            return 'バックオフィス用LINE公式アカウントについてお問い合わせいただき、ありがとうございます。<br><br>社内の業務マニュアルのデジタル化、FAQチャットボット構築、多言語対応など、業務効率化を実現します。<br><br>詳しくは「バックオフィス用サービス」ページをご確認ください。';
        }
        
        if (lowercaseMessage.includes('研修') || lowercaseMessage.includes('内製') || lowercaseMessage.includes('自社')) {
            return '研修サービスについてお問い合わせいただき、ありがとうございます。<br><br>LINE運用を内製化したい企業様向けに、12時間の実践的な研修プログラムをご用意しております。リスキリング補助金の対象で、実質負担額は100,000円となります。<br><br>詳細は「研修サービス」ページでご確認ください。';
        }
        
        if (lowercaseMessage.includes('問い合わせ') || lowercaseMessage.includes('相談') || lowercaseMessage.includes('連絡')) {
            return 'お問い合わせをご希望でしたら、「お問い合わせ」ページのフォームからご連絡ください。<br><br>お客様のご状況をお聞かせいただければ、最適なプランをご提案させていただきます。<br><br>初回のご相談は無料ですので、お気軽にお声がけください。';
        }

        if (lowercaseMessage.includes('こんにちは') || lowercaseMessage.includes('はじめまして')) {
            return 'こんにちは！ご訪問いただきありがとうございます。<br><br>私たちは公式LINEアカウントを活用した集客支援と業務効率化を専門としております。<br><br>ご質問やご相談がございましたら、お気軽にお聞かせください。どのようなことでお困りでしょうか？';
        }

        // デフォルトの応答
        const defaultResponses = [
            'ご質問いただき、ありがとうございます。<br><br>より詳しくご案内するために、お問い合わせフォームからご連絡いただけますでしょうか？担当者より折り返しご連絡させていただきます。',
            'お問い合わせいただき、ありがとうございます。<br><br>お客様のご状況に応じて最適なプランをご提案いたします。まずは無料相談をご利用ください。',
            'ご不明な点がございましたら、お問い合わせページからお気軽にご連絡ください。<br><br>専門スタッフが丁寧にサポートいたします。'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    renderMessages() {
        const chatContent = document.getElementById('chatContent');
        chatContent.innerHTML = '';

        this.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin-bottom: 1rem;
                padding: 0.8rem;
                border-radius: 10px;
                max-width: 80%;
                ${message.type === 'user' ? 
                    'background: #1976D2; color: white; margin-left: auto; text-align: right;' : 
                    'background: #f0f0f0; color: #333; margin-right: auto;'
                }
            `;
            messageDiv.innerHTML = message.content;
            chatContent.appendChild(messageDiv);
        });

        // スクロールを最下部に
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}

// フォーム送信処理
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // ローディング表示
        submitBtn.innerHTML = '<span class="loading"></span> 送信中...';
        submitBtn.disabled = true;

        try {
            // フォームデータを収集
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // メール送信をシミュレート（実際の実装では適切なバックエンドAPIを呼び出す）
            await this.sendEmail(data);
            
            // 成功メッセージ
            this.showMessage('お問い合わせを受け付けました。担当者より2営業日以内にご連絡いたします。', 'success');
            form.reset();
            
        } catch (error) {
            // エラーメッセージ
            this.showMessage('送信に失敗しました。お手数ですが、再度お試しください。', 'error');
        } finally {
            // ボタンを元に戻す
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    async sendEmail(data) {
        // 実際の実装では、ここでバックエンドAPIを呼び出してメールを送信
        // 現在はシミュレーション
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // ここで実際にはtetote.hashimoto@gmail.comとtetote.d.fukai@gmail.comにメールを送信
                console.log('送信されるデータ:', data);
                console.log('送信先: tetote.hashimoto@gmail.com, tetote.d.fukai@gmail.com');
                resolve();
            }, 2000);
        });
    }

    showMessage(message, type) {
        // 既存のメッセージを削除
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 新しいメッセージを作成
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-weight: bold;
            ${type === 'success' ? 
                'background: #E8F5E8; color: #2E7D32; border: 1px solid #4CAF50;' : 
                'background: #FFEBEE; color: #C62828; border: 1px solid #F44336;'
            }
        `;
        messageDiv.textContent = message;

        // フォームの前に挿入
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageDiv, form);

        // 3秒後に自動削除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// ページロード時に初期化
document.addEventListener('DOMContentLoaded', function() {
    // チャット機能を初期化
    new ChatWidget();
    
    // お問い合わせフォーム機能を初期化
    new ContactForm();
});
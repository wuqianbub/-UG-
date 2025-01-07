document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 设置初始状态
    gsap.set('.work-card', { opacity: 0, y: 100 });
    gsap.set('.tag', { opacity: 0, y: 30 });
    gsap.set('.work-header h1', { opacity: 0, y: 50 });

    // 页面加载动画
    const tl = gsap.timeline({
        defaults: {
            ease: 'power3.out'
        }
    });
    
    // 标题动画
    tl.to('.tag', {
        opacity: 1,
        y: 0,
        duration: 0.8
    })
    .to('.work-header h1', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=0.4')
    .to('.work-card', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2
    }, '-=0.6');

    // 头像组动画
    gsap.from('.avatar-group img', {
        scrollTrigger: {
            trigger: '.avatar-group',
            start: 'top center+=200'
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // 名称标签动画
    gsap.from('.name-tag', {
        scrollTrigger: {
            trigger: '.name-tags',
            start: 'top center+=200'
        },
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // 高亮文字动画
    const highlightText = document.querySelector('.highlight-text');
    if (highlightText) {
        const words = highlightText.children;
        gsap.from(words, {
            scrollTrigger: {
                trigger: highlightText,
                start: 'top center+=200'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    // 聊天预览动画
    const chatPreview = document.querySelector('.chat-preview');
    if (chatPreview) {
        gsap.from(chatPreview, {
            scrollTrigger: {
                trigger: chatPreview,
                start: 'top center+=200'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // 反应表情动画
        gsap.from('.reaction', {
            scrollTrigger: {
                trigger: '.reactions',
                start: 'top center+=200'
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    }

    // 卡片悬停效果
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // 创建自定义光标元素
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `<img src="images/light/光标1.png" alt="cursor">`;
    document.body.appendChild(cursor);

    // 监听卡片的鼠标事件
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            // 立即更新光标位置
            const e = window.event;
            if (e) {
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });

        card.addEventListener('mousemove', (e) => {
            // 直接使用鼠标位置，不需要偏移
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });

    // 移除全局的mousemove事件监听
    document.removeEventListener('mousemove', () => {});

    // 更新表情点击效果
    document.querySelectorAll('.reaction').forEach(reaction => {
        let lastClickTime = 0;  // 用于控制点击频率
        const CLICK_DELAY = 300;  // 点击间隔时间（毫秒）

        reaction.addEventListener('click', (e) => {
            const now = Date.now();
            // 检查是否可以创建新的表情
            if (now - lastClickTime < CLICK_DELAY) {
                return;  // 如果点击太频繁，直接返回
            }
            lastClickTime = now;

            // 创建浮动表情
            const emoji = document.createElement('div');
            emoji.className = 'emoji-float';
            const emojiImg = reaction.querySelector('img').cloneNode(true);
            emoji.appendChild(emojiImg);
            
            // 较小的随机偏移
            const randomX = (Math.random() - 0.5) * 20;  // 减小随机范围
            
            emoji.style.left = `calc(50% + ${randomX}px)`;
            emoji.style.top = '0';
            
            reaction.appendChild(emoji);
            
            emoji.addEventListener('animationend', () => {
                emoji.remove();
            });
        });
    });
}); 
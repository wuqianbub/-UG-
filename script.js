document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.arrow.prev');
    const nextBtn = document.querySelector('.arrow.next');
    let currentSlide = 0;
    let isAnimating = false;

    // 初始化 GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 切换幻灯片函数
    function goToSlide(index) {
        if (isAnimating || currentSlide === index) return;
        isAnimating = true;

        // 更新导航状态
        dots[currentSlide].classList.remove('active');
        dots[index].classList.add('active');

        // 获取当前和目标幻灯片
        const currentSlideEl = slides[currentSlide];
        const nextSlideEl = slides[index];
        
        // 确定滑动方向
        const direction = index > currentSlide ? 1 : -1;

        // 重置所有幻灯片状态
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
            slide.style.zIndex = '0';
            slide.style.opacity = '0';
            slide.style.transform = direction > 0 ? 
                'perspective(1000px) rotateY(10deg) translateX(100px)' :
                'perspective(1000px) rotateY(-10deg) translateX(-100px)';
        });

        // 设置过渡效果
        currentSlideEl.style.zIndex = '2';
        nextSlideEl.style.zIndex = '1';

        // 添加过渡类
        requestAnimationFrame(() => {
            nextSlideEl.classList.add('active');
            nextSlideEl.style.opacity = '1';
            nextSlideEl.style.transform = 'perspective(1000px) rotateY(0) translateX(0)';

            if (direction > 0) {
                currentSlideEl.style.transform = 'perspective(1000px) rotateY(-10deg) translateX(-100px)';
            } else {
                currentSlideEl.style.transform = 'perspective(1000px) rotateY(10deg) translateX(100px)';
            }
            currentSlideEl.style.opacity = '0';
        });

        // 过渡完成后清理
        setTimeout(() => {
            isAnimating = false;
            currentSlide = index;
        }, 800);
    }

    // 更新自动播放逻辑
    function startAutoplay() {
        return setInterval(() => {
            if (!isAnimating) {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }
        }, 5000);
    }

    let autoplayInterval = startAutoplay();

    // 更新事件监听器
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                clearInterval(autoplayInterval);
                goToSlide(index);
                autoplayInterval = startAutoplay();
            }
        });
    });

    prevBtn.addEventListener('click', () => {
        if (!isAnimating) {
            clearInterval(autoplayInterval);
            const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevSlide);
            autoplayInterval = startAutoplay();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (!isAnimating) {
            clearInterval(autoplayInterval);
            const nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
            autoplayInterval = startAutoplay();
        }
    });

    // 页面加载动画
    const tl = gsap.timeline();

    tl.from('.navbar', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero-text h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-text p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.7')
    .from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.slider-container', {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.slider-nav', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.6');

    const button = document.querySelector('.cta-button');

    button.addEventListener('click', function(e) {
        // 创建临时涟漪元素
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        // 动画结束后移除涟漪元素
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
        
        // 添加动画
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        // 修改：滚动到团队部分而不是work部分
        const teamSection = document.querySelector('.team-section');
        if (teamSection) {
            teamSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // 添加鼠标滑动检测
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.slider-container').addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });

    document.querySelector('.slider-container').addEventListener('touchmove', e => {
        touchEndX = e.touches[0].clientX;
    });

    document.querySelector('.slider-container').addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) { // 最小滑动距离
            if (swipeDistance > 0) {
                // 向右滑动，显示上一张
                const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
                goToSlide(prevSlide);
            } else {
                // 向左滑动，显示下一张
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }
        }
    });

    const teamSlides = document.querySelectorAll('.team-slide');
    const teamDots = document.querySelectorAll('.team-dot');
    const teamPrevBtn = document.querySelector('.team-arrow.prev');
    const teamNextBtn = document.querySelector('.team-arrow.next');
    let currentTeamSlide = 0;
    let isTeamAnimating = false;

    function switchTeamSlide(index) {
        if (isTeamAnimating || currentTeamSlide === index) return;
        isTeamAnimating = true;

        // 更新导航状态
        teamDots[currentTeamSlide].classList.remove('active');
        teamDots[index].classList.add('active');

        // 获取当前和目标幻灯片
        const currentSlide = teamSlides[currentTeamSlide];
        const nextSlide = teamSlides[index];

        // 显示下一页
        nextSlide.style.display = 'block';

        // 添加过渡动画
        gsap.to(currentSlide, {
            opacity: 0,
            y: index > currentTeamSlide ? -50 : 50,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                currentSlide.style.display = 'none';
            }
        });

        gsap.fromTo(nextSlide, 
            {
                opacity: 0,
                y: index > currentTeamSlide ? 50 : -50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    isTeamAnimating = false;
                }
            }
        );

        currentTeamSlide = index;
    }

    // 添加事件监听
    teamDots.forEach((dot, index) => {
        dot.addEventListener('click', () => switchTeamSlide(index));
    });

    teamPrevBtn?.addEventListener('click', () => {
        const prevSlide = (currentTeamSlide - 1 + teamSlides.length) % teamSlides.length;
        switchTeamSlide(prevSlide);
    });

    teamNextBtn?.addEventListener('click', () => {
        const nextSlide = (currentTeamSlide + 1) % teamSlides.length;
        switchTeamSlide(nextSlide);
    });

    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    gsap.from('.team-card', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });

    // 添加鼠标滑动检测
    let teamTouchStartX = 0;
    let teamTouchEndX = 0;

    document.querySelector('.team-section').addEventListener('touchstart', e => {
        teamTouchStartX = e.touches[0].clientX;
    });

    document.querySelector('.team-section').addEventListener('touchmove', e => {
        teamTouchEndX = e.touches[0].clientX;
    });

    document.querySelector('.team-section').addEventListener('touchend', () => {
        const swipeDistance = teamTouchEndX - teamTouchStartX;
        if (Math.abs(swipeDistance) > 50) { // 最小滑动距离
            if (swipeDistance > 0) {
                // 向右滑动，显示上一页
                const prevSlide = (currentTeamSlide - 1 + teamSlides.length) % teamSlides.length;
                switchTeamSlide(prevSlide);
            } else {
                // 向左滑动，显示下一页
                const nextSlide = (currentTeamSlide + 1) % teamSlides.length;
                switchTeamSlide(nextSlide);
            }
        }
    });

    // 移除之前的滚轮事件监听器
    document.querySelector('.team-section').removeEventListener('wheel', () => {});

    // 游戏逻辑
    function initGame() {
        const startBtn = document.querySelector('.start-game');
        const gameContainer = document.querySelector('.game-container');
        const gameArea = document.querySelector('.game-area');
        const timer = document.querySelector('.timer');
        const ball = document.querySelector('.ball');
        const scores = document.querySelectorAll('.score');
        const players = document.querySelectorAll('.player');
        let gameActive = false;
        let timeLeft = 10;
        let playerScores = [0, 0];
        let selectedPlayer = null;
        let clickCounts = [0, 0]; // 记录每个玩家的点击次数
        let timerInterval;
        let canClick = true;  // 添加点击控制变量

        // 角色选择
        players.forEach((player, index) => {
            player.addEventListener('click', () => {
                if (!gameActive) {
                    players.forEach(p => p.classList.remove('selected'));
                    player.classList.add('selected');
                    selectedPlayer = index;
                }
            });
        });

        function startGame() {
            if (gameActive || selectedPlayer === null) return;
            gameActive = true;
            canClick = true;  // 开始时允许点击
            timeLeft = 10;
            playerScores = [0, 0];
            clickCounts = [0, 0];
            scores.forEach(score => score.textContent = '0');
            startBtn.style.display = 'none';
            gameArea.classList.add('active');
            gameContainer.classList.add('game-active');
            
            timerInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    canClick = false;  // 时间到后禁止点击
                    finalShot();
                    endGame();
                    return;
                }
                timeLeft--;
                timer.textContent = timeLeft;
            }, 1000);
        }

        // 更新点击事件处理
        ball.addEventListener('click', (e) => {
            if (!gameActive || !canClick) return;  // 检查是否可以点击
            clickCounts[selectedPlayer]++;
            
            // 添加点击动画类
            ball.classList.add('clicked');
            setTimeout(() => ball.classList.remove('clicked'), 300);
            
            // 显示点击效果
            showClickEffect(e);
            // 显示点击次数
            showClickCount(clickCounts[selectedPlayer]);
            // 显示波纹效果
            createRipple(e);
            // 更新力度指示器
            updatePowerIndicator();
        });

        // 显示点击效果
        function showClickEffect(e) {
            const rect = ball.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            effect.style.left = `${x}px`;
            effect.style.top = `${y}px`;
            ball.appendChild(effect);
            
            setTimeout(() => effect.remove(), 500);
        }

        // 显示点击次数
        function showClickCount(count) {
            const countElement = document.createElement('div');
            countElement.className = 'click-count';
            countElement.textContent = `x${count}`;
            countElement.style.left = '50%';
            countElement.style.bottom = '100%';
            ball.appendChild(countElement);
            
            setTimeout(() => countElement.remove(), 1000);
        }

        // 创建波纹效果
        function createRipple(e) {
            const rect = ball.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            const rippleContainer = ball.querySelector('.ripple-container') || 
                (() => {
                    const container = document.createElement('div');
                    container.className = 'ripple-container';
                    ball.appendChild(container);
                    return container;
                })();
                
            rippleContainer.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        }

        // 更新力度指示器
        function updatePowerIndicator() {
            const totalClicks = clickCounts[0] + clickCounts[1];
            if (totalClicks === 0) return;
            
            const percentage = (clickCounts[selectedPlayer] / totalClicks) * 100;
            const indicator = document.querySelector('.power-indicator');
            indicator.style.height = `${percentage}%`;
            
            // 根据点击占比改变颜色
            if (percentage > 60) {
                indicator.style.backgroundColor = '#44ff44';
            } else if (percentage > 40) {
                indicator.style.backgroundColor = '#ffaa44';
            } else {
                indicator.style.backgroundColor = '#ff4444';
            }
        }

        // 最后一投
        function finalShot() {
            const winner = clickCounts[0] > clickCounts[1] ? 0 : 
                          clickCounts[1] > clickCounts[0] ? 1 : 
                          Math.random() < 0.5 ? 0 : 1;  // 点击次数相同时随机选择
            
            // 计算投篮动画参数
            const height = -300;  // 投篮高度
            const duration = 1000;  // 动画持续时间
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    // 动画结束，更新分数
                    playerScores[winner]++;
                    scores[winner].textContent = playerScores[winner];
                    playScoreAnimation();
                    return;
                }
                
                // 计算抛物线轨迹
                const y = height * Math.sin(progress * Math.PI);
                const rotation = progress * 360 * 2;
                
                ball.style.transform = `translate(-50%, ${y}px) rotate(${rotation}deg)`;
                requestAnimationFrame(animate);
            }
            
            // 开始投篮动画
            ball.style.transition = 'none';
            animate();
        }

        // 进球特效
        function playScoreAnimation() {
            const scoreEffect = document.createElement('div');
            scoreEffect.className = 'score-effect';
            scoreEffect.textContent = '+1';
            gameArea.appendChild(scoreEffect);
            
            setTimeout(() => scoreEffect.remove(), 1000);
        }

        function endGame() {
            gameActive = false;
            canClick = false;  // 确保游戏结束后不能点击
            clearInterval(timerInterval);
            
            // 延迟显示结果，等待最后一投完成
            setTimeout(() => {
                gameArea.classList.remove('active');
                gameContainer.classList.remove('game-active');
                startBtn.style.display = 'block';
                
                const winner = playerScores[0] > playerScores[1] ? '泡泡' : 
                              playerScores[0] < playerScores[1] ? '明慧' : '平局';
                
                if (winner !== '平局') {
                    alert(`游戏结束！${winner} 获得手速王称号！\n点击次数：泡泡 ${clickCounts[0]} vs ${clickCounts[1]} 明慧`);
                } else {
                    alert(`游戏结束！平局！\n点击次数：泡泡 ${clickCounts[0]} vs ${clickCounts[1]} 明慧`);
                }
            }, 1500);  // 等待投篮动画完成
        }

        startBtn.addEventListener('click', startGame);
    }

    // 直接在主 DOMContentLoaded 事件处理程序的末尾调用 initGame
    initGame();

    // 添加数字增长动画
    function animateNumbers() {
        const numbers = document.querySelectorAll('.data-number');
        
        numbers.forEach(number => {
            const targetValue = parseInt(number.dataset.value);
            const duration = 1500; // 动画持续时间（毫秒）
            const steps = 60; // 动画步数
            const stepValue = targetValue / steps;
            let currentValue = 0;
            let currentStep = 0;
            
            const interval = setInterval(() => {
                currentStep++;
                currentValue = Math.min(Math.round(stepValue * currentStep), targetValue);
                number.textContent = currentValue;
                
                if (currentStep >= steps) {
                    clearInterval(interval);
                }
            }, duration / steps);
        });
    }

    // 监听卡片悬停事件
    document.querySelector('.design-card').addEventListener('mouseenter', animateNumbers);

    // Banner 视差滚动效果
    const bannerImage = document.querySelector('.banner-image');
    const bannerContent = document.querySelector('.banner-content');
    
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bannerSection = document.querySelector('.banner-section');
        const sectionTop = bannerSection.offsetTop;
        const sectionHeight = bannerSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // 检查是否在可视区域内
        if (scrolled + windowHeight > sectionTop && 
            scrolled < sectionTop + sectionHeight) {
            
            // 计算滚动进度 (0 到 1)
            const progress = Math.min(
                Math.max(
                    (scrolled + windowHeight - sectionTop) / (sectionHeight + windowHeight),
                    0
                ),
                1
            );
            
            // 计算旋转角度（从45度到0度）
            const rotation = 45 * (1 - progress);
            
            // 计算上移距离（从-33vh到0）
            const translateY = -33 * (1 - progress);
            
            // 应用变换
            bannerImage.style.transform = `
                perspective(1000px) 
                rotateX(${rotation}deg) 
                translateY(${translateY}vh)
            `;
            
            // 添加内容动画
            if (progress > 0.5) {
                gsap.to(bannerContent.children, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            }
        }
    });

    // 添加滚动视差效果
    function handleParallax() {
        const card = document.querySelector('.design-card:last-child');
        const parallaxImage = card.querySelector('.parallax-image');
        const cardRect = card.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - cardRect.top) / (window.innerHeight + cardRect.height);
        
        if (scrollProgress > 0 && scrollProgress < 1) {
            const rotation = 45 * (1 - scrollProgress);
            const translateY = -33 * (1 - scrollProgress);
            parallaxImage.style.transform = `
                perspective(1000px) 
                rotateX(${rotation}deg) 
                translateY(${translateY}%)
            `;
        }
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleParallax);
}); 
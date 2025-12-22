// slider.js - 轮播图功能（增强版）
document.addEventListener('DOMContentLoaded', function() {
    console.log('轮播图脚本加载...');
    
    function initSlider() {
        const slider = document.querySelector('.banner-slider');
        
        if (!slider) {
            console.error('未找到轮播图容器 (.banner-slider)');
            return null;
        }
        
        const items = slider.querySelectorAll('.slider-item');
        const dots = slider.querySelectorAll('.dot');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const progressBar = slider.querySelector('.progress-bar');
        
        console.log('轮播图元素:', {
            slider: slider,
            items: items.length,
            dots: dots.length,
            prevBtn: prevBtn,
            nextBtn: nextBtn,
            progressBar: progressBar
        });
        
        if (items.length === 0) {
            console.error('未找到轮播图项 (.slider-item)');
            return null;
        }
        
        let currentIndex = 0;
        let autoPlayInterval;
        let progressInterval;
        const slideInterval = 5000; // 5秒切换
        
        // 初始化
        function init() {
            console.log('初始化轮播图，共', items.length, '个幻灯片');
            
            // 显示第一张
            showSlide(currentIndex);
            
            // 开始自动播放
            startAutoPlay();
            
            // 绑定事件
            bindEvents();
            
            console.log('轮播图初始化完成');
        }
        
        // 显示指定索引的幻灯片
        function showSlide(index) {
            console.log('显示幻灯片:', index);
            
            // 隐藏所有幻灯片
            items.forEach(item => {
                item.classList.remove('active');
                item.style.opacity = 0;
            });
            
            // 更新指示点
            dots.forEach(dot => dot.classList.remove('active'));
            
            // 显示当前幻灯片
            items[index].classList.add('active');
            items[index].style.opacity = 1;
            
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            // 重置进度条
            resetProgressBar();
            
            currentIndex = index;
        }
        
        // 切换到下一张
        function nextSlide() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) {
                nextIndex = 0;
            }
            console.log('下一张幻灯片:', nextIndex);
            showSlide(nextIndex);
        }
        
        // 切换到上一张
        function prevSlide() {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = items.length - 1;
            }
            console.log('上一张幻灯片:', prevIndex);
            showSlide(prevIndex);
        }
        
        // 开始自动播放
        function startAutoPlay() {
            console.log('开始自动播放');
            stopAutoPlay();
            
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, slideInterval);
            
            startProgressBar();
        }
        
        // 停止自动播放
        function stopAutoPlay() {
            console.log('停止自动播放');
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
            stopProgressBar();
        }
        
        // 开始进度条动画
        function startProgressBar() {
            if (!progressBar) {
                console.warn('未找到进度条元素');
                return;
            }
            
            console.log('开始进度条动画');
            stopProgressBar();
            
            let width = 0;
            progressBar.style.width = '0%';
            
            progressInterval = setInterval(() => {
                width += 0.2; // 每10ms增加0.2%
                if (width > 100) width = 100;
                progressBar.style.width = width + '%';
            }, 10);
        }
        
        // 停止进度条动画
        function stopProgressBar() {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        }
        
        // 重置进度条
        function resetProgressBar() {
            if (!progressBar) return;
            
            console.log('重置进度条');
            stopProgressBar();
            progressBar.style.width = '0%';
            startProgressBar();
        }
        
        // 绑定事件
        function bindEvents() {
            console.log('绑定轮播图事件');
            
            // 上一张/下一张按钮
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    console.log('点击上一张按钮');
                    prevSlide();
                    startAutoPlay();
                });
            } else {
                console.warn('未找到上一张按钮 (.prev-btn)');
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    console.log('点击下一张按钮');
                    nextSlide();
                    startAutoPlay();
                });
            } else {
                console.warn('未找到下一张按钮 (.next-btn)');
            }
            
            // 指示点点击
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    console.log('点击指示点:', index);
                    showSlide(index);
                    startAutoPlay();
                });
            });
            
            // 鼠标悬停时暂停自动播放
            slider.addEventListener('mouseenter', () => {
                console.log('鼠标进入，暂停自动播放');
                stopAutoPlay();
            });
            
            slider.addEventListener('mouseleave', () => {
                console.log('鼠标离开，恢复自动播放');
                startAutoPlay();
            });
            
            // 触摸滑动支持
            let touchStartX = 0;
            let touchEndX = 0;
            
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        console.log('向左滑动，显示下一张');
                        nextSlide();
                    } else {
                        console.log('向右滑动，显示上一张');
                        prevSlide();
                    }
                    startAutoPlay();
                }
            }
            
            // 键盘控制
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.tagName === 'INPUT') return;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        console.log('按左箭头键');
                        prevSlide();
                        startAutoPlay();
                        break;
                    case 'ArrowRight':
                        console.log('按右箭头键');
                        nextSlide();
                        startAutoPlay();
                        break;
                }
            });
        }
        
        // 初始化轮播图
        init();
        
        // 公开方法
        return {
            next: nextSlide,
            prev: prevSlide,
            goTo: showSlide,
            start: startAutoPlay,
            stop: stopAutoPlay,
            getCurrentIndex: () => currentIndex
        };
    }
    
    // 初始化轮播图（延迟一点确保DOM完全加载）
    setTimeout(() => {
        const slider = initSlider();
        
        if (slider) {
            console.log('轮播图初始化成功！');
            // 将slider对象暴露给全局，方便调试
            window.bannerSlider = slider;
        } else {
            console.error('轮播图初始化失败！');
        }
    }, 500);
});


// search-common.js - 通用的搜索功能
function initCommonSearch() {
    console.log('初始化通用搜索功能');
    
    // 获取搜索框元素
    const searchInput = document.querySelector('.search-bar');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput) {
        console.warn('未找到搜索框元素');
        return;
    }
    
    // 添加搜索按钮（如果不存在）
    if (!searchBtn && searchInput.parentElement) {
        const searchWrapper = searchInput.parentElement;
        const newSearchBtn = document.createElement('button');
        newSearchBtn.innerHTML = '🔍';
        newSearchBtn.className = 'search-btn';
        newSearchBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #5EB69C;
            z-index: 2;
        `;
        
        searchWrapper.style.position = 'relative';
        searchWrapper.appendChild(newSearchBtn);
        
        // 绑定搜索按钮事件
        newSearchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                performCommonSearch(query);
            }
        });
    }
    
    // 绑定回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                performCommonSearch(query);
            }
        }
    });
    
    console.log('通用搜索功能初始化完成');
}

// 执行搜索
function performCommonSearch(query) {
    console.log('执行搜索:', query);
    
    // 保存搜索历史
    saveSearchHistory(query);
    
    // 显示搜索结果
    // 这里可以有两种处理方式：
    // 1. 跳转到首页并显示搜索结果
    // 2. 在当前页面显示搜索结果
    
    // 方式1：跳转到首页并传递搜索参数
    if (window.location.pathname.includes('index.html')) {
        // 如果在首页，直接触发搜索
        if (typeof performSearch === 'function') {
            performSearch(query);
        }
    } else {
        // 如果在其他页面，跳转到首页并搜索
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
}

// 保存搜索历史
function saveSearchHistory(query) {
    try {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        // 移除重复项
        history = history.filter(item => item !== query);
        // 添加到前面
        history.unshift(query);
        // 只保留10个
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (e) {
        console.error('保存搜索历史失败:', e);
    }
}

// 页面加载后初始化搜索
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCommonSearch, 100);
    
    // 如果有搜索参数，自动搜索
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        setTimeout(() => {
            performCommonSearch(searchQuery);
        }, 500);
    }
});


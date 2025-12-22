// 检查是否已经加载了通用搜索
if (typeof initCommonSearch !== 'function') {
    // 如果没加载，添加一个占位函数
    window.initCommonSearch = function() {
        console.log('通用搜索未加载，使用本地搜索');
    };
}

// 如果首页有搜索参数，自动搜索
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && document.querySelector('.search-bar')) {
        setTimeout(() => {
            document.querySelector('.search-bar').value = searchQuery;
            if (typeof performSearch === 'function') {
                performSearch(searchQuery);
            }
        }, 500);
    }
});

//搜索功能实现
// search.js - 搜索结果居中显示版本
document.addEventListener('DOMContentLoaded', function () {
    console.log('搜索脚本已加载');

    // 等待DOM完全加载
    setTimeout(initSearch, 100);

    function initSearch() {
        console.log('初始化搜索功能');

        // 获取DOM元素
        const searchInput = document.querySelector('.search-bar');
        const searchModal = document.getElementById('search-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const closeModalBtn = document.getElementById('close-search-modal');
        const searchSuggestions = document.getElementById('search-suggestions');
        const resultsContainer = document.getElementById('results-container');
        const noResultsDiv = document.getElementById('no-results');
        const searchQueryText = document.getElementById('search-query-text');
        const searchHistoryDiv = document.getElementById('search-history');
        const historyList = document.getElementById('history-list');

        // 检查必要元素
        if (!searchInput) {
            console.error('搜索框元素未找到');
            return;
        }

        // 添加搜索按钮到搜索框
        const searchWrapper = searchInput.parentElement;
        const searchBtn = document.createElement('button');
        searchBtn.innerHTML = '🔍';
        searchBtn.className = 'search-btn';
        searchBtn.style.cssText = `
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
        searchWrapper.appendChild(searchBtn);

        // 预定义的搜索建议
        const suggestions = ['口罩', '水果', '沙发', '普洱茶', '服装', '生鲜', '美食', '家居'];

        // 更新搜索建议内容
        function updateSuggestions() {
            if (!searchSuggestions) return;

            searchSuggestions.innerHTML = `
                <div class="suggestions-header">
                    <span>热门搜索</span>
                    <button id="clear-history" class="clear-history-btn">清空历史</button>
                </div>
                <div class="suggestions-list">
                    ${suggestions.map(item => `
                        <a href="javascript:void(0)" class="suggestion-item" data-search="${item}">${item}</a>
                    `).join('')}
                </div>
            `;

            // 重新绑定事件
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function () {
                    const query = this.dataset.search;
                    searchInput.value = query;
                    performSearch(query);
                    hideSearchSuggestions();
                });
            });

            const clearHistoryBtn = document.getElementById('clear-history');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    localStorage.removeItem('searchHistory');
                    alert('搜索历史已清空');
                    updateSearchHistory();
                });
            }
        }

        // 初始化搜索建议
        updateSuggestions();

        // 显示搜索建议
        function showSearchSuggestions() {
            if (searchSuggestions) {
                const searchRect = searchInput.getBoundingClientRect();
                searchSuggestions.style.top = (searchRect.bottom + window.scrollY) + 'px';
                searchSuggestions.style.left = (searchRect.left + window.scrollX) + 'px';
                searchSuggestions.style.width = searchRect.width + 'px';
                searchSuggestions.style.display = 'block';
            }
        }

        // 隐藏搜索建议
        function hideSearchSuggestions() {
            if (searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
        }

        // 显示搜索模态框
        function showSearchModal() {
            if (searchModal) {
                searchModal.style.display = 'block';
                // 防止背景滚动
                document.body.style.overflow = 'hidden';
            }
        }

        // 隐藏搜索模态框
        function hideSearchModal() {
            if (searchModal) {
                searchModal.style.display = 'none';
                // 恢复背景滚动
                document.body.style.overflow = 'auto';
            }
        }

        // 更新搜索结果
        function updateSearchResults(query, results) {
            // 更新搜索关键词
            if (searchQueryText) {
                searchQueryText.textContent = query;
            }

            // 显示或隐藏无结果提示
            if (noResultsDiv) {
                if (results.length === 0) {
                    noResultsDiv.style.display = 'block';
                    if (resultsContainer) {
                        resultsContainer.innerHTML = '';
                    }
                } else {
                    noResultsDiv.style.display = 'none';
                }
            }

            // 更新结果列表
            if (resultsContainer) {
                let resultsHTML = '';

                if (results.length > 0) {
                    resultsHTML = `
                <div class="search-summary">
                    找到 ${results.length} 个与"${query}"相关的商品
                </div>
                <div class="search-results-grid">
                    ${results.map((product, index) => `
                        <div class="search-result-card product-card" data-id="${index}" data-product-id="${product.id}">
                            <div class="search-result-img">
                                <img src="${product.image}" alt="${product.name}" 
                                     onerror="this.src='https://via.placeholder.com/250x180?text=${encodeURIComponent(product.name)}'">
                            </div>
                            <div class="search-result-info">
                                <h3 class="search-result-title">${product.name}</h3>
                                <div class="search-result-category">${product.category}</div>
                                <div class="search-result-price">${product.price}</div>
                                <div class="product-action">
                                    <button class="view-product-btn" data-product-id="${product.id}">查看详情</button>
                                    <button class="add-to-cart-btn" data-product-id="${product.id}">加入购物车</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
                }

                resultsContainer.innerHTML = resultsHTML;

                // 绑定商品卡片点击事件
                setTimeout(() => {
                    document.querySelectorAll('.search-result-card').forEach(card => {
                        card.addEventListener('click', function (e) {
                            // 如果点击的是按钮，不执行卡片点击
                            if (e.target.closest('.view-product-btn') || e.target.closest('.add-to-cart-btn')) {
                                return;
                            }

                            const productId = this.getAttribute('data-product-id');
                            if (productId) {
                                window.location.href = `product.html?id=${productId}`;
                            }
                        });
                    });

                    // 绑定查看详情按钮点击事件
                    document.querySelectorAll('.view-product-btn').forEach(btn => {
                        btn.addEventListener('click', function (e) {
                            e.stopPropagation();
                            const productId = this.getAttribute('data-product-id');
                            if (productId) {
                                window.location.href = `product.html?id=${productId}`;
                            }
                        });
                    });

                    // 绑定加入购物车按钮点击事件
                    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                        btn.addEventListener('click', function (e) {
                            e.stopPropagation();
                            const productId = this.getAttribute('data-product-id');
                            if (productId) {
                                // 调用购物车功能
                                const event = new CustomEvent('addToCart', {
                                    detail: { productId: productId }
                                });
                                window.dispatchEvent(event);
                            }
                        });
                    });
                }, 100);
            }
        }

        // 更新搜索历史
        function updateSearchHistory() {
            const history = getSearchHistory();
            if (history.length > 0 && historyList) {
                searchHistoryDiv.style.display = 'block';
                historyList.innerHTML = history.map(item => `
                    <div class="history-item" data-search="${item}">${item}</div>
                `).join('');

                // 绑定历史记录点击事件
                document.querySelectorAll('.history-item').forEach(item => {
                    item.addEventListener('click', function () {
                        const query = this.dataset.search;
                        searchInput.value = query;
                        performSearch(query);
                    });
                });
            } else if (searchHistoryDiv) {
                searchHistoryDiv.style.display = 'none';
            }
        }

        // 从页面提取商品数据
        function extractProductsFromPage() {
            const allProducts = [];

            // 1. 从新鲜好物区块提取
            document.querySelectorAll('.fresh-goods .goods-card').forEach((card, index) => {
                const nameEl = card.querySelector('.goods-name');
                const priceEl = card.querySelector('.goods-price');
                const imgEl = card.querySelector('.goods-img');

                if (nameEl && priceEl) {
                    allProducts.push({
                        id: allProducts.length + 1,
                        name: nameEl.textContent.trim(),
                        price: priceEl.textContent.trim(),
                        image: imgEl ? imgEl.src : '',
                        category: '新鲜好物'
                    });
                }
            });

            // 2. 从人气推荐区块提取
            document.querySelectorAll('.popular-recommend .goods-card').forEach((card) => {
                const nameEl = card.querySelector('.goods-name');
                const priceEl = card.querySelector('.goods-price');
                const imgEl = card.querySelector('.goods-img');

                if (nameEl && priceEl) {
                    allProducts.push({
                        id: allProducts.length + 1,
                        name: nameEl.textContent.trim(),
                        price: priceEl.textContent.trim(),
                        image: imgEl ? imgEl.src : '',
                        category: '人气推荐'
                    });
                }
            });

            // 3. 从生鲜区块提取
            document.querySelectorAll('.fresh .content .right li').forEach((item) => {
                const nameEl = item.querySelector('a');
                const priceEl = item.querySelector('span');
                const imgEl = item.querySelector('img');

                if (nameEl && priceEl && nameEl.textContent.trim()) {
                    allProducts.push({
                        id: allProducts.length + 1,
                        name: nameEl.textContent.trim().replace(/\s+/g, ' '),
                        price: priceEl.textContent.trim(),
                        image: imgEl ? imgEl.src : '',
                        category: '生鲜'
                    });
                }
            });

            console.log('页面商品总数:', allProducts.length);
            return allProducts;
        }

        // 搜索商品
        function searchProducts(query) {
            const products = extractProductsFromPage();
            const searchTerms = query.toLowerCase().trim();

            if (!searchTerms) return [];

            return products.filter(product => {
                const nameMatch = product.name.toLowerCase().includes(searchTerms);
                const categoryMatch = product.category.toLowerCase().includes(searchTerms);
                const priceMatch = product.price.toLowerCase().includes(searchTerms);

                return nameMatch || categoryMatch || priceMatch;
            });
        }

        // 执行搜索
        function performSearch(query) {
            if (!query.trim()) {
                return;
            }

            console.log('搜索关键词:', query);
            const results = searchProducts(query);
            console.log('搜索结果数:', results.length);

            // 显示模态框
            showSearchModal();

            // 更新搜索结果
            updateSearchResults(query, results);

            // 保存搜索历史
            saveSearchHistory(query);

            // 更新搜索历史显示
            updateSearchHistory();

            // 清空搜索框
            searchInput.value = '';
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

        // 获取搜索历史
        function getSearchHistory() {
            try {
                return JSON.parse(localStorage.getItem('searchHistory') || '[]');
            } catch (e) {
                console.error('获取搜索历史失败:', e);
                return [];
            }
        }

        // 事件监听
        // 搜索框焦点事件
        searchInput.addEventListener('focus', function () {
            if (!this.value.trim()) {
                showSearchSuggestions();
            }
        });

        // 搜索框输入事件
        searchInput.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length >= 1) {
                hideSearchSuggestions();
            } else {
                showSearchSuggestions();
            }
        });

        // 回车键搜索
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    hideSearchSuggestions();
                    performSearch(query);
                }
            }
        });

        // 搜索按钮点击
        searchBtn.addEventListener('click', function () {
            const query = searchInput.value.trim();
            if (query) {
                hideSearchSuggestions();
                performSearch(query);
            }
        });

        // 关闭模态框
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideSearchModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', hideSearchModal);
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchModal && searchModal.style.display === 'block') {
                hideSearchModal();
            }
        });

        // 点击页面其他区域关闭搜索建议
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) &&
                !searchBtn.contains(e.target) &&
                (!searchSuggestions || !searchSuggestions.contains(e.target))) {
                hideSearchSuggestions();
            }
        });

        // 阻止搜索建议区域的点击事件冒泡
        if (searchSuggestions) {
            searchSuggestions.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        // 初始加载搜索历史
        updateSearchHistory();

        console.log('搜索功能初始化完成');
    }
});


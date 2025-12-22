// cart-manager.js - 统一购物车管理（优化版）
console.log('加载统一购物车管理器...');

// 单例模式确保只初始化一次
if (window.CartManager && window.CartManager instanceof CartManagerClass) {
    console.log('CartManager 已存在');
} else {
    class CartManagerClass {
        constructor() {
            this.CART_KEY = 'xiaotuxian_cart';
            this.USER_KEY = 'xiaotuxian_user';
            this.productCache = new Map();
            this._initialized = false;
            this.init();
        }

        init() {
            if (this._initialized) {
                console.log('购物车管理器已初始化');
                return;
            }

            console.log('初始化购物车管理器...');

            // 等待商品数据加载
            this.waitForProductData()
                .then(() => {
                    this.addAnimationStyles();
                    this.bindGlobalEvents();
                    this.checkCartOwnership();
                    this.updateCartCount();
                    this._initialized = true;
                    console.log('购物车管理器初始化完成，商品数据已加载');
                })
                .catch(error => {
                    console.error('等待商品数据加载失败:', error);
                    // 即使失败也继续初始化
                    this.addAnimationStyles();
                    this.bindGlobalEvents();
                    this.checkCartOwnership();
                    this.updateCartCount();
                    this._initialized = true;
                    console.log('购物车管理器初始化完成（无商品数据）');
                });
        }
        // 等待商品数据加载
        waitForProductData() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 50; // 最多尝试5秒

                const check = () => {
                    attempts++;

                    // 检查全局商品数据是否可用
                    if (typeof window.getProductById === 'function' &&
                        typeof window.getAllProducts === 'function') {
                        console.log('商品数据已加载，共', window.getAllProducts().length, '个商品');
                        resolve();
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        console.warn('商品数据加载超时，将使用备用方案');
                        resolve(); // 不拒绝，让购物车继续工作
                        return;
                    }

                    setTimeout(check, 100); // 每100毫秒检查一次
                };

                check();
            });
        }
        // 轻量级商品信息获取
        getLightweightProductInfo(productId) {
            console.log('获取商品信息，ID:', productId);

            // 先从缓存获取
            if (this.productCache.has(productId)) {
                return this.productCache.get(productId);
            }

            let productInfo = null;

            // 1. 从全局商品数据获取（优先）
            if (typeof window.getProductById === 'function') {
                productInfo = window.getProductById(productId);
                if (productInfo) {
                    console.log('从全局商品数据获取到:', productInfo.name);
                    // 确保商品信息包含所需字段
                    const enhancedProduct = {
                        id: productInfo.id || parseInt(productId),
                        name: productInfo.name || `商品 ${productId}`,
                        price: productInfo.price || 99.00,
                        originalPrice: productInfo.originalPrice || (productInfo.price ? productInfo.price * 1.2 : 118.80),
                        image: productInfo.image || productInfo.images?.main || this.getDefaultImage(productId),
                        category: productInfo.category || '默认分类',
                        description: productInfo.description || '',
                        brand: productInfo.brand || '小兔鲜儿',
                        stock: productInfo.stock || 999
                    };

                    this.productCache.set(productId, enhancedProduct);
                    return enhancedProduct;
                }
            }

            // 2. 从页面元素快速获取
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                productInfo = this.extractProductFromCard(productCard, productId);
                if (productInfo) {
                    this.productCache.set(productId, productInfo);
                    return productInfo;
                }
            }

            // 3. 使用默认商品
            productInfo = this.getDefaultProduct(productId);
            this.productCache.set(productId, productInfo);

            console.log('使用默认商品信息:', productInfo);
            return productInfo;
        }

        extractProductFromCard(card, productId) {
            try {
                const nameEl = card.querySelector('.goods-name') ||
                    card.querySelector('.product-item a') ||
                    card.querySelector('a');
                const priceEl = card.querySelector('.goods-price') ||
                    card.querySelector('.product-item span') ||
                    card.querySelector('span');
                const imgEl = card.querySelector('img');

                if (!nameEl || !priceEl) return null;

                const name = nameEl.textContent.trim().split('\n')[0].slice(0, 50);
                const priceText = priceEl.textContent.replace(/[^\d.]/g, '');
                const price = parseFloat(priceText) || 0;

                return {
                    id: parseInt(productId),
                    name: name,
                    price: price,
                    originalPrice: price * 1.2, // 估算原价
                    image: imgEl ? imgEl.src : this.getDefaultImage(productId),
                    category: this.detectCategory(card)
                };
            } catch (e) {
                console.error('从卡片提取商品信息失败:', e);
                return null;
            }
        }

        getDefaultImage(productId) {
            const imageMap = {
                1: 'images/goods1.png', 2: 'images/goods2.png',
                3: 'images/goods3.png', 4: 'images/goods4.png',
                5: 'images/recommend1.png', 6: 'images/recommend2.png',
                7: 'images/recommend3.png', 8: 'images/recommend4.png',
                9: 'images/fresh1.png', 10: 'images/fresh2.png',
                17: 'images/clothes1.png', 18: 'images/clothes2.png',
                25: 'images/kitchen1.png', 26: 'images/kitchen2.png',
                33: 'images/home1.png', 34: 'images/home2.png'
            };

            return imageMap[productId] || 'images/goods1.png';
        }

        detectCategory(card) {
            const classList = card.className;
            if (classList.includes('fresh-goods')) return '新鲜好物';
            if (classList.includes('popular-recommend')) return '人气推荐';
            if (classList.closest('#fresh-section')) return '生鲜';
            if (classList.closest('#clothes-section')) return '服装';
            if (classList.closest('#kitchen-section')) return '餐厨';
            if (classList.closest('#home-section')) return '居家';
            return '其他';
        }

        getDefaultProduct(productId) {
            return {
                id: parseInt(productId),
                name: `商品 ${productId}`,
                price: 99.00,
                originalPrice: 129.00,
                image: this.getDefaultImage(productId),
                category: '默认分类'
            };
        }

        // 检查用户登录状态
        isUserLoggedIn() {
            try {
                const userData = localStorage.getItem(this.USER_KEY) ||
                    sessionStorage.getItem(this.USER_KEY);

                if (!userData) {
                    console.log('未找到用户数据');
                    return false;
                }

                const user = JSON.parse(userData);
                const isLoggedIn = !!(user && user.id);

                return isLoggedIn;
            } catch (e) {
                console.error('检查用户登录状态失败:', e);
                return false;
            }
        }

        // 显示登录模态框
        showLoginModal() {
            console.log('显示登录模态框');
            const authModal = document.getElementById('auth-modal');

            if (authModal) {
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';

                // 确保显示登录表单
                const loginForm = document.getElementById('login-form');
                const registerForm = document.getElementById('register-form');

                if (loginForm) loginForm.classList.add('active');
                if (registerForm) registerForm.classList.remove('active');

                // 添加登录成功回调
                this.addLoginSuccessCallback();
            } else {
                console.error('登录模态框元素未找到');
                this.showError('请先登录');
            }
        }

        // 添加商品到购物车
        async addToCart(productId, options = {}) {
            try {
                const { quantity = 1, color = '默认' } = options;

                console.log('添加商品到购物车:', { productId, quantity, color });

                // 检查登录状态
                if (!this.isUserLoggedIn()) {
                    this.showLoginModal();
                    return false;
                }

                // 获取商品信息
                const product = this.getLightweightProductInfo(productId);

                if (!product) {
                    this.showError('商品不存在');
                    console.error('获取商品信息失败，productId:', productId);
                    return false;
                }

                console.log('获取到的商品信息:', {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                });

                // 创建购物车商品
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice || product.price,
                    quantity: parseInt(quantity),
                    color: color,
                    image: product.image,
                    addedAt: new Date().toISOString(),
                    category: product.category || '其他',
                    brand: product.brand || '小兔鲜儿'
                };

                // 更新购物车
                let cart = this.getCart();
                console.log('当前购物车内容:', cart);

                const existingIndex = cart.findIndex(item =>
                    item.id === cartItem.id && item.color === cartItem.color
                );

                if (existingIndex >= 0) {
                    cart[existingIndex].quantity += cartItem.quantity;
                    console.log('更新现有商品数量:', cart[existingIndex]);
                    this.showSuccess(`${product.name} 数量已更新`);
                } else {
                    cart.push(cartItem);
                    console.log('添加新商品到购物车:', cartItem);
                    this.showSuccess(`${product.name} 已添加到购物车`);
                }

                // 保存购物车
                if (this.saveCart(cart)) {
                    console.log('购物车保存成功，当前商品数:', cart.length);
                    this.updateCartCount();
                    this.animateCart();
                    this.dispatchCartUpdated();
                    return true;
                }

                console.error('保存购物车失败');
                return false;
            } catch (e) {
                console.error('添加购物车失败:', e);
                this.showError('添加购物车失败: ' + e.message);
                return false;
            }
        }

        // 获取购物车
        getCart() {
            try {
                if (!this.isUserLoggedIn()) {
                    return [];
                }

                const cartData = localStorage.getItem(this.CART_KEY);
                return cartData ? JSON.parse(cartData) : [];
            } catch (e) {
                console.error('获取购物车失败:', e);
                return [];
            }
        }

        // 保存购物车
        saveCart(cart) {
            try {
                localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
                return true;
            } catch (e) {
                console.error('保存购物车失败:', e);
                return false;
            }
        }

        // 删除购物车商品
        removeFromCart(productId, color = null) {
            try {
                let cart = this.getCart();
                const initialLength = cart.length;

                const filteredCart = cart.filter(item => {
                    if (color !== null && color !== undefined) {
                        return !(item.id == productId && item.color === color);
                    }
                    return item.id != productId;
                });

                const removedCount = initialLength - filteredCart.length;

                if (removedCount > 0) {
                    if (this.saveCart(filteredCart)) {
                        this.updateCartCount();
                        this.showSuccess(`已移除 ${removedCount} 件商品`);
                        this.dispatchCartUpdated();
                        return true;
                    }
                } else {
                    this.showError('未找到要删除的商品');
                }
            } catch (e) {
                console.error('删除购物车商品失败:', e);
                this.showError('删除失败');
            }
            return false;
        }

        // 清空购物车
        clearCart() {
            try {
                localStorage.removeItem(this.CART_KEY);
                this.updateCartCount();
                this.showSuccess('购物车已清空');
                this.dispatchCartUpdated();
                return true;
            } catch (e) {
                console.error('清空购物车失败:', e);
                this.showError('清空失败');
                return false;
            }
        }

        // 更新商品数量
        updateQuantity(productId, color, quantity) {
            try {
                if (quantity < 1) {
                    return this.removeFromCart(productId, color);
                }

                let cart = this.getCart();
                const index = cart.findIndex(item =>
                    item.id == productId && item.color === color
                );

                if (index >= 0) {
                    cart[index].quantity = quantity;
                    cart[index].updatedAt = new Date().toISOString();

                    if (this.saveCart(cart)) {
                        this.updateCartCount();
                        this.showSuccess('商品数量已更新');
                        this.dispatchCartUpdated();
                        return true;
                    }
                } else {
                    this.showError('未找到要更新的商品');
                }
            } catch (e) {
                console.error('更新商品数量失败:', e);
                this.showError('更新失败');
            }
            return false;
        }

        // 更新购物车数量显示
        updateCartCount() {
            try {
                const cart = this.getCart();
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

                document.querySelectorAll('#cart-count, .cart-count').forEach(element => {
                    element.textContent = totalItems;
                    element.style.display = totalItems > 0 ? 'flex' : 'none';
                });
            } catch (e) {
                console.error('更新购物车数量失败:', e);
            }
        }

        // 检查购物车所有权
        checkCartOwnership() {
            try {
                const cart = this.getCart();
                const userData = localStorage.getItem(this.USER_KEY) ||
                    sessionStorage.getItem(this.USER_KEY);

                if (!userData && cart.length > 0) {
                    console.log('检测到未登录但有购物车数据，正在清空...');
                    this.clearCart();
                }
            } catch (e) {
                console.error('检查购物车所有权失败:', e);
            }
        }

        // 登录成功回调
        addLoginSuccessCallback() {
            const loginSuccessHandler = () => {
                console.log('登录成功，重新提交订单');
                document.removeEventListener('loginSuccess', loginSuccessHandler);

                setTimeout(() => {
                    if (window.location.pathname.includes('checkout.html')) {
                        const submitBtn = document.getElementById('submit-order');
                        if (submitBtn) submitBtn.click();
                    }
                }, 500);
            };

            document.addEventListener('loginSuccess', loginSuccessHandler);
        }

        // 消息提示
        showSuccess(message) {
            this.showMessage(message, 'success');
        }

        showError(message) {
            this.showMessage(message, 'error');
        }

        showMessage(message, type = 'info') {
            const messageEl = document.createElement('div');
            messageEl.className = `cart-message ${type}`;
            messageEl.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#5EB69C' : '#e63946'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            messageEl.innerHTML = `
                <span style="font-size: 20px;">${type === 'success' ? '✓' : '✗'}</span>
                <span>${message}</span>
            `;

            document.body.appendChild(messageEl);

            setTimeout(() => {
                messageEl.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => messageEl.remove(), 300);
            }, 3000);
        }

        // 购物车动画
        animateCart() {
            const cartCount = document.querySelector('#cart-count, .cart-count');
            if (cartCount) {
                cartCount.classList.add('cart-pulse');
                setTimeout(() => cartCount.classList.remove('cart-pulse'), 500);
            }
        }

        // 触发购物车更新事件
        dispatchCartUpdated() {
            const event = new CustomEvent('cartUpdated');
            window.dispatchEvent(event);
        }

        // 绑定全局事件（使用事件委托）
        bindGlobalEvents() {
            // 避免重复绑定
            if (window._cartEventsBound) return;

            // 使用事件委托处理所有加入购物车按钮
            document.addEventListener('click', (e) => {
                const addBtn = e.target.closest('.btn-add-cart, .add-to-cart-mini, .add-to-cart-btn');
                if (addBtn && addBtn.dataset.productId) {
                    e.preventDefault();
                    e.stopPropagation();

                    const productId = addBtn.dataset.productId;
                    this.addToCart(productId);

                    // 按钮点击动画
                    addBtn.classList.add('button-click');
                    setTimeout(() => addBtn.classList.remove('button-click'), 200);
                }
            }, true); // 使用捕获阶段

            // 监听购物车更新事件
            window.addEventListener('cartUpdated', () => this.updateCartCount());

            // 监听存储变化
            window.addEventListener('storage', (e) => {
                if (e.key === this.CART_KEY) this.updateCartCount();
            });

            // 页面显示时更新购物车
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) this.updateCartCount();
            });

            window._cartEventsBound = true;
        }

        // 添加动画样式
        addAnimationStyles() {
            if (document.querySelector('#cart-animation-styles')) return;

            const style = document.createElement('style');
            style.id = 'cart-animation-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes slideOutRight {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(30px); }
                }
                
                @keyframes cartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                
                .cart-pulse { animation: cartPulse 0.5s ease; }
                
                @keyframes buttonClick {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                
                .button-click { animation: buttonClick 0.2s ease; }
            `;
            document.head.appendChild(style);
        }
    }

    // 创建全局实例
    window.CartManager = new CartManagerClass();
}
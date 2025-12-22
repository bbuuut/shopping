// config.js - 全局配置
window.AppConfig = {
    // 存储键名
    STORAGE_KEYS: {
        USER: 'xiaotuxian_user',
        CART: 'xiaotuxian_cart',
        ORDERS: 'xiaotuxian_orders',
        ADDRESSES: 'xiaotuxian_addresses',
        FAVORITES: 'xiaotuxian_favorites',
        SEARCH_HISTORY: 'searchHistory'
    },
    
    // 默认商品数据
    DEFAULT_PRODUCTS: {
        1: { id: 1, name: 'KN95口罩', price: 79, image: 'images/goods1.png' },
        2: { id: 2, name: '普洱茶盒', price: 566, image: 'images/goods2.png' },
        // 更多默认商品
    },
    
    // API配置
    API: {
        TIMEOUT: 10000,
        RETRY_COUNT: 3
    },
    
    // 页面配置
    PAGES: {
        HOME: 'index.html',
        PRODUCT: 'product.html',
        CHECKOUT: 'checkout.html',
        CART: 'cart.html'
    }
};
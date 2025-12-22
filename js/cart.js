// cart.js - 使用统一购物车管理器
document.addEventListener('DOMContentLoaded', function() {
    console.log('购物车模块加载...');
    
    // 初始化购物车管理器（已自动初始化）
    if (typeof window.CartManager === 'undefined') {
        console.error('CartManager 未加载');
        return;
    }
    
    // 更新购物车数量
    window.CartManager.updateCartCount();
    
    console.log('购物车模块加载完成');
});
// auth.js - 简洁版（无社交登录）
document.addEventListener('DOMContentLoaded', function () {
    console.log('用户认证系统初始化...');

    // 用户数据管理
    const UserManager = {
        getCurrentUser: function () {
            try {
                const userData = localStorage.getItem('xiaotuxian_user') ||
                    sessionStorage.getItem('xiaotuxian_user');
                return userData ? JSON.parse(userData) : null;
            } catch (e) {
                console.error('读取用户数据失败:', e);
                return null;
            }
        },

        saveCurrentUser: function (user, rememberMe = false) {
            try {
                const userData = {
                    id: user.id,
                    username: user.username,
                    phone: user.phone || null,
                    email: user.email || null,
                    loginTime: new Date().toISOString()
                };

                if (rememberMe) {
                    localStorage.setItem('xiaotuxian_user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('xiaotuxian_user', JSON.stringify(userData));
                }
                return true;
            } catch (e) {
                console.error('保存用户数据失败:', e);
                return false;
            }
        },

        getAllUsers: function () {
            try {
                const users = localStorage.getItem('xiaotuxian_registered_users');
                return users ? JSON.parse(users) : [];
            } catch (e) {
                console.error('读取用户列表失败:', e);
                return [];
            }
        },

        saveRegisteredUser: function (user) {
            try {
                let users = this.getAllUsers();

                const existingIndex = users.findIndex(u =>
                    u.username === user.username ||
                    (user.phone && u.phone === user.phone)
                );

                if (existingIndex >= 0) {
                    users[existingIndex] = {
                        ...users[existingIndex],
                        ...user,
                        updatedAt: new Date().toISOString()
                    };
                } else {
                    users.push({
                        ...user,
                        id: user.id || Date.now(),
                        registeredAt: new Date().toISOString()
                    });
                }

                localStorage.setItem('xiaotuxian_registered_users', JSON.stringify(users));
                return true;
            } catch (e) {
                console.error('保存注册用户失败:', e);
                return false;
            }
        },

        findUserByIdentifier: function (identifier) {
            const users = this.getAllUsers();

            if (!identifier) return null;

            const isPhone = /^1[3-9]\d{9}$/.test(identifier);
            const isEmail = /\S+@\S+\.\S+/.test(identifier);

            let user = null;

            // 优先查找手机号
            if (isPhone) {
                user = users.find(u => u.phone === identifier);
            }

            // 如果没找到，再查找用户名
            if (!user) {
                user = users.find(u => u.username === identifier);
            }

            // 如果还没找到，最后查找邮箱
            if (!user && isEmail) {
                user = users.find(u => u.email === identifier);
            }

            return user;
        },

        isUsernameAvailable: function (username) {
            const users = this.getAllUsers();
            return !users.some(u => u.username === username);
        },

        isPhoneRegistered: function (phone) {
            const users = this.getAllUsers();
            return users.some(u => u.phone === phone);
        },

        clearCurrentUser: function () {
            localStorage.removeItem('xiaotuxian_user');
            sessionStorage.removeItem('xiaotuxian_user');
        }
    };

    function initAuth() {
        updateUserStatus();
        bindEvents();
    }

    function updateUserStatus() {
        const user = UserManager.getCurrentUser();
        const userStatus = document.getElementById('user-status');
        const loggedInUser = document.getElementById('logged-in-user');
        const usernameDisplay = document.getElementById('username-display');

        if (user && user.username) {
            if (userStatus) userStatus.style.display = 'none';
            if (loggedInUser) loggedInUser.style.display = 'flex';
            if (usernameDisplay) {
                usernameDisplay.textContent = user.username;
                // 确保用户名颜色可见
                usernameDisplay.style.color = '#ffcc00';
            }
        } else {
            if (userStatus) userStatus.style.display = 'inline';
            if (loggedInUser) loggedInUser.style.display = 'none';
        }
    }

    function bindEvents() {
        // 登录/注册链接
        document.getElementById('login-link')?.addEventListener('click', function (e) {
            e.preventDefault();
            showAuthModal('login');
        });

        document.getElementById('register-link')?.addEventListener('click', function (e) {
            e.preventDefault();
            showAuthModal('register');
        });

        // 退出登录
        document.getElementById('logout-link')?.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });

        // 模态框关闭
        document.getElementById('auth-overlay')?.addEventListener('click', hideAuthModal);
        document.getElementById('close-auth-modal')?.addEventListener('click', hideAuthModal);

        // ESC键关闭
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && document.getElementById('auth-modal')?.style.display === 'block') {
                hideAuthModal();
            }
        });

        // 表单切换
        document.getElementById('switch-to-register')?.addEventListener('click', function (e) {
            e.preventDefault();
            showForm('register');
        });

        document.getElementById('switch-to-login')?.addEventListener('click', function (e) {
            e.preventDefault();
            showForm('login');
        });

        // 忘记密码
        document.getElementById('forgot-password')?.addEventListener('click', function (e) {
            e.preventDefault();
            showForm('forgot');
        });

        document.getElementById('back-to-login')?.addEventListener('click', function (e) {
            e.preventDefault();
            showForm('login');
        });

        // 密码显示/隐藏
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function () {
                const targetId = this.dataset.target;
                const input = document.getElementById(targetId);
                if (input.type === 'password') {
                    input.type = 'text';
                    this.textContent = '🙈';
                } else {
                    input.type = 'password';
                    this.textContent = '👁️';
                }
            });
        });

        // 表单提交
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('register-form')?.addEventListener('submit', handleRegister);
    }

    function handleLogin(e) {
        e.preventDefault();

        const loginUsername = document.getElementById('login-username');
        const loginPassword = document.getElementById('login-password');
        const rememberMe = document.getElementById('remember-me')?.checked || false;

        if (!loginUsername || !loginPassword) return;

        const identifier = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!identifier) {
            showError('login-username-error', '请输入用户名或手机号');
            return;
        }

        if (!password) {
            showError('login-password-error', '请输入密码');
            return;
        }

        const user = UserManager.findUserByIdentifier(identifier);

        if (!user) {
            const isPhone = /^1[3-9]\d{9}$/.test(identifier);

            if (isPhone) {
                const newUser = {
                    id: Date.now(),
                    username: username,
                    phone: phone,
                    password: password,
                    email: document.getElementById('register-email')?.value.trim() || null,
                    registeredAt: new Date().toISOString()
                };

                UserManager.saveRegisteredUser(newUser);
                UserManager.saveCurrentUser(newUser, rememberMe);
                updateUserStatus();
                hideAuthModal();
                showSuccessMessage('自动注册成功', `欢迎 ${newUser.username}！`);
            } else {
                showError('login-username-error', '用户不存在');
            }
            return;
        }

        if (password.length < 6) {
            showError('login-password-error', '密码错误');
            return;
        }

        UserManager.saveCurrentUser(user, rememberMe);
        updateUserStatus();
        hideAuthModal();

        // 触发登录成功事件
        const loginSuccessEvent = new CustomEvent('loginSuccess', {
            detail: { user: user }
        });
        document.dispatchEvent(loginSuccessEvent);

        showSuccessMessage('登录成功', `欢迎回来 ${user.username}！`);
    }

    function handleRegister(e) {
        e.preventDefault();

        const registerUsername = document.getElementById('register-username');
        const registerPhone = document.getElementById('register-phone');
        const registerPassword = document.getElementById('register-password');
        const registerConfirmPassword = document.getElementById('register-confirm-password');
        const agreeTerms = document.getElementById('agree-terms');

        if (!registerUsername || !registerPhone || !registerPassword || !registerConfirmPassword) return;

        const username = registerUsername.value.trim();
        const phone = registerPhone.value.trim();
        const password = registerPassword.value.trim();
        const confirmPassword = registerConfirmPassword.value.trim();

        let isValid = true;

        if (!username) {
            showError('register-username-error', '请输入用户名');
            isValid = false;
        } else if (username.length < 3 || username.length > 12) {
            showError('register-username-error', '用户名3-12位');
            isValid = false;
        } else if (!UserManager.isUsernameAvailable(username)) {
            showError('register-username-error', '用户名已存在');
            isValid = false;
        } else {
            clearError('register-username-error');
        }

        if (!phone) {
            showError('register-phone-error', '请输入手机号');
            isValid = false;
        } else if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError('register-phone-error', '手机号格式不正确');
            isValid = false;
        } else if (UserManager.isPhoneRegistered(phone)) {
            showError('register-phone-error', '手机号已注册');
            isValid = false;
        } else {
            clearError('register-phone-error');
        }

        if (!password) {
            showError('register-password-error', '请输入密码');
            isValid = false;
        } else if (password.length < 6) {
            showError('register-password-error', '密码至少6位');
            isValid = false;
        } else {
            clearError('register-password-error');
        }

        if (!confirmPassword) {
            showError('register-confirm-password-error', '请再次输入密码');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('register-confirm-password-error', '两次密码不一致');
            isValid = false;
        } else {
            clearError('register-confirm-password-error');
        }

        if (!agreeTerms || !agreeTerms.checked) {
            showError('agree-terms-error', '请同意用户协议');
            isValid = false;
        } else {
            clearError('agree-terms-error');
        }

        if (!isValid) return;

        const newUser = {
            id: Date.now(),
            username: username,
            phone: phone,
            password: password,
            email: document.getElementById('register-email')?.value.trim() || null
        };

        UserManager.saveRegisteredUser(newUser);
        UserManager.saveCurrentUser(newUser, true);
        updateUserStatus();
        hideAuthModal();

        // 触发登录成功事件
        const loginSuccessEvent = new CustomEvent('loginSuccess', {
            detail: { user: newUser }
        });
        document.dispatchEvent(loginSuccessEvent);

        showSuccessMessage('注册成功', `欢迎 ${username}！`);
    }

    // 在 auth.js 的 logout 函数中，修改这部分
    function logout() {
        try {
            // 1. 清除用户数据
            localStorage.removeItem('xiaotuxian_user');
            sessionStorage.removeItem('xiaotuxian_user');

            // 2. 清空购物车（修改调用方式）
            try {
                localStorage.removeItem('xiaotuxian_cart');
                // 触发购物车更新事件
                if (typeof window.CartManager !== 'undefined' &&
                    typeof window.CartManager.clearCart === 'function') {
                    window.CartManager.clearCart();
                }
                // 触发事件更新UI
                const cartUpdatedEvent = new CustomEvent('cartUpdated');
                window.dispatchEvent(cartUpdatedEvent);
            } catch (e) {
                console.error('清空购物车失败:', e);
            }

            // 3. 更新用户状态显示
            updateUserStatus();

            // 4. 显示成功消息
            showSuccessMessage('已退出登录', '期待您的再次光临！');

            // 5. 如果当前在结算页面，跳转到首页
            if (window.location.pathname.includes('checkout.html')) {
                setTimeout(() => {
                    alert('您已退出登录，已跳转到首页');
                    window.location.href = 'index.html';
                }, 1500);
            }

            console.log('用户已退出登录');

        } catch (e) {
            console.error('退出登录失败:', e);
            showError('退出登录失败，请稍后重试');
        }
    }
    // 新增：退出登录时清空购物车的函数
    function clearCartOnLogout() {
        try {
            // 清空购物车数据
            localStorage.removeItem('xiaotuxian_cart');

            // 触发购物车更新事件
            const cartUpdatedEvent = new CustomEvent('cartUpdated');
            window.dispatchEvent(cartUpdatedEvent);

            // 如果有 CartManager，调用其清空方法
            if (typeof window.CartManager !== 'undefined' &&
                typeof window.CartManager.clearCart === 'function') {
                window.CartManager.clearCart();
            }

            console.log('购物车已清空');
        } catch (e) {
            console.error('清空购物车失败:', e);
        }
    }

    function showAuthModal(formType = 'login') {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            showForm(formType);
            clearFormErrors();
        }
    }

    function hideAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            clearForms();
        }
    }

    function showForm(formType) {
        const forms = ['login-form', 'register-form', 'forgot-form'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) form.classList.remove('active');
        });

        const targetForm = document.getElementById(`${formType}-form`);
        if (targetForm) targetForm.classList.add('active');
    }

    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    function clearForms() {
        const inputs = document.querySelectorAll('#auth-modal input');
        inputs.forEach(input => {
            input.value = '';
            if (input.type === 'text' && input.id.includes('password')) {
                input.type = 'password';
            }
        });

        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.textContent = '👁️';
        });

        clearFormErrors();
        showForm('login');
    }

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = message;
    }

    function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = '';
    }

    function showSuccessMessage(title, message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-left: 4px solid #5EB69C;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            padding: 15px 20px;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            min-width: 250px;
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: #5EB69C; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">✓</span>
                <div>
                    <div style="color: #333; font-weight: bold; margin-bottom: 4px;">${title}</div>
                    <div style="color: #666; font-size: 14px;">${message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    setTimeout(initAuth, 100);
    // 退出登录链接
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout(); // 调用统一的退出登录函数
        });
    }

    // 产品页面的退出登录链接
    const productLogoutLink = document.getElementById('product-logout-link');
    if (productLogoutLink) {
        productLogoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout(); // 调用统一的退出登录函数
        });
    }

    // 结算页面的退出登录链接
    const checkoutLogoutLink = document.getElementById('checkout-logout-link');
    if (checkoutLogoutLink) {
        checkoutLogoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout(); // 调用统一的退出登录函数
        });
    }
});
// 添加测试函数到控制台
function createTestUser() {
    const testUser = {
        id: 1,
        username: 'testuser',
        phone: '13800138000',
        password: '123456',
        registeredAt: new Date().toISOString()
    };

    UserManager.saveRegisteredUser(testUser);
    console.log('测试用户已创建:', testUser);
}

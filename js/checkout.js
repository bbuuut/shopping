// checkout.js - 结算页面（修复版） - 重点修复地址功能
console.log('结算页面脚本加载...');

// 使用全局的 AddressManager（确保只定义一次）
if (typeof window.AddressManager === 'undefined') {
    console.log('创建全局 AddressManager');

    window.AddressManager = {
        getAllAddresses: function () {
            try {
                const addresses = JSON.parse(localStorage.getItem('xiaotuxian_addresses') || '[]');
                return Array.isArray(addresses) ? addresses : [];
            } catch (e) {
                console.error('获取地址失败:', e);
                return [];
            }
        },

        getSelectedAddressIndex: function () {
            try {
                const index = localStorage.getItem('xiaotuxian_selected_address');
                return index !== null ? parseInt(index) : 0;
            } catch (e) {
                console.error('获取选中地址失败:', e);
                return 0;
            }
        },

        setSelectedAddressIndex: function (index) {
            try {
                localStorage.setItem('xiaotuxian_selected_address', index.toString());
                return true;
            } catch (e) {
                console.error('设置选中地址失败:', e);
                return false;
            }
        },

        saveAddresses: function (addresses) {
            try {
                localStorage.setItem('xiaotuxian_addresses', JSON.stringify(addresses));
                return true;
            } catch (e) {
                console.error('保存地址失败:', e);
                return false;
            }
        },

        addAddress: function (address) {
            try {
                const addresses = this.getAllAddresses();

                // 如果设置为默认地址，取消其他默认地址
                if (address.isDefault) {
                    addresses.forEach(addr => {
                        addr.isDefault = false;
                    });
                }

                // 为新地址生成ID
                const newAddress = {
                    ...address,
                    id: address.id || Date.now(),
                    createdAt: new Date().toISOString()
                };

                addresses.push(newAddress);
                const success = this.saveAddresses(addresses);

                console.log('地址添加成功:', newAddress);
                return success;
            } catch (e) {
                console.error('添加地址失败:', e);
                return false;
            }
        },

        updateAddress: function (index, address) {
            try {
                const addresses = this.getAllAddresses();

                if (index >= 0 && index < addresses.length) {
                    // 如果设置为默认地址，取消其他默认地址
                    if (address.isDefault) {
                        addresses.forEach(addr => {
                            addr.isDefault = false;
                        });
                    }

                    addresses[index] = {
                        ...addresses[index],
                        ...address,
                        updatedAt: new Date().toISOString()
                    };

                    return this.saveAddresses(addresses);
                }

                return false;
            } catch (e) {
                console.error('更新地址失败:', e);
                return false;
            }
        },

        validateAddress: function (address) {
            const errors = [];

            if (!address.name || address.name.trim() === '') {
                errors.push('请输入收货人姓名');
            }

            if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) {
                errors.push('请输入正确的11位手机号码');
            }

            if (!address.province || address.province === '') {
                errors.push('请选择省份');
            }

            if (!address.city || address.city === '') {
                errors.push('请选择城市');
            }

            if (!address.detail || address.detail.trim() === '') {
                errors.push('请输入详细地址（街道、小区、门牌号等）');
            }

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        },
        setAutoInit: function (enabled) {
            localStorage.setItem('xiaotuxian_auto_init_addresses', enabled ? 'true' : 'false');
        },
        // 新增：初始化默认地址（如果没有地址）
        initDefaultAddresses: function () {
            try {
                const addresses = this.getAllAddresses();
                const autoInit = localStorage.getItem('xiaotuxian_auto_init_addresses');

                // 如果设置了不自动初始化，则跳过
                if (autoInit === 'false') return;

                if (addresses.length === 0) {
                    console.log('初始化默认地址');
                    const defaultAddresses = [
                        {
                            id: Date.now(),
                            name: '张三',
                            phone: '13800138000',
                            province: '北京市',
                            city: '北京市',
                            district: '朝阳区',
                            detail: '建国门外大街1号',
                            zip: '100020',
                            isDefault: true,
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: Date.now() + 1,
                            name: '李四',
                            phone: '13900139000',
                            province: '上海市',
                            city: '上海市',
                            district: '黄浦区',
                            detail: '南京东路100号',
                            zip: '200001',
                            isDefault: false,
                            createdAt: new Date().toISOString()
                        }
                    ];

                    this.saveAddresses(defaultAddresses);
                    console.log('默认地址已初始化');
                }
            } catch (e) {
                console.error('初始化默认地址失败:', e);
            }
        },

        // 新增：删除地址
        deleteAddress: function (index) {
            try {
                const addresses = this.getAllAddresses();

                if (index >= 0 && index < addresses.length) {
                    const wasDefault = addresses[index].isDefault;

                    addresses.splice(index, 1);

                    // 如果删除了默认地址且还有地址，设置第一个为默认
                    if (wasDefault && addresses.length > 0) {
                        addresses[0].isDefault = true;
                    }

                    const success = this.saveAddresses(addresses);

                    // 调整选中的索引
                    const currentSelected = this.getSelectedAddressIndex();
                    if (currentSelected >= addresses.length) {
                        this.setSelectedAddressIndex(Math.max(0, addresses.length - 1));
                    }

                    return success;
                }

                return false;
            } catch (e) {
                console.error('删除地址失败:', e);
                return false;
            }
        },

        // 新增：获取地址数量
        getAddressCount: function () {
            return this.getAllAddresses().length;
        },

        // 新增：清空所有地址
        clearAllAddresses: function () {
            try {
                localStorage.removeItem('xiaotuxian_addresses');
                localStorage.removeItem('xiaotuxian_selected_address');
                return true;
            } catch (e) {
                console.error('清空地址失败:', e);
                return false;
            }
        }
    };

    // 立即初始化默认地址
    window.AddressManager.initDefaultAddresses();
}

// 结算页面主逻辑
document.addEventListener('DOMContentLoaded', function () {
    console.log('结算页面初始化...');

    // 确保 CartManager 存在
    if (typeof window.CartManager === 'undefined') {
        console.error('CartManager 未定义，创建备用版本');
        createFallbackCartManager();
    }

    // 使用本地引用
    const CartManager = window.CartManager;
    const AddressManager = window.AddressManager;

    console.log('CartManager 状态:', typeof CartManager);
    console.log('AddressManager 状态:', typeof AddressManager);
    console.log('当前地址数量:', AddressManager.getAddressCount());

    // 主初始化函数
    function initCheckoutPage() {
        console.log('初始化结算页面...');

        // 1. 更新用户状态
        updateUserStatus();

        // 2. 初始化地区选择器数据
        initRegionData();

        // 3. 加载地址列表
        setTimeout(loadAddresses, 100);

        // 4. 加载订单商品
        setTimeout(loadOrderItems, 150);

        // 5. 初始化各种功能
        initClearCart();
        initShippingOptions();
        initPaymentOptions();
        initInvoiceOptions();
        initCoupons();
        initOrderSubmit();

        // 6. 绑定事件
        bindAuthEvents();
        bindAddressForm();
        bindAddressModalEvents();
        bindModalCloseEvents();

        // 7. 添加动画样式
        addAnimationStyles();

        console.log('结算页面初始化完成');
    }

    // 用户状态更新
    function updateUserStatus() {
        try {
            const userData = localStorage.getItem('xiaotuxian_user') ||
                sessionStorage.getItem('xiaotuxian_user');
            const user = userData ? JSON.parse(userData) : null;

            const userStatus = document.getElementById('checkout-user-status');
            const loggedInUser = document.getElementById('checkout-logged-in-user');
            const usernameDisplay = document.getElementById('checkout-username-display');

            if (user && user.username) {
                if (userStatus) userStatus.style.display = 'none';
                if (loggedInUser) {
                    loggedInUser.style.display = 'flex';
                    if (usernameDisplay) {
                        usernameDisplay.textContent = user.username;
                        usernameDisplay.style.color = '#ffcc00';
                    }
                }
            } else {
                if (userStatus) userStatus.style.display = 'inline';
                if (loggedInUser) loggedInUser.style.display = 'none';
            }
        } catch (e) {
            console.error('更新用户状态失败:', e);
        }
    }

    // 显示消息
    function showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `checkout-message ${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#5EB69C' : type === 'error' ? '#e63946' : '#3498db'};
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
            <span style="font-size: 20px;">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    // 初始化地区数据
    function initRegionData() {
        console.log('初始化地区数据');

        const provinceSelect = document.getElementById('address-province');
        const citySelect = document.getElementById('address-city');
        const districtSelect = document.getElementById('address-district');

        if (!provinceSelect) return;

        // 省份数据
        const provinces = [
            '北京市', '上海市', '天津市', '重庆市',
            '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
            '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
            '河南省', '湖北省', '湖南省', '广东省', '海南省',
            '四川省', '贵州省', '云南省', '陕西省', '甘肃省',
            '青海省', '台湾省', '内蒙古自治区', '广西壮族自治区',
            '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
            '香港特别行政区', '澳门特别行政区'
        ];

        // 清空并填充省份选项
        provinceSelect.innerHTML = '<option value="">请选择省份</option>';
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });

        // 省份变化时更新城市
        provinceSelect.addEventListener('change', function () {
            const selectedProvince = this.value;
            updateCities(selectedProvince);
        });

        // 初始填充一些城市（可选）
        updateCities('北京市');
    }

    function updateCities(province) {
        const citySelect = document.getElementById('address-city');
        const districtSelect = document.getElementById('address-district');

        if (!citySelect) return;

        // 城市数据（简化版）
        const cityMap = {
            '北京市': ['北京市'],
            '上海市': ['上海市'],
            '天津市': ['天津市'],
            '重庆市': ['重庆市'],
            '广东省': ['广州市', '深圳市', '珠海市', '东莞市', '佛山市'],
            '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '徐州市'],
            '浙江省': ['杭州市', '宁波市', '温州市', '绍兴市', '嘉兴市'],
            '四川省': ['成都市', '绵阳市', '德阳市', '南充市', '宜宾市']
        };

        // 清空城市选项
        citySelect.innerHTML = '<option value="">请选择城市</option>';
        citySelect.disabled = !province;

        if (province && cityMap[province]) {
            citySelect.disabled = false;
            cityMap[province].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });

            // 城市变化时更新区县
            citySelect.addEventListener('change', function () {
                const selectedCity = this.value;
                updateDistricts(province, selectedCity);
            });

            // 默认选择第一个城市并更新区县
            if (cityMap[province].length > 0) {
                citySelect.value = cityMap[province][0];
                updateDistricts(province, cityMap[province][0]);
            }
        }

        // 清空区县
        if (districtSelect) {
            districtSelect.innerHTML = '<option value="">请选择区县</option>';
            districtSelect.disabled = true;
        }
    }

    function updateDistricts(province, city) {
        const districtSelect = document.getElementById('address-district');
        if (!districtSelect) return;

        // 区县数据（简化版）
        const districtMap = {
            '北京市-北京市': ['东城区', '西城区', '朝阳区', '丰台区', '海淀区'],
            '上海市-上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区'],
            '广州市-广东省': ['天河区', '越秀区', '海珠区', '荔湾区', '白云区'],
            '深圳市-广东省': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区'],
            '成都市-四川省': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区']
        };

        const key = `${city}-${province}`;

        // 清空区县选项
        districtSelect.innerHTML = '<option value="">请选择区县</option>';
        districtSelect.disabled = !city;

        if (city && districtMap[key]) {
            districtSelect.disabled = false;
            districtMap[key].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else if (city) {
            // 如果没有特定区县数据，添加一个通用选项
            districtSelect.disabled = false;
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            districtSelect.appendChild(option);
        }
    }

    // 加载地址列表 - 修复版
    function loadAddresses() {
        try {
            console.log('开始加载地址...');
            const addresses = AddressManager.getAllAddresses();
            const addressList = document.getElementById('address-list');

            console.log('获取到地址:', addresses);
            console.log('地址列表元素:', addressList);

            if (!addressList) {
                console.error('地址列表容器未找到');
                return;
            }

            // 清空地址列表
            addressList.innerHTML = '';

            if (addresses.length === 0) {
                console.log('没有地址，显示空状态');
                addressList.innerHTML = `
                    <div class="address-item empty-address">
                        <p>暂无收货地址</p>
                        <button class="btn-add-address" id="add-address-btn">+ 添加新地址</button>
                    </div>
                `;
            } else {
                console.log('有地址，显示地址列表');
                addresses.forEach((address, index) => {
                    const addressItem = document.createElement('div');
                    addressItem.className = `address-item ${address.isDefault ? 'active' : ''}`;

                    // 检查是否为默认选中地址
                    const selectedIndex = AddressManager.getSelectedAddressIndex();
                    if (index === selectedIndex) {
                        addressItem.classList.add('active');
                    }

                    // 格式化地址显示
                    const addressText = `${address.province || ''} ${address.city || ''} ${address.district || ''} ${address.detail || ''}`.trim();

                    addressItem.innerHTML = `
                        <div class="address-content">
                            <div class="address-name">${address.name || '未命名'}</div>
                            <div class="address-phone">${address.phone || '无电话'}</div>
                            <div class="address-full">${addressText || '无详细地址'}</div>
                            ${address.isDefault ? '<span class="address-default">默认</span>' : ''}
                        </div>
                        <div class="address-actions">
                            <button class="btn-edit-address" data-index="${index}">编辑</button>
                            <button class="btn-delete-address" data-index="${index}">删除</button>
                        </div>
                    `;

                    // 点击选择地址
                    addressItem.addEventListener('click', function (e) {
                        // 如果点击的是编辑或删除按钮，不触发选择
                        if (e.target.classList.contains('btn-edit-address') ||
                            e.target.classList.contains('btn-delete-address')) {
                            return;
                        }

                        console.log('选择地址:', index);
                        selectAddress(index);
                    });

                    addressList.appendChild(addressItem);
                });

                // 添加新地址按钮
                console.log('添加新地址按钮');
                const addBtn = document.createElement('button');
                addBtn.className = 'btn-add-address';
                addBtn.textContent = '+ 添加新地址';
                addBtn.id = 'add-address-btn';
                addBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('点击添加新地址按钮');
                    showAddressModal();
                });
                addressList.appendChild(addBtn);

                // 如果地址列表不为空，确保至少有一个地址被选中
                const selectedIndex = AddressManager.getSelectedAddressIndex();
                if (selectedIndex >= 0 && selectedIndex < addresses.length) {
                    // 默认选中第一个地址或默认地址
                    const defaultAddressIndex = addresses.findIndex(addr => addr.isDefault);
                    const indexToSelect = defaultAddressIndex >= 0 ? defaultAddressIndex : 0;
                    selectAddress(indexToSelect);
                }
            }

            // 绑定编辑和删除按钮事件
            bindAddressButtons();

            console.log('地址加载完成');
        } catch (e) {
            console.error('加载地址失败:', e);
            showMessage('加载地址失败: ' + e.message, 'error');
        }
    }

    // 选择地址
    function selectAddress(index) {
        const addresses = AddressManager.getAllAddresses();
        if (index >= 0 && index < addresses.length) {
            // 移除所有地址的 active 类
            document.querySelectorAll('.address-item').forEach((item, i) => {
                item.classList.remove('active');
            });

            // 添加 active 类到当前地址
            const addressItems = document.querySelectorAll('.address-item');
            if (addressItems[index]) {
                addressItems[index].classList.add('active');
            }

            AddressManager.setSelectedAddressIndex(index);
            console.log('地址已选中:', index, addresses[index]);
        }
    }

    // 绑定地址按钮事件
    function bindAddressButtons() {
        // 编辑地址按钮
        document.querySelectorAll('.btn-edit-address').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                console.log('编辑地址索引:', index);
                showAddressModal(index);
            });
        });

        // 删除地址按钮
        document.querySelectorAll('.btn-delete-address').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                console.log('删除地址索引:', index);
                deleteAddress(index);
            });
        });
    }

    // 显示地址模态框
    function showAddressModal(addressIndex = null) {
        console.log('显示地址模态框，索引:', addressIndex);

        const modal = document.getElementById('address-modal');
        const form = document.getElementById('address-form');
        const modalTitle = modal.querySelector('h3');

        if (!modal || !form) {
            console.error('地址模态框或表单未找到');
            return;
        }

        if (addressIndex !== null) {
            // 编辑模式
            modalTitle.textContent = '编辑收货地址';
            const addresses = AddressManager.getAllAddresses();
            const address = addresses[addressIndex];

            if (address) {
                // 填充表单数据
                document.getElementById('address-name').value = address.name || '';
                document.getElementById('address-phone').value = address.phone || '';

                // 设置地区选择器
                const provinceSelect = document.getElementById('address-province');
                const citySelect = document.getElementById('address-city');
                const districtSelect = document.getElementById('address-district');

                if (provinceSelect && address.province) {
                    provinceSelect.value = address.province;
                    updateCities(address.province);

                    // 等待城市加载完成
                    setTimeout(() => {
                        if (citySelect && address.city) {
                            citySelect.value = address.city;
                            updateDistricts(address.province, address.city);

                            setTimeout(() => {
                                if (districtSelect && address.district) {
                                    districtSelect.value = address.district;
                                }
                            }, 100);
                        }
                    }, 100);
                }

                document.getElementById('address-detail').value = address.detail || '';
                document.getElementById('address-zip').value = address.zip || '';
                document.getElementById('address-default').checked = address.isDefault || false;

                // 设置编辑索引
                form.setAttribute('data-edit-index', addressIndex);
            }
        } else {
            // 添加模式
            modalTitle.textContent = '添加收货地址';

            // 重置表单
            form.reset();

            // 重置地区选择器到默认状态
            const provinceSelect = document.getElementById('address-province');
            const citySelect = document.getElementById('address-city');
            const districtSelect = document.getElementById('address-district');

            if (provinceSelect) provinceSelect.value = '';
            if (citySelect) {
                citySelect.innerHTML = '<option value="">请选择城市</option>';
                citySelect.disabled = true;
            }
            if (districtSelect) {
                districtSelect.innerHTML = '<option value="">请选择区县</option>';
                districtSelect.disabled = true;
            }

            // 移除编辑索引
            form.removeAttribute('data-edit-index');
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 隐藏地址模态框
    function hideAddressModal() {
        const modal = document.getElementById('address-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 删除地址
    function deleteAddress(index) {
        if (confirm('确定要删除这个地址吗？')) {
            try {
                const success = AddressManager.deleteAddress(index);
                if (success) {
                    loadAddresses();
                    showMessage('地址删除成功', 'success');
                } else {
                    showMessage('地址删除失败', 'error');
                }
            } catch (e) {
                console.error('删除地址失败:', e);
                showMessage('删除地址失败: ' + e.message, 'error');
            }
        }
    }

    // 绑定地址表单
    function bindAddressForm() {
        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', saveAddress);
        }
    }

    // 绑定地址模态框事件
    function bindAddressModalEvents() {
        const addressModal = document.getElementById('address-modal');
        if (!addressModal) return;

        // 关闭按钮
        const closeBtn = addressModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideAddressModal);
        }

        // 遮罩层
        const overlay = addressModal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', hideAddressModal);
        }

        // 取消按钮
        const cancelBtn = addressModal.querySelector('.btn-cancel-address');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideAddressModal);
        }
    }

    // 保存地址 - 修复版
    function saveAddress(event) {
        event.preventDefault();
        console.log('保存地址表单提交');

        try {
            const form = event.target;

            // 获取表单数据
            const name = document.getElementById('address-name').value.trim();
            const phone = document.getElementById('address-phone').value.trim();
            const province = document.getElementById('address-province').value;
            const city = document.getElementById('address-city').value;
            const district = document.getElementById('address-district').value;
            const detail = document.getElementById('address-detail').value.trim();
            const zip = document.getElementById('address-zip').value.trim();
            const isDefault = document.getElementById('address-default').checked;

            const address = {
                name,
                phone,
                province,
                city,
                district,
                detail,
                zip,
                isDefault
            };

            console.log('要保存的地址:', address);

            // 验证地址
            const validation = AddressManager.validateAddress(address);
            console.log('地址验证结果:', validation);

            if (!validation.isValid) {
                alert('请检查以下信息：\n' + validation.errors.join('\n'));
                return;
            }

            const editIndex = form.getAttribute('data-edit-index');
            let success = false;

            if (editIndex !== null && editIndex !== '') {
                // 编辑现有地址
                console.log('编辑地址，索引:', editIndex);
                const index = parseInt(editIndex);
                success = AddressManager.updateAddress(index, address);
                showMessage(success ? '地址更新成功' : '地址更新失败',
                    success ? 'success' : 'error');
            } else {
                // 添加新地址
                console.log('添加新地址');
                success = AddressManager.addAddress(address);
                showMessage(success ? '地址添加成功' : '地址添加失败',
                    success ? 'success' : 'error');
            }

            if (success) {
                // 重新加载地址列表
                setTimeout(() => {
                    console.log('重新加载地址列表');
                    loadAddresses();
                }, 300);

                // 关闭模态框
                hideAddressModal();

                // 清空表单（重置会更好）
                form.reset();

                // 重置地区选择器
                const citySelect = document.getElementById('address-city');
                const districtSelect = document.getElementById('address-district');
                if (citySelect) {
                    citySelect.innerHTML = '<option value="">请选择城市</option>';
                    citySelect.disabled = true;
                }
                if (districtSelect) {
                    districtSelect.innerHTML = '<option value="">请选择区县</option>';
                    districtSelect.disabled = true;
                }
            }

        } catch (e) {
            console.error('保存地址失败:', e);
            showMessage('保存地址失败: ' + e.message, 'error');
        }
    }

    // ================ 以下是购物车相关函数，保持不变 ================

    // 加载订单商品
    function loadOrderItems() {
        try {
            const cart = CartManager.getCart();
            const orderList = document.getElementById('order-list');

            if (!orderList) return;

            orderList.innerHTML = '';

            if (cart.length === 0) {
                orderList.innerHTML = `
                    <div class="empty-order">
                        <p>购物车是空的</p>
                        <a href="index.html" class="btn-continue-shopping">继续购物</a>
                    </div>
                `;
                updateOrderSummary([]);
                return;
            }

            let totalAmount = 0;
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;

                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="order-item-img">
                        <img src="${item.image || 'images/goods1.png'}" alt="${item.name}" 
                             onerror="this.src='https://via.placeholder.com/80x80?text=商品'">
                    </div>
                    <div class="order-item-info">
                        <div class="order-item-title">${item.name}</div>
                        <div class="order-item-spec">颜色：${item.color || '默认'}</div>
                        <div class="order-item-price">¥${item.price.toFixed(2)}</div>
                    </div>
                    <div class="order-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" max="99" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="order-item-total">¥${itemTotal.toFixed(2)}</div>
                    <div class="order-item-actions">
                        <button class="btn-delete-item" data-index="${index}" 
                                data-product-id="${item.id}" 
                                data-color="${item.color || '默认'}" 
                                title="删除">🗑️</button>
                    </div>
                `;

                orderList.appendChild(orderItem);
            });

            updateOrderSummary(cart);
            setTimeout(initQuantityEvents, 50);
        } catch (e) {
            console.error('加载订单商品失败:', e);
            showMessage('加载订单商品失败', 'error');
        }
    }

    // 初始化数量调整事件
    function initQuantityEvents() {
        const orderList = document.getElementById('order-list');
        if (!orderList) return;

        orderList.addEventListener('click', handleOrderListClick);
        orderList.addEventListener('change', handleQuantityChange);
    }

    function handleOrderListClick(e) {
        // 处理删除按钮
        const deleteBtn = e.target.closest('.btn-delete-item');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();

            const productId = deleteBtn.dataset.productId;
            const color = deleteBtn.dataset.color;

            if (confirm('确定要删除这个商品吗？')) {
                deleteOrderItem(productId, color);
            }
            return;
        }

        // 处理减号按钮
        const minusBtn = e.target.closest('.quantity-btn.minus');
        if (minusBtn) {
            e.preventDefault();
            const index = parseInt(minusBtn.dataset.index);
            adjustQuantity(index, -1);
            return;
        }

        // 处理加号按钮
        const plusBtn = e.target.closest('.quantity-btn.plus');
        if (plusBtn) {
            e.preventDefault();
            const index = parseInt(plusBtn.dataset.index);
            adjustQuantity(index, 1);
            return;
        }
    }

    function handleQuantityChange(e) {
        const input = e.target;
        if (input.classList.contains('quantity-input')) {
            const index = parseInt(input.dataset.index);
            const newQuantity = parseInt(input.value) || 1;
            adjustQuantity(index, 0, newQuantity);
        }
    }

    // 调整商品数量
    function adjustQuantity(index, delta, specificValue = null) {
        try {
            const cart = CartManager.getCart();
            if (index >= 0 && index < cart.length) {
                const item = cart[index];
                let newQuantity;

                if (specificValue !== null) {
                    newQuantity = specificValue;
                } else {
                    newQuantity = item.quantity + delta;
                    if (newQuantity < 1) newQuantity = 1;
                    if (newQuantity > 99) newQuantity = 99;
                }

                const success = CartManager.updateQuantity(
                    item.id,
                    item.color,
                    newQuantity
                );

                if (success) {
                    setTimeout(() => {
                        loadOrderItems();
                        updateOrderSummary(CartManager.getCart());
                    }, 100);
                }
            }
        } catch (e) {
            console.error('调整数量失败:', e);
            showMessage('调整数量失败', 'error');
        }
    }

    // 删除订单商品
    function deleteOrderItem(productId, color) {
        try {
            const success = CartManager.removeFromCart(productId, color);
            if (success) {
                setTimeout(() => {
                    loadOrderItems();
                    updateOrderSummary(CartManager.getCart());
                }, 100);
            }
        } catch (e) {
            console.error('删除商品失败:', e);
            showMessage('删除失败', 'error');
        }
    }

    // 更新订单汇总
    function updateOrderSummary(cart) {
        try {
            const productTotal = cart.reduce((sum, item) =>
                sum + (item.price * item.quantity), 0
            );
            const shippingFee = getShippingFee();
            const discount = getDiscountAmount();
            const totalAmount = productTotal + shippingFee - discount;

            const productTotalEl = document.getElementById('summary-product-total');
            const shippingFeeEl = document.getElementById('summary-shipping-fee');
            const discountEl = document.getElementById('summary-discount');
            const totalEl = document.getElementById('summary-total');

            if (productTotalEl) productTotalEl.textContent = `¥${productTotal.toFixed(2)}`;
            if (shippingFeeEl) shippingFeeEl.textContent = `¥${shippingFee.toFixed(2)}`;
            if (discountEl) discountEl.textContent = `-¥${discount.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `¥${totalAmount.toFixed(2)}`;

            // 更新支付模态框金额
            const paymentAmount = document.getElementById('payment-amount');
            if (paymentAmount) {
                paymentAmount.textContent = `¥${totalAmount.toFixed(2)}`;
            }
        } catch (e) {
            console.error('更新订单汇总失败:', e);
        }
    }

    // 获取运费
    function getShippingFee() {
        const expressOption = document.getElementById('shipping-express');
        if (expressOption && expressOption.checked) {
            return 15.00;
        }
        return 8.00;
    }

    // 获取优惠金额
    function getDiscountAmount() {
        return 0; // 简化版本，可扩展
    }

    // 清空购物车
    function initClearCart() {
        const clearAllBtn = document.getElementById('clear-all-items');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function () {
                if (confirm('确定要清空购物车吗？')) {
                    const success = CartManager.clearCart();
                    if (success) {
                        setTimeout(() => {
                            loadOrderItems();
                            updateOrderSummary([]);
                        }, 100);
                    }
                }
            });
        }
    }

    // 初始化配送选项
    function initShippingOptions() {
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', function () {
                document.querySelectorAll('.shipping-option').forEach(div => {
                    div.classList.remove('active');
                });
                this.closest('.shipping-option').classList.add('active');

                const cart = CartManager.getCart();
                updateOrderSummary(cart);
            });
        });
    }

    // 初始化支付选项
    function initPaymentOptions() {
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', function () {
                document.querySelectorAll('.payment-option').forEach(div => {
                    div.classList.remove('active');
                });
                this.closest('.payment-option').classList.add('active');
            });
        });
    }

    // 初始化发票选项
    function initInvoiceOptions() {
        const invoiceOptions = document.querySelectorAll('input[name="invoice"]');
        invoiceOptions.forEach(option => {
            option.addEventListener('change', function () {
                // 可根据需要添加逻辑
            });
        });
    }

    // 初始化优惠券
    function initCoupons() {
        const applyBtn = document.getElementById('apply-coupon');
        const couponInput = document.getElementById('coupon-code');
        const couponItems = document.querySelectorAll('.coupon-item');

        if (applyBtn) {
            applyBtn.addEventListener('click', applyCoupon);
        }

        if (couponInput) {
            couponInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') applyCoupon();
            });
        }

        couponItems.forEach(item => {
            item.addEventListener('click', function () {
                const code = this.getAttribute('data-code');
                if (couponInput) couponInput.value = code;
                applyCoupon();
            });
        });
    }

    // 应用优惠券
    function applyCoupon() {
        const couponInput = document.getElementById('coupon-code');
        if (!couponInput) return;

        const code = couponInput.value.trim();
        if (!code) {
            showMessage('请输入优惠码', 'error');
            return;
        }

        const validCoupons = {
            'WELCOME10': { discount: 10, minAmount: 0 },
            'SAVE20': { discount: 20, minAmount: 199 }
        };

        const coupon = validCoupons[code];
        if (!coupon) {
            showMessage('优惠码无效', 'error');
            return;
        }

        const cart = CartManager.getCart();
        const productTotal = cart.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        );

        if (productTotal < coupon.minAmount) {
            showMessage(`订单金额需满¥${coupon.minAmount}才能使用此优惠券`, 'error');
            return;
        }

        const discountElement = document.getElementById('summary-discount');
        if (discountElement) {
            discountElement.textContent = `-¥${coupon.discount.toFixed(2)}`;
        }

        const shippingFee = getShippingFee();
        const totalAmount = productTotal + shippingFee - coupon.discount;
        const totalElement = document.getElementById('summary-total');
        if (totalElement) {
            totalElement.textContent = `¥${totalAmount.toFixed(2)}`;
        }

        showMessage(`优惠券已应用，立减¥${coupon.discount}`, 'success');
    }

    // 初始化订单提交
    function initOrderSubmit() {
        const submitBtn = document.getElementById('submit-order');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmitOrder);
        }
    }

    // 处理订单提交
    function handleSubmitOrder(e) {
        e.preventDefault();
        console.log('处理订单提交');

        // 1. 检查登录状态
        if (!CartManager.isUserLoggedIn()) {
            showMessage('请先登录', 'error');
            CartManager.showLoginModal();
            return false;
        }

        // 2. 检查购物车
        const cart = CartManager.getCart();
        if (cart.length === 0) {
            showMessage('购物车是空的', 'error');
            return false;
        }

        // 3. 检查收货地址
        const addresses = AddressManager.getAllAddresses();
        if (addresses.length === 0) {
            showMessage('请添加收货地址', 'error');
            // 自动打开地址添加模态框
            setTimeout(() => {
                showAddressModal();
            }, 500);
            return false;
        }

        // 4. 检查配送方式
        const shippingMethod = document.querySelector('input[name="shipping"]:checked');
        if (!shippingMethod) {
            showMessage('请选择配送方式', 'error');
            return false;
        }

        // 5. 检查支付方式
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            showMessage('请选择支付方式', 'error');
            return false;
        }

        // 6. 提交订单
        submitOrder();
        return true;
    }

    // 提交订单到服务器（模拟）
    function submitOrder() {
        try {
            setSubmitButtonState(true);

            // 获取用户信息
            const userData = JSON.parse(localStorage.getItem('xiaotuxian_user') ||
                sessionStorage.getItem('xiaotuxian_user'));

            if (!userData || !userData.id) {
                showMessage('用户信息获取失败', 'error');
                setSubmitButtonState(false);
                return;
            }

            // 创建订单
            const order = {
                id: 'ORD' + Date.now(),
                userId: userData.id,
                items: CartManager.getCart(),
                address: AddressManager.getAllAddresses()[AddressManager.getSelectedAddressIndex()],
                shipping: document.querySelector('input[name="shipping"]:checked').id.replace('shipping-', ''),
                payment: document.querySelector('input[name="payment"]:checked').id.replace('payment-', ''),
                status: 'pending',
                createdAt: new Date().toISOString(),
                total: parseFloat(document.getElementById('summary-total').textContent.replace('¥', ''))
            };

            // 保存订单
            let orders = JSON.parse(localStorage.getItem('xiaotuxian_orders') || '[]');
            orders.push(order);
            localStorage.setItem('xiaotuxian_orders', JSON.stringify(orders));

            // 清空购物车
            CartManager.clearCart();

            // 显示支付模态框
            showPaymentModal(order);

        } catch (e) {
            console.error('提交订单失败:', e);
            showMessage('提交订单失败: ' + e.message, 'error');
        } finally {
            setSubmitButtonState(false);
        }
    }

    // 设置提交按钮状态
    function setSubmitButtonState(loading) {
        const submitBtn = document.getElementById('submit-order');
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? '提交中...' : '提交订单';
        }
    }

    // 显示支付模态框
    function showPaymentModal(order) {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const paymentAmount = document.getElementById('payment-amount');
        if (paymentAmount) {
            paymentAmount.textContent = `¥${order.total.toFixed(2)}`;
        }

        startPaymentTimer();

        const simulateBtn = document.getElementById('simulate-payment');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', function () {
                completePayment(order);
            });
        }

        const cancelBtn = modal.querySelector('.btn-payment-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hidePaymentModal);
        }
    }

    // 开始支付倒计时
    function startPaymentTimer() {
        let timeLeft = 300;
        const timerElement = document.getElementById('payment-timer');

        if (!timerElement) return;

        window.paymentTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(window.paymentTimer);
                showMessage('支付超时，请重新下单', 'error');
                hidePaymentModal();
            }

            timeLeft--;
        }, 1000);
    }

    // 完成支付
    function completePayment(order) {
        if (window.paymentTimer) {
            clearInterval(window.paymentTimer);
        }

        // 更新订单状态
        let orders = JSON.parse(localStorage.getItem('xiaotuxian_orders') || '[]');
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'paid';
            orders[orderIndex].paidAt = new Date().toISOString();
            localStorage.setItem('xiaotuxian_orders', JSON.stringify(orders));
        }

        hidePaymentModal();
        showMessage('支付成功！订单正在处理中', 'success');

        setTimeout(() => {
            alert(`订单 ${order.id} 支付成功！`);
            window.location.href = 'index.html';
        }, 3000);
    }

    // 隐藏支付模态框
    function hidePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';

            if (window.paymentTimer) {
                clearInterval(window.paymentTimer);
            }
        }
    }

    // ================ 认证相关函数 ================

    // 绑定认证事件
    function bindAuthEvents() {
        const loginLink = document.getElementById('checkout-login-link');
        const registerLink = document.getElementById('checkout-register-link');
        const logoutLink = document.getElementById('checkout-logout-link');

        if (loginLink) {
            loginLink.addEventListener('click', function (e) {
                e.preventDefault();
                showAuthModal();
            });
        }

        if (registerLink) {
            registerLink.addEventListener('click', function (e) {
                e.preventDefault();
                showAuthModal('register');
            });
        }

        if (logoutLink) {
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                logoutUser();
            });
        }
    }

    // 显示认证模态框
    function showAuthModal(formType = 'login') {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');

            if (formType === 'register' && registerForm && loginForm) {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            } else if (loginForm && registerForm) {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            }
        }
    }

    // 隐藏认证模态框
    function hideAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 退出登录
    function logoutUser() {
        localStorage.removeItem('xiaotuxian_user');
        sessionStorage.removeItem('xiaotuxian_user');
        CartManager.clearCart();
        updateUserStatus();
        showMessage('已退出登录', 'success');
    }

    // 绑定模态框关闭事件
    function bindModalCloseEvents() {
        // 认证模态框
        const authOverlay = document.getElementById('auth-overlay');
        const closeAuthModal = document.getElementById('close-auth-modal');

        if (authOverlay) authOverlay.addEventListener('click', hideAuthModal);
        if (closeAuthModal) closeAuthModal.addEventListener('click', hideAuthModal);

        // 支付模态框已在上面的函数中绑定
    }

    // 添加动画样式
    function addAnimationStyles() {
        if (document.querySelector('#checkout-animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'checkout-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(30px); }
            }
            
            @keyframes modalSlideIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            
            .checkout-message {
                animation: slideInRight 0.3s ease-out;
            }
            
            .address-item {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .address-item:hover {
                border-color: #5EB69C;
                box-shadow: 0 2px 8px rgba(94, 182, 156, 0.1);
            }
            
            .address-item.active {
                border-color: #5EB69C;
                background: #f0f9f2;
            }
        `;
        document.head.appendChild(style);
    }

    function createFallbackCartManager() {
        console.warn('创建备用购物车管理器');
        window.CartManager = {
            getCart: function () {
                try {
                    return JSON.parse(localStorage.getItem('xiaotuxian_cart') || '[]');
                } catch (e) {
                    return [];
                }
            },
            isUserLoggedIn: function () {
                return !!(localStorage.getItem('xiaotuxian_user') ||
                    sessionStorage.getItem('xiaotuxian_user'));
            },
            showLoginModal: function () {
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            },
            showSuccess: function (message) {
                showMessage(message, 'success');
            },
            showError: function (message) {
                showMessage(message, 'error');
            },
            clearCart: function () {
                localStorage.removeItem('xiaotuxian_cart');
                // 更新购物车计数
                this.updateCartCount();
            },
            updateCartCount: function () {
                const cart = this.getCart();
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

                document.querySelectorAll('#cart-count, .cart-count').forEach(element => {
                    element.textContent = totalItems;
                    element.style.display = totalItems > 0 ? 'flex' : 'none';
                });
            },
            removeFromCart: function (productId, color) {
                const cart = this.getCart();
                const filteredCart = cart.filter(item => {
                    if (color !== null && color !== undefined) {
                        return !(item.id == productId && item.color === color);
                    }
                    return item.id != productId;
                });

                if (filteredCart.length < cart.length) {
                    localStorage.setItem('xiaotuxian_cart', JSON.stringify(filteredCart));
                    this.updateCartCount();
                    return true;
                }
                return false;
            },
            updateQuantity: function (productId, color, quantity) {
                if (quantity < 1) {
                    return this.removeFromCart(productId, color);
                }

                const cart = this.getCart();
                const index = cart.findIndex(item =>
                    item.id == productId && item.color === color
                );

                if (index >= 0) {
                    cart[index].quantity = quantity;
                    localStorage.setItem('xiaotuxian_cart', JSON.stringify(cart));
                    this.updateCartCount();
                    return true;
                }
                return false;
            }
        };
    }

    // 延迟初始化
    setTimeout(initCheckoutPage, 100);
});
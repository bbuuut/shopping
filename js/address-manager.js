// address-manager.js - 统一地址管理（修复版）
console.log('加载地址管理器...');

// 确保只定义一次 AddressManager
if (typeof window.AddressManager === 'undefined') {
    window.AddressManager = (function() {
        'use strict';
        
        const STORAGE_KEY = 'xiaotuxian_addresses';
        const SELECTED_KEY = 'xiaotuxian_selected_address';
        
        // 初始化默认地址（如果为空）
        function initDefaultAddresses() {
            try {
                const addresses = getAllAddresses();
                if (addresses.length === 0) {
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
                    
                    saveAddresses(defaultAddresses);
                    console.log('初始化了默认地址');
                }
            } catch (e) {
                console.error('初始化默认地址失败:', e);
            }
        }
        
        // 获取所有地址
        function getAllAddresses() {
            try {
                const addressesStr = localStorage.getItem(STORAGE_KEY);
                if (!addressesStr || addressesStr === 'null' || addressesStr === 'undefined') {
                    return [];
                }
                const addresses = JSON.parse(addressesStr);
                return Array.isArray(addresses) ? addresses : [];
            } catch (e) {
                console.error('获取地址失败:', e);
                return [];
            }
        }
        
        // 保存地址列表
        function saveAddresses(addresses) {
            try {
                // 确保每个地址都有唯一的id
                const processedAddresses = addresses.map((addr, index) => {
                    return {
                        ...addr,
                        id: addr.id || Date.now() + index
                    };
                });
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(processedAddresses));
                return true;
            } catch (e) {
                console.error('保存地址失败:', e);
                return false;
            }
        }
        
        return {
            // 获取所有地址
            getAllAddresses: getAllAddresses,
            
            // 获取选中的地址索引
            getSelectedAddressIndex: function() {
                try {
                    const index = localStorage.getItem(SELECTED_KEY);
                    return index !== null ? parseInt(index) : 0;
                } catch (e) {
                    console.error('获取选中地址失败:', e);
                    return 0;
                }
            },
            
            // 设置选中的地址索引
            setSelectedAddressIndex: function(index) {
                try {
                    localStorage.setItem(SELECTED_KEY, index.toString());
                    return true;
                } catch (e) {
                    console.error('设置选中地址失败:', e);
                    return false;
                }
            },
            
            // 保存地址列表
            saveAddresses: saveAddresses,
            
            // 验证地址
            validateAddress: function(address) {
                const errors = [];
                
                if (!address.name || address.name.trim() === '') {
                    errors.push('请输入收货人姓名');
                }
                
                if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) {
                    errors.push('请输入正确的手机号码');
                }
                
                if (!address.province || address.province === '') {
                    errors.push('请选择省份');
                }
                
                if (!address.city || address.city === '') {
                    errors.push('请选择城市');
                }
                
                if (!address.detail || address.detail.trim() === '') {
                    errors.push('请输入详细地址');
                }
                
                return {
                    isValid: errors.length === 0,
                    errors: errors
                };
            },
            
            // 添加新地址
            addAddress: function(address) {
                try {
                    const addresses = this.getAllAddresses();
                    
                    // 如果是默认地址，取消其他默认地址
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
                    if (success) {
                        console.log('地址添加成功:', newAddress);
                        // 如果是第一个地址，设为默认选中
                        if (addresses.length === 1) {
                            this.setSelectedAddressIndex(0);
                        }
                    }
                    
                    return success;
                } catch (e) {
                    console.error('添加地址失败:', e);
                    return false;
                }
            },
            
            // 更新地址
            updateAddress: function(index, address) {
                try {
                    const addresses = this.getAllAddresses();
                    
                    if (index >= 0 && index < addresses.length) {
                        // 如果是默认地址，取消其他默认地址
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
            
            // 删除地址
            deleteAddress: function(index) {
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
            
            // 获取默认地址
            getDefaultAddress: function() {
                const addresses = this.getAllAddresses();
                return addresses.find(addr => addr.isDefault) || addresses[0];
            },
            
            // 获取地址数量
            getAddressCount: function() {
                return this.getAllAddresses().length;
            },
            
            // 清空所有地址
            clearAllAddresses: function() {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(SELECTED_KEY);
                    return true;
                } catch (e) {
                    console.error('清空地址失败:', e);
                    return false;
                }
            },
            
            // 初始化函数
            init: function() {
                initDefaultAddresses();
                console.log('地址管理器初始化完成，共有', this.getAddressCount(), '个地址');
                console.log('地址列表:', this.getAllAddresses());
            }
        };
    })();
    
    // 立即初始化
    window.AddressManager.init();
    
    console.log('地址管理器加载完成');
} else {
    console.log('地址管理器已存在，重新初始化');
    window.AddressManager.init();
}
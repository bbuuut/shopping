// product.js - 商品详情页面（完整数据版）
document.addEventListener('DOMContentLoaded', function () {
    console.log('商品详情页面加载...');

    // 从URL获取商品ID
    function getProductIdFromUrl() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            return productId ? parseInt(productId) : 1;
        } catch (e) {
            console.error('解析URL参数失败:', e);
            return 1;
        }
    }

    // 获取商品信息 - 完整版（包含1-40所有商品）
    function getProductInfo(productId) {
        console.log('获取商品信息，ID:', productId);
        
        // 完整的商品数据（1-40号）
        const allProducts = {
            // 1-16号商品（已有数据）
            1: {
                id: 1,
                name: 'KN95级莫兰迪色防护口罩',
                price: 79.00,
                originalPrice: 99.00,
                category: '口罩',
                brand: '小兔鲜儿',
                stock: 999,
                sales: 2000,
                description: 'KN95级防护口罩，采用莫兰迪色系设计，时尚与防护兼备。采用优质熔喷布，过滤效率≥95%，三层防护结构，透气性好，贴合面部。',
                specs: {
                    level: 'KN95',
                    filter: '≥95%',
                    size: '175mm × 95mm',
                    material: '无纺布、熔喷布、鼻梁条、耳带',
                    certification: 'GB2626-2019标准'
                },
                colors: ['莫兰迪灰', '莫兰迪蓝', '莫兰迪粉'],
                image: 'images/goods1.png',
                features: [
                    'KN95级高效防护',
                    '莫兰迪色系设计',
                    '可调节鼻梁条',
                    '透气内层设计'
                ]
            },
            2: {
                id: 2,
                name: '紫檀外独板三层普洱茶盒',
                price: 566.00,
                originalPrice: 699.00,
                category: '茶具',
                brand: '小兔鲜儿',
                stock: 50,
                sales: 120,
                description: '精选紫檀木普洱茶盒，三层独立设计，适合存放不同年份的普洱茶。纯手工打造，纹理自然，古朴典雅。',
                specs: {
                    material: '紫檀木',
                    size: '30×20×15cm',
                    weight: '2.5kg',
                    craft: '纯手工打造',
                    capacity: '三层独立存储'
                },
                colors: ['原木色'],
                image: 'images/goods2.png',
                features: [
                    '紫檀木材质',
                    '三层独立设计',
                    '手工精制',
                    '防潮防虫'
                ]
            },
            3: {
                id: 3,
                name: '法拉蒙高颜值记事本可定制',
                price: 58.00,
                originalPrice: 88.00,
                category: '文具',
                brand: '法拉蒙',
                stock: 200,
                sales: 500,
                description: '高颜值定制记事本，PU皮质封面，128页内页，适合商务会议和日常记录。支持个性化定制姓名或Logo。',
                specs: {
                    size: 'A5(148×210mm)',
                    pages: '128页',
                    cover: 'PU皮质',
                    binding: '锁线胶装',
                    paper: '80g优质纸张'
                },
                colors: ['黑色', '棕色', '蓝色'],
                image: 'images/goods3.png',
                features: [
                    '支持个性化定制',
                    'PU皮质封面',
                    '锁线装订',
                    '便携设计'
                ]
            },
            4: {
                id: 4,
                name: '科技布布艺沙发',
                price: 3579.00,
                originalPrice: 3999.00,
                category: '家居',
                brand: '小兔鲜儿',
                stock: 20,
                sales: 35,
                description: '科技布材质沙发，模拟真皮质感，舒适耐用，易清洁。实木框架，高密度海绵填充，适合现代家居风格。',
                specs: {
                    material: '科技布',
                    size: '三人位(220×90×85cm)',
                    frame: '实木框架',
                    fill: '高密度海绵',
                    color: '灰色/米色/深蓝可选'
                },
                colors: ['灰色', '米色', '深蓝'],
                image: 'images/goods4.png',
                features: [
                    '科技布材质',
                    '易清洁打理',
                    '实木框架',
                    '高密度海绵'
                ]
            },
            5: {
                id: 5,
                name: '特惠推荐组合',
                price: 29.90,
                originalPrice: 49.90,
                category: '推荐',
                brand: '小兔鲜儿',
                stock: 1000,
                sales: 5000,
                description: '精选特惠商品组合，涵盖日常用品、零食、家居好物，满足您的各种需求。',
                specs: {
                    type: '综合商品组合',
                    delivery: '全国包邮',
                    validity: '长期有效',
                    packaging: '精美礼盒'
                },
                colors: ['默认'],
                image: 'images/recommend1.png',
                features: [
                    '精选组合',
                    '超值优惠',
                    '包邮配送',
                    '品质保证'
                ]
            },
            6: {
                id: 6,
                name: '爆款人气好物',
                price: 39.90,
                originalPrice: 59.90,
                category: '推荐',
                brand: '小兔鲜儿',
                stock: 800,
                sales: 3000,
                description: '全网热销人气商品，经过用户验证的高品质好物，值得信赖的选择。',
                specs: {
                    type: '热门单品',
                    delivery: '全国包邮',
                    sales: '月销3000+',
                    rating: '4.8分好评'
                },
                colors: ['默认'],
                image: 'images/recommend2.png',
                features: [
                    '人气爆款',
                    '用户验证',
                    '高性价比',
                    '快速发货'
                ]
            },
            7: {
                id: 7,
                name: '节日礼品一站购',
                price: 99.00,
                originalPrice: 129.00,
                category: '礼品',
                brand: '小兔鲜儿',
                stock: 200,
                sales: 800,
                description: '精心搭配的节日礼品组合，适合各种节日赠送，包装精美，大方得体。',
                specs: {
                    type: '礼品套装',
                    delivery: '全国包邮',
                    packaging: '节日礼盒',
                    occasions: '生日/节日/纪念日'
                },
                colors: ['默认'],
                image: 'images/recommend3.png',
                features: [
                    '礼品组合',
                    '精美包装',
                    '适合送礼',
                    '贴心服务'
                ]
            },
            8: {
                id: 8,
                name: '鲜花园艺套组',
                price: 49.90,
                originalPrice: 69.90,
                category: '园艺',
                brand: '小兔鲜儿',
                stock: 300,
                sales: 1200,
                description: '鲜花园艺爱好者必备套组，包含种子、工具和养护指南，为生活增添绿意。',
                specs: {
                    type: '园艺套组',
                    delivery: '全国包邮',
                    components: '种子+工具+指南',
                    difficulty: '初学者友好'
                },
                colors: ['默认'],
                image: 'images/recommend4.png',
                features: [
                    '全套工具',
                    '新手指导',
                    '易成活种子',
                    '美化环境'
                ]
            },
            9: {
                id: 9,
                name: '双味千层手抓饼烤肉组合',
                price: 89.99,
                originalPrice: 109.99,
                category: '生鲜',
                brand: '小兔鲜儿',
                stock: 150,
                sales: 300,
                description: '双味千层，手抓饼烤肉组合240g/袋 4片装，加热即食，方便快捷，早餐优选。',
                specs: {
                    weight: '240g',
                    pieces: '4片装',
                    storage: '-18℃冷冻保存',
                    shelfLife: '12个月',
                    cooking: '加热即食'
                },
                colors: ['原味', '辣味'],
                image: 'images/fresh1.png',
                features: [
                    '双味可选',
                    '加热即食',
                    '千层口感',
                    '早餐优选'
                ]
            },
            10: {
                id: 10,
                name: '云南甘蔗红糖馒头',
                price: 9.99,
                originalPrice: 12.99,
                category: '生鲜',
                brand: '小兔鲜儿',
                stock: 200,
                sales: 500,
                description: '云南甘蔗慢熬红糖馒头220g/袋 5个装，传统工艺，香甜可口，营养健康。',
                specs: {
                    weight: '220g',
                    pieces: '5个装',
                    storage: '-18℃冷冻保存',
                    shelfLife: '6个月',
                    material: '小麦粉、红糖、酵母'
                },
                colors: ['红糖味'],
                image: 'images/fresh2.png',
                features: [
                    '云南红糖',
                    '传统工艺',
                    '营养健康',
                    '早餐优选'
                ]
            },
            11: {
                id: 11,
                name: '日式风味小圆饼',
                price: 19.90,
                originalPrice: 29.90,
                category: '零食',
                brand: '小兔鲜儿',
                stock: 300,
                sales: 800,
                description: '日式风味小圆饼，海盐口味，酥脆可口，独立小包装，方便携带。',
                specs: {
                    weight: '150g',
                    flavor: '海盐味',
                    packaging: '独立小包装',
                    shelfLife: '12个月'
                },
                colors: ['海盐味'],
                image: 'images/fresh3.png',
                features: [
                    '海盐口味',
                    '酥脆可口',
                    '独立包装',
                    '方便携带'
                ]
            },
            12: {
                id: 12,
                name: '全麦奶油小面包',
                price: 69.00,
                originalPrice: 89.00,
                category: '西点',
                brand: '小兔鲜儿',
                stock: 180,
                sales: 400,
                description: '全麦奶油浓香小面包50g*12袋，营养健康，早餐优选。',
                specs: {
                    weight: '600g(50g×12袋)',
                    material: '全麦粉、奶油',
                    storage: '常温干燥',
                    shelfLife: '30天'
                },
                colors: ['原味'],
                image: 'images/fresh4.png',
                features: [
                    '全麦营养',
                    '奶油浓香',
                    '独立包装',
                    '早餐优选'
                ]
            },
            13: {
                id: 13,
                name: '秘制外皮五福摩提大福点心',
                price: 39.99,
                originalPrice: 49.99,
                category: '西点',
                brand: '小兔鲜儿',
                stock: 150,
                sales: 300,
                description: '秘制外皮五福摩提大福点心150g/盒，美味西点，五种口味满足不同需求。',
                specs: {
                    weight: '150g',
                    storage: '冷冻保存',
                    shelfLife: '12个月',
                    flavors: '抹茶、巧克力、草莓、芒果、香草'
                },
                colors: ['混合口味'],
                image: 'images/fresh5.png',
                features: [
                    '五种口味混合',
                    '秘制软糯外皮',
                    '即食甜点',
                    '礼盒包装'
                ]
            },
            14: {
                id: 14,
                name: '水果面膜韩国蜂蜜柚子茶',
                price: 89.99,
                originalPrice: 109.99,
                category: '冲调饮品',
                brand: '韩国进口',
                stock: 200,
                sales: 150,
                description: '水果面膜韩国蜂蜜柚子茶560g/瓶，精选韩国蜂蜜和柚子，天然健康饮品。',
                specs: {
                    weight: '560g',
                    origin: '韩国',
                    ingredients: '蜂蜜、柚子、糖',
                    shelfLife: '24个月'
                },
                colors: ['原味'],
                image: 'images/fresh6.png',
                features: [
                    '韩国原装进口',
                    '真材实料',
                    '润喉养生',
                    '便携包装'
                ]
            },
            15: {
                id: 15,
                name: '浓情比利时巧克力礼盒装',
                price: 120.00,
                originalPrice: 159.99,
                category: '糖果零食',
                brand: '比利时进口',
                stock: 100,
                sales: 80,
                description: '浓情比利时巧克力礼盒装205克/盒，精选比利时进口巧克力，礼盒包装适合送礼。',
                specs: {
                    weight: '205g',
                    origin: '比利时',
                    cacao: '70%',
                    shelfLife: '12个月'
                },
                colors: ['黑巧克力', '牛奶巧克力'],
                image: 'images/fresh7.png',
                features: [
                    '比利时进口',
                    '礼盒装设计',
                    '浓郁可可风味',
                    '节日送礼佳品'
                ]
            },
            16: {
                id: 16,
                name: '抹茶奶油小蛋糕礼盒装',
                price: 60.00,
                originalPrice: 79.99,
                category: '西点',
                brand: '小兔鲜儿',
                stock: 180,
                sales: 120,
                description: '抹茶奶油小蛋糕礼盒装220克/盒，精选日本抹茶粉，奶油夹心，口感细腻。',
                specs: {
                    weight: '220g',
                    pieces: '8个装',
                    teaOrigin: '日本宇治抹茶',
                    shelfLife: '30天'
                },
                colors: ['抹茶味'],
                image: 'images/fresh8.png',
                features: [
                    '日本宇治抹茶',
                    '奶油夹心',
                    '独立包装',
                    '下午茶首选'
                ]
            },

            // 服装区块商品（17-24）
            17: {
                id: 17,
                name: '潮流休闲夹克',
                price: 719.00,
                originalPrice: 899.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 50,
                sales: 120,
                description: '潮流休闲夹克，春季新款，采用优质面料，舒适透气，时尚百搭。设计简约大方，适合日常休闲穿搭。',
                specs: {
                    material: '棉质混纺',
                    size: 'M/L/XL',
                    color: '黑色/灰色/卡其色',
                    style: '休闲',
                    season: '春季'
                },
                colors: ['黑色', '灰色', '卡其色'],
                image: 'images/clothes1.png',
                features: [
                    '春季新款设计',
                    '舒适透气面料',
                    '多色可选',
                    '休闲百搭'
                ]
            },
            18: {
                id: 18,
                name: '时尚连衣裙',
                price: 699.00,
                originalPrice: 799.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 60,
                sales: 180,
                description: '时尚连衣裙，优雅知性，采用优质雪纺面料，轻盈飘逸。适合各种场合穿着，展现女性魅力。',
                specs: {
                    material: '雪纺',
                    size: 'S/M/L',
                    color: '白色/粉色/蓝色',
                    length: '中长款',
                    collar: 'V领'
                },
                colors: ['白色', '粉色', '蓝色'],
                image: 'images/clothes2.png',
                features: [
                    '优雅知性设计',
                    '雪纺面料轻盈',
                    '多色可选',
                    '适合多种场合'
                ]
            },
            19: {
                id: 19,
                name: '商务休闲裤',
                price: 229.00,
                originalPrice: 299.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 100,
                sales: 250,
                description: '商务休闲裤，舒适百搭，采用弹性面料，穿着舒适不紧绷。适合商务休闲场合。',
                specs: {
                    material: '涤纶混纺',
                    size: '28-38码',
                    color: '黑色/灰色/深蓝',
                    style: '直筒',
                    waist: '松紧腰设计'
                },
                colors: ['黑色', '灰色', '深蓝'],
                image: 'images/clothes3.png',
                features: [
                    '商务休闲风格',
                    '弹性舒适面料',
                    '多尺码可选',
                    '易于搭配'
                ]
            },
            20: {
                id: 20,
                name: '纯棉T恤',
                price: 14.50,
                originalPrice: 29.90,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 500,
                sales: 1200,
                description: '纯棉T恤，简约基础款，柔软舒适，透气性好。经典设计，百搭实用。',
                specs: {
                    material: '100%纯棉',
                    size: 'S/M/L/XL',
                    color: '白色/黑色/灰色',
                    thickness: '适中',
                    collar: '圆领'
                },
                colors: ['白色', '黑色', '灰色'],
                image: 'images/clothes4.png',
                features: [
                    '100%纯棉面料',
                    '简约基础款',
                    '柔软舒适',
                    '透气性好'
                ]
            },
            21: {
                id: 21,
                name: '女士针织衫',
                price: 179.00,
                originalPrice: 229.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 80,
                sales: 150,
                description: '女士针织衫，柔软舒适，保暖性好。简约设计，适合春秋季节穿着。',
                specs: {
                    material: '羊毛混纺',
                    size: 'S/M/L',
                    color: '米色/粉色/浅灰',
                    thickness: '适中',
                    style: '开衫'
                },
                colors: ['米色', '粉色', '浅灰'],
                image: 'images/clothes5.png',
                features: [
                    '羊毛混纺材质',
                    '柔软舒适',
                    '保暖性好',
                    '春秋季适用'
                ]
            },
            22: {
                id: 22,
                name: '男士风衣',
                price: 565.00,
                originalPrice: 699.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 40,
                sales: 80,
                description: '男士风衣，防风保暖，设计经典大气。适合春秋季节穿着，展现成熟魅力。',
                specs: {
                    material: '涤纶防水面料',
                    size: 'M/L/XL/XXL',
                    color: '卡其色/黑色/深蓝',
                    length: '中长款',
                    lining: '可拆卸内衬'
                },
                colors: ['卡其色', '黑色', '深蓝'],
                image: 'images/clothes6.png',
                features: [
                    '防风防水设计',
                    '经典大气款式',
                    '可拆卸内衬',
                    '多尺码可选'
                ]
            },
            23: {
                id: 23,
                name: '运动套装',
                price: 99.99,
                originalPrice: 129.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 120,
                sales: 300,
                description: '运动套装，健身必备，采用速干面料，透气排汗。适合运动健身穿着。',
                specs: {
                    material: '速干面料',
                    size: 'S/M/L/XL',
                    color: '黑色/灰色/蓝色',
                    set: '上衣+裤子',
                    season: '四季通用'
                },
                colors: ['黑色', '灰色', '蓝色'],
                image: 'images/clothes7.png',
                features: [
                    '速干透气面料',
                    '运动健身必备',
                    '套装搭配',
                    '舒适不紧绷'
                ]
            },
            24: {
                id: 24,
                name: '情侣卫衣',
                price: 269.00,
                originalPrice: 329.00,
                category: '服装',
                brand: '小兔鲜儿',
                stock: 90,
                sales: 180,
                description: '情侣卫衣，时尚潮流，情侣款设计。柔软舒适，适合情侣日常穿着。',
                specs: {
                    material: '棉质抓绒',
                    size: '情侣款（男M-XXL，女S-L）',
                    color: '黑色/白色/灰色',
                    style: '连帽',
                    pattern: '简约印花'
                },
                colors: ['黑色', '白色', '灰色'],
                image: 'images/clothes8.png',
                features: [
                    '情侣款设计',
                    '时尚潮流',
                    '柔软抓绒面料',
                    '适合日常穿着'
                ]
            },

            // 餐厨区块商品（25-32）
            25: {
                id: 25,
                name: '不锈钢炒锅',
                price: 210.00,
                originalPrice: 299.00,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 80,
                sales: 200,
                description: '不锈钢炒锅，不粘易清洗，采用优质不锈钢材质，导热均匀，使用寿命长。',
                specs: {
                    material: '304不锈钢',
                    diameter: '32cm',
                    handle: '防烫木柄',
                    thickness: '1.5mm',
                    weight: '2.1kg'
                },
                colors: ['银色'],
                image: 'images/kitchen1.png',
                features: [
                    '304不锈钢材质',
                    '不粘易清洗',
                    '防烫木柄',
                    '导热均匀'
                ]
            },
            26: {
                id: 26,
                name: '陶瓷餐具套装',
                price: 32.99,
                originalPrice: 49.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 150,
                sales: 400,
                description: '陶瓷餐具套装，精美耐用，釉面光滑，易清洗。套装包含碗盘等多种餐具。',
                specs: {
                    material: '高温陶瓷',
                    set: '20件套',
                    color: '白色/蓝色/粉色',
                    microwave: '微波炉适用',
                    dishwasher: '洗碗机安全'
                },
                colors: ['白色', '蓝色', '粉色'],
                image: 'images/kitchen2.png',
                features: [
                    '高温陶瓷材质',
                    '20件套装',
                    '微波炉适用',
                    '易于清洗'
                ]
            },
            27: {
                id: 27,
                name: '智能电饭煲',
                price: 30.00,
                originalPrice: 49.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 100,
                sales: 250,
                description: '智能电饭煲，多功能烹饪，具有煮饭、煲汤、蒸煮等多种功能。操作简单，使用方便。',
                specs: {
                    capacity: '3L',
                    power: '500W',
                    functions: '煮饭/煲汤/蒸煮',
                    control: '微电脑控制',
                    material: '不粘内胆'
                },
                colors: ['白色', '黑色'],
                image: 'images/kitchen3.png',
                features: [
                    '多功能烹饪',
                    '智能控制',
                    '不粘内胆',
                    '操作简单'
                ]
            },
            28: {
                id: 28,
                name: '厨具收纳架',
                price: 69.99,
                originalPrice: 89.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 120,
                sales: 300,
                description: '厨具收纳架，节省空间，多层设计可分类存放各种厨具。材质坚固，易于清洁。',
                specs: {
                    material: '不锈钢',
                    layers: '3层',
                    size: '40×30×50cm',
                    weight: '2.5kg',
                    color: '银色'
                },
                colors: ['银色'],
                image: 'images/kitchen4.png',
                features: [
                    '多层收纳设计',
                    '节省厨房空间',
                    '不锈钢材质',
                    '易于清洁'
                ]
            },
            29: {
                id: 29,
                name: '玻璃保鲜盒',
                price: 99.99,
                originalPrice: 129.00,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 200,
                sales: 500,
                description: '玻璃保鲜盒，微波炉适用，密封性好，可冷藏、冷冻、微波加热。健康安全，易清洗。',
                specs: {
                    material: '耐热玻璃',
                    set: '6件套',
                    capacity: '500ml-1500ml',
                    seal: '硅胶密封圈',
                    microwave: '微波炉适用'
                },
                colors: ['透明'],
                image: 'images/kitchen5.png',
                features: [
                    '耐热玻璃材质',
                    '6件套装',
                    '微波炉适用',
                    '密封保鲜'
                ]
            },
            30: {
                id: 30,
                name: '水果刀套装',
                price: 35.00,
                originalPrice: 49.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 150,
                sales: 400,
                description: '水果刀套装，锋利耐用，包含不同尺寸的水果刀，满足各种水果切割需求。',
                specs: {
                    material: '不锈钢刀片',
                    set: '3把装',
                    handle: '防滑塑料',
                    sharpness: '锋利耐用',
                    storage: '刀架收纳'
                },
                colors: ['银色'],
                image: 'images/kitchen6.png',
                features: [
                    '不锈钢刀片',
                    '3把套装',
                    '防滑手柄',
                    '锋利耐用'
                ]
            },
            31: {
                id: 31,
                name: '调味瓶套装',
                price: 12.99,
                originalPrice: 19.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 300,
                sales: 800,
                description: '调味瓶套装，防潮防漏，设计合理，方便取用调料。透明瓶身，可清晰看到调料余量。',
                specs: {
                    material: '玻璃瓶身+塑料盖',
                    set: '4件套',
                    capacity: '200ml/瓶',
                    seal: '防漏设计',
                    color: '透明'
                },
                colors: ['透明'],
                image: 'images/kitchen7.png',
                features: [
                    '防潮防漏设计',
                    '4件套装',
                    '透明瓶身',
                    '方便取用'
                ]
            },
            32: {
                id: 32,
                name: '不粘煎锅',
                price: 56.99,
                originalPrice: 79.90,
                category: '餐厨',
                brand: '小兔鲜儿',
                stock: 100,
                sales: 250,
                description: '不粘煎锅，健康无涂层，采用特殊处理工艺，实现不粘效果。轻便耐用，易清洗。',
                specs: {
                    material: '铝合金+不粘涂层',
                    diameter: '28cm',
                    handle: '耐热塑料',
                    thickness: '3mm',
                    weight: '1.2kg'
                },
                colors: ['黑色'],
                image: 'images/kitchen8.png',
                features: [
                    '健康不粘涂层',
                    '轻便耐用',
                    '易于清洗',
                    '导热均匀'
                ]
            },

            // 居家区块商品（33-40）
            33: {
                id: 33,
                name: '北欧风抱枕',
                price: 59.00,
                originalPrice: 79.00,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 150,
                sales: 300,
                description: '北欧风抱枕，舒适柔软，精选优质填充物，为家居增添温馨感和舒适度。',
                specs: {
                    material: '棉麻面料',
                    size: '45×45cm',
                    fill: '羽绒棉',
                    weight: '0.8kg',
                    color: '灰色/米色/深蓝'
                },
                colors: ['灰色', '米色', '深蓝'],
                image: 'images/home1.png',
                features: [
                    '北欧简约风格',
                    '舒适柔软',
                    '多色可选',
                    '易于搭配'
                ]
            },
            34: {
                id: 34,
                name: '创意装饰画',
                price: 39.00,
                originalPrice: 59.00,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 80,
                sales: 150,
                description: '创意装饰画，简约现代，为家居空间增添艺术气息。多种图案可选，适合不同装修风格。',
                specs: {
                    material: '油画布',
                    size: '40×50cm',
                    frame: '实木画框',
                    style: '现代简约',
                    weight: '1.2kg'
                },
                colors: ['多种图案'],
                image: 'images/home2.png',
                features: [
                    '创意设计',
                    '现代简约风格',
                    '实木画框',
                    '提升家居品味'
                ]
            },
            35: {
                id: 35,
                name: '香薰蜡烛',
                price: 19.90,
                originalPrice: 29.90,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 200,
                sales: 500,
                description: '香薰蜡烛，助眠安神，精选天然植物蜡，搭配多种香型，营造温馨舒适的家居氛围。',
                specs: {
                    material: '大豆蜡',
                    weight: '200g',
                    burnTime: '约30小时',
                    scent: '多种香型可选',
                    container: '玻璃杯'
                },
                colors: ['白色', '粉色', '蓝色'],
                image: 'images/home3.png',
                features: [
                    '天然大豆蜡',
                    '多种香型可选',
                    '助眠安神',
                    '营造温馨氛围'
                ]
            },
            36: {
                id: 36,
                name: '加湿器',
                price: 29.90,
                originalPrice: 49.90,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 120,
                sales: 300,
                description: '加湿器，静音大容量，智能恒湿，为干燥环境补充水分。操作简单，使用安全。',
                specs: {
                    capacity: '3L',
                    power: '25W',
                    noise: '<35dB',
                    function: '智能恒湿',
                    material: 'ABS塑料'
                },
                colors: ['白色', '蓝色'],
                image: 'images/home4.png',
                features: [
                    '大容量设计',
                    '静音运行',
                    '智能恒湿',
                    '操作简单'
                ]
            },
            37: {
                id: 37,
                name: '收纳箱',
                price: 29.90,
                originalPrice: 39.90,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 180,
                sales: 450,
                description: '收纳箱，多层分类，采用优质PP材料，坚固耐用。透明设计，方便查找物品。',
                specs: {
                    material: 'PP塑料',
                    size: '40×30×20cm',
                    capacity: '24L',
                    color: '透明/白色',
                    features: '可叠放'
                },
                colors: ['透明', '白色'],
                image: 'images/home5.png',
                features: [
                    '多层分类设计',
                    '透明可视',
                    '可叠放收纳',
                    '坚固耐用'
                ]
            },
            38: {
                id: 38,
                name: '懒人沙发',
                price: 79.00,
                originalPrice: 99.00,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 60,
                sales: 120,
                description: '懒人沙发，舒适便携，填充优质颗粒，可随意调整形状。适合客厅、卧室等多种场景。',
                specs: {
                    material: '绒布面料',
                    size: '80×80×50cm',
                    fill: 'EPS颗粒',
                    weight: '3.5kg',
                    color: '灰色/米色/蓝色'
                },
                colors: ['灰色', '米色', '蓝色'],
                image: 'images/home6.png',
                features: [
                    '舒适便携',
                    '可调整形状',
                    '多场景适用',
                    '易于清洁'
                ]
            },
            39: {
                id: 39,
                name: '绿植盆栽',
                price: 29.00,
                originalPrice: 39.00,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 100,
                sales: 250,
                description: '绿植盆栽，净化空气，精选易养植物，为家居增添绿意。搭配精美花盆，美观实用。',
                specs: {
                    plant: '多肉/绿萝/仙人掌',
                    pot: '陶瓷花盆',
                    size: '15-20cm高',
                    care: '易养护',
                    function: '净化空气'
                },
                colors: ['绿色'],
                image: 'images/home7.png',
                features: [
                    '净化空气',
                    '易养护植物',
                    '精美花盆',
                    '增添家居绿意'
                ]
            },
            40: {
                id: 40,
                name: '毛巾套装',
                price: 39.00,
                originalPrice: 59.00,
                category: '居家',
                brand: '小兔鲜儿',
                stock: 200,
                sales: 500,
                description: '毛巾套装，柔软吸水，采用优质棉质材料，亲肤舒适。多种颜色可选，满足不同需求。',
                specs: {
                    material: '100%纯棉',
                    set: '4件套',
                    size: '34×76cm',
                    weight: '500g',
                    color: '多种颜色可选'
                },
                colors: ['白色', '蓝色', '粉色', '灰色'],
                image: 'images/home8.png',
                features: [
                    '100%纯棉材质',
                    '4件套装',
                    '柔软吸水',
                    '亲肤舒适'
                ]
            }
        };

        // 返回对应商品，如果找不到则返回默认商品
        if (allProducts[productId]) {
            console.log('找到商品:', allProducts[productId]);
            return allProducts[productId];
        }

        console.warn('未找到商品，返回默认商品');
        return {
            id: productId,
            name: `商品 ${productId}`,
            price: 99.00,
            originalPrice: 129.00,
            category: '默认分类',
            brand: '小兔鲜儿',
            stock: 100,
            sales: 0,
            description: '优质商品，值得拥有。',
            specs: {},
            colors: ['默认'],
            image: `images/goods${productId % 4 + 1}.png`,
            features: ['优质材料', '做工精细', '正品保证']
        };
    }

    // ================ 以下函数保持不变 ================

    // 更新商品信息显示
    function updateProductInfo(product) {
        console.log('更新商品信息:', product);

        // 更新商品标题
        const titleElement = document.getElementById('product-title');
        if (titleElement) titleElement.textContent = product.name;

        // 更新商品价格
        const priceElement = document.getElementById('product-price');
        if (priceElement) {
            priceElement.textContent = `¥${product.price.toFixed(2)}`;
        }

        // 更新原价显示
        const originalPriceElements = document.querySelectorAll('.original-price');
        originalPriceElements.forEach(el => {
            if (product.originalPrice && product.originalPrice > product.price) {
                el.textContent = `¥${product.originalPrice.toFixed(2)}`;
                el.style.display = 'inline';
            } else {
                el.style.display = 'none';
            }
        });

        // 更新折扣显示
        const discountElement = document.querySelector('.discount');
        if (discountElement && product.originalPrice && product.originalPrice > product.price) {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            discountElement.textContent = `${discount}折`;
            discountElement.style.display = 'inline';
        } else if (discountElement) {
            discountElement.style.display = 'none';
        }

        // 更新品牌
        const brandElement = document.getElementById('product-brand');
        if (brandElement) brandElement.textContent = product.brand || '小兔鲜儿';

        // 更新库存
        const stockElement = document.getElementById('product-stock');
        const availableStockElement = document.getElementById('available-stock');
        if (stockElement) stockElement.textContent = `${product.stock || 0}件`;
        if (availableStockElement) availableStockElement.textContent = product.stock || 0;

        // 更新销量
        const salesElement = document.getElementById('product-sales');
        if (salesElement) salesElement.textContent = `${product.sales || 0}+件`;

        // 更新分类
        const categoryElement = document.getElementById('product-category');
        if (categoryElement) categoryElement.textContent = product.category || '商品分类';

        // 更新主图
        updateMainImage(product);

        // 更新面包屑导航
        updateBreadcrumb(product);

        // 更新颜色选项
        updateColorOptions(product);

        // 更新商品描述
        updateProductDescription(product);

        // 更新规格参数
        updateProductSpecs(product);
    }

    // 更新主图
    function updateMainImage(product) {
        const mainImage = document.getElementById('product-main-image');
        if (mainImage) {
            // 设置商品对应的图片
            if (product.image) {
                mainImage.src = product.image;
                mainImage.alt = product.name;
            } else {
                // 如果没有指定图片，根据商品ID选择
                mainImage.src = `images/goods${product.id || 1}.png`;
                mainImage.alt = product.name;
            }

            // 图片加载失败时使用默认图片
            mainImage.onerror = function () {
                console.warn('主图加载失败，使用默认图片');
                this.src = 'images/goods1.png';
                this.alt = '商品图片';
            };
        }

        // 更新缩略图
        updateThumbnail(product);
    }

    // 更新缩略图（只保留一张）
    function updateThumbnail(product) {
        const thumbnailList = document.querySelector('.thumbnail-list');
        if (!thumbnailList) return;

        // 清空现有缩略图
        thumbnailList.innerHTML = '';

        // 创建单张缩略图
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail active';

        // 使用与主图相同的图片
        let thumbnailSrc;
        if (product.image) {
            thumbnailSrc = product.image;
        } else {
            thumbnailSrc = `images/goods${product.id || 1}.png`;
        }

        thumbnail.setAttribute('data-image', thumbnailSrc);

        const img = document.createElement('img');
        img.src = thumbnailSrc;
        img.alt = `${product.name} 缩略图`;

        // 图片加载失败处理
        img.onerror = function () {
            console.warn('缩略图加载失败，使用默认图片');
            this.src = 'images/goods1.png';
            this.alt = '商品缩略图';
        };

        thumbnail.appendChild(img);
        thumbnailList.appendChild(thumbnail);

        // 重新绑定缩略图点击事件
        initImageGallery();
    }

    // 更新面包屑导航
    function updateBreadcrumb(product) {
        const breadcrumbElement = document.querySelector('.product-breadcrumb');
        if (breadcrumbElement) {
            const categorySpan = breadcrumbElement.querySelector('#product-category');
            if (categorySpan) {
                categorySpan.textContent = product.category || '商品分类';
            }
        }
    }

    // 更新颜色选项
    function updateColorOptions(product) {
        const optionValuesContainer = document.querySelector('.option-values');
        if (!optionValuesContainer) return;

        // 清空现有选项
        optionValuesContainer.innerHTML = '';

        // 获取商品颜色数组，如果没有则使用默认
        const colors = product.colors || ['默认'];

        // 添加颜色选项
        colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `option-value ${index === 0 ? 'active' : ''}`;
            button.setAttribute('data-value', color);
            button.textContent = color;
            optionValuesContainer.appendChild(button);
        });

        // 重新绑定颜色选择事件
        initColorSelection();
    }

    // 初始化颜色选择
    function initColorSelection() {
        const colorButtons = document.querySelectorAll('.option-value');

        colorButtons.forEach(button => {
            button.addEventListener('click', function () {
                // 移除所有按钮的 active 类
                colorButtons.forEach(btn => btn.classList.remove('active'));
                // 为当前按钮添加 active 类
                this.classList.add('active');
            });
        });
    }

    // 更新商品描述
    function updateProductDescription(product) {
        const descriptionTab = document.getElementById('description');
        if (!descriptionTab) return;

        let descriptionHTML = `
            <h3>商品描述</h3>
            <p>${product.description || '优质商品，值得拥有。'}</p>
        `;

        // 如果有产品特点
        if (product.features && product.features.length > 0) {
            descriptionHTML += `
                <p><strong>【产品特点】</strong></p>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        } else {
            // 默认特点
            descriptionHTML += `
                <p><strong>【产品特点】</strong></p>
                <ul>
                    <li>优质材料，做工精细</li>
                    <li>设计合理，使用方便</li>
                    <li>${product.colors && product.colors.length > 1 ? '多种颜色可选' : '标准配色'}</li>
                    <li>正品保证，售后无忧</li>
                </ul>
            `;
        }

        descriptionTab.innerHTML = descriptionHTML;
    }

    // 更新规格参数
    function updateProductSpecs(product) {
        const specsTab = document.getElementById('specs');
        if (!specsTab) return;

        let specsHTML = '<h3>规格参数</h3>';
        specsHTML += '<table class="specs-table">';

        // 基本参数
        specsHTML += `
            <tr><td>商品名称</td><td>${product.name}</td></tr>
            <tr><td>商品价格</td><td>¥${product.price.toFixed(2)}</td></tr>
            <tr><td>商品分类</td><td>${product.category || '默认分类'}</td></tr>
            <tr><td>商品品牌</td><td>${product.brand || '小兔鲜儿'}</td></tr>
            <tr><td>商品库存</td><td>${product.stock || 0}件</td></tr>
        `;

        // 如果商品有详细规格，添加它们
        if (product.specs && typeof product.specs === 'object') {
            Object.entries(product.specs).forEach(([key, value]) => {
                specsHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
            });
        }

        specsHTML += '</table>';
        specsTab.innerHTML = specsHTML;
    }

    // 初始化商品详情页面组件
    function initProductComponents() {
        const productId = getProductIdFromUrl();
        const product = getProductInfo(productId);

        console.log('加载商品详情:', product);

        // 更新商品信息
        updateProductInfo(product);

        // 初始化数量选择器
        initQuantitySelector();

        // 初始化图片轮播（现在只有一张缩略图）
        initImageGallery();

        // 初始化标签页
        initTabSwitcher();

        // 初始化操作按钮
        initProductActions();
    }

    // 初始化数量选择器
    function initQuantitySelector() {
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        const quantityInput = document.getElementById('quantity');

        if (!minusBtn || !plusBtn || !quantityInput) {
            console.warn('数量选择器元素未找到');
            return;
        }

        minusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value) || 1;
            const stock = parseInt(document.getElementById('available-stock')?.textContent || 999);
            if (currentValue < stock) {
                quantityInput.value = currentValue + 1;
            } else {
                alert(`库存只有${stock}件`);
            }
        });

        quantityInput.addEventListener('change', function () {
            let value = parseInt(this.value) || 1;
            const stock = parseInt(document.getElementById('available-stock')?.textContent || 999);

            if (value < 1) {
                this.value = 1;
            } else if (value > stock) {
                this.value = stock;
                alert(`库存只有${stock}件`);
            }
        });
    }

    // 初始化图片轮播（简化版，只有一张缩略图）
    function initImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('product-main-image');

        if (!mainImage) return;

        thumbnails.forEach(thumbnail => {
            // 移除旧的事件监听器
            const newThumbnail = thumbnail.cloneNode(true);
            thumbnail.parentNode.replaceChild(newThumbnail, thumbnail);

            // 重新绑定事件
            newThumbnail.addEventListener('click', function () {
                // 移除所有缩略图的 active 类
                document.querySelectorAll('.thumbnail').forEach(t => {
                    t.classList.remove('active');
                });

                // 添加 active 类到当前缩略图
                this.classList.add('active');

                // 更新主图（虽然和缩略图是同一张图）
                const imageUrl = this.getAttribute('data-image');
                if (imageUrl) {
                    mainImage.src = imageUrl;
                    mainImage.alt = this.querySelector('img')?.alt || '商品图片';
                }
            });
        });
    }

    // 初始化标签页
    function initTabSwitcher() {
        const tabHeaders = document.querySelectorAll('.tab-header');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabHeaders.length === 0 || tabContents.length === 0) {
            console.warn('标签页元素未找到');
            return;
        }

        tabHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                // 更新标签头
                tabHeaders.forEach(h => h.classList.remove('active'));
                this.classList.add('active');

                // 更新内容
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // 初始化商品操作按钮
    function initProductActions() {
        const addToCartBtn = document.getElementById('add-to-cart');
        const buyNowBtn = document.getElementById('buy-now');
        const favoriteBtn = document.getElementById('add-favorite');

        // 加入购物车按钮
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                console.log('点击加入购物车按钮');

                // 获取商品信息
                const productId = getProductIdFromUrl();
                const selectedColor = document.querySelector('.option-value.active')?.getAttribute('data-value') || '默认';
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);

                // 使用 CartManager 添加商品
                const success = await window.CartManager.addToCart(productId, {
                    quantity: quantity,
                    color: selectedColor
                });

                if (success) {
                    // 按钮动画
                    this.classList.add('button-click');
                    setTimeout(() => {
                        this.classList.remove('button-click');
                    }, 200);
                }
            });
        }

        // 立即购买按钮
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                console.log('点击立即购买按钮');

                // 获取商品信息
                const productId = getProductIdFromUrl();
                const selectedColor = document.querySelector('.option-value.active')?.getAttribute('data-value') || '默认';
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);

                // 使用 CartManager 添加商品
                const success = await window.CartManager.addToCart(productId, {
                    quantity: quantity,
                    color: selectedColor
                });

                if (success) {
                    // 跳转到结算页面
                    setTimeout(() => {
                        window.location.href = 'checkout.html';
                    }, 500);
                }
            });
        }

        // 收藏按钮
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                addToFavorites();
            });
        }
    }

    // 添加到收藏夹
    function addToFavorites() {
        try {
            // 检查用户是否登录
            if (!window.CartManager.isUserLoggedIn()) {
                window.CartManager.showLoginModal();
                return;
            }

            const productId = getProductIdFromUrl();
            const product = getProductInfo(productId);
            const favoriteBtn = document.getElementById('add-favorite');

            // 获取现有收藏
            let favorites = JSON.parse(localStorage.getItem('xiaotuxian_favorites') || '[]');

            // 检查是否已收藏
            const existingIndex = favorites.findIndex(item => item.id === product.id);

            if (existingIndex >= 0) {
                // 移除收藏
                favorites.splice(existingIndex, 1);
                if (favoriteBtn) {
                    favoriteBtn.innerHTML = '❤ 收藏';
                    favoriteBtn.classList.remove('favorited');
                }
                window.CartManager.showSuccess(`已取消收藏 ${product.name}`);
            } else {
                // 添加收藏
                const favoriteItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || 'images/goods1.png',
                    addedAt: new Date().toISOString()
                };

                favorites.push(favoriteItem);
                if (favoriteBtn) {
                    favoriteBtn.innerHTML = '❤ 已收藏';
                    favoriteBtn.classList.add('favorited');
                }
                window.CartManager.showSuccess(`${product.name} 已添加到收藏`);
            }

            // 保存收藏
            localStorage.setItem('xiaotuxian_favorites', JSON.stringify(favorites));

        } catch (e) {
            console.error('收藏失败:', e);
            window.CartManager.showError('收藏失败，请稍后重试');
        }
    }

    // 用户认证状态更新
    function updateUserStatus() {
        try {
            const userData = localStorage.getItem('xiaotuxian_user') ||
                sessionStorage.getItem('xiaotuxian_user');
            const user = userData ? JSON.parse(userData) : null;

            // 更新所有可能的用户状态元素
            const userElements = [
                { status: 'product-user-status', loggedIn: 'product-logged-in-user', username: 'product-username-display' }
            ];

            userElements.forEach(({ status, loggedIn, username }) => {
                const statusEl = document.getElementById(status);
                const loggedInEl = document.getElementById(loggedIn);
                const usernameEl = document.getElementById(username);

                if (user && user.username && loggedInEl && usernameEl) {
                    if (statusEl) statusEl.style.display = 'none';
                    loggedInEl.style.display = 'flex';
                    usernameEl.textContent = user.username;
                    usernameEl.style.color = '#ffcc00';
                } else if (statusEl && loggedInEl) {
                    statusEl.style.display = 'inline';
                    loggedInEl.style.display = 'none';
                }
            });

            // 更新购物车数量
            if (typeof window.CartManager.updateCartCount === 'function') {
                window.CartManager.updateCartCount();
            }
        } catch (e) {
            console.error('更新用户状态失败:', e);
        }
    }

    // 创建备用购物车管理器（如果 CartManager 不可用）
    function createFallbackCartManager() {
        console.warn('创建备用购物车管理器');
        return {
            addToCart: function (productId, options = {}) {
                console.log('备用管理器添加商品:', productId, options);
                alert('商品已添加到购物车（备用模式）');
                return true;
            },
            updateCartCount: function () {
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    cartCount.textContent = '0';
                }
            },
            showSuccess: function (message) {
                alert(message);
            },
            showError: function (message) {
                alert(message);
            },
            showLoginModal: function () {
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                } else {
                    alert('请先登录');
                }
            },
            isUserLoggedIn: function () {
                return !!(localStorage.getItem('xiaotuxian_user') ||
                    sessionStorage.getItem('xiaotuxian_user'));
            }
        };
    }

    // 绑定用户认证事件
    function bindAuthEvents() {
        // 登录链接
        const loginLink = document.getElementById('product-login-link');
        if (loginLink) {
            loginLink.addEventListener('click', function (e) {
                e.preventDefault();
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }

        // 注册链接
        const registerLink = document.getElementById('product-register-link');
        if (registerLink) {
            registerLink.addEventListener('click', function (e) {
                e.preventDefault();
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';

                    // 切换到注册表单
                    const registerForm = document.getElementById('register-form');
                    const loginForm = document.getElementById('login-form');
                    if (registerForm && loginForm) {
                        loginForm.classList.remove('active');
                        registerForm.classList.add('active');
                    }
                }
            });
        }

        // 退出登录
        const logoutLink = document.getElementById('product-logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('xiaotuxian_user');
                sessionStorage.removeItem('xiaotuxian_user');
                updateUserStatus();
                window.CartManager.showSuccess('已退出登录');
            });
        }

        // 模态框关闭
        const authOverlay = document.getElementById('auth-overlay');
        const closeAuthModal = document.getElementById('close-auth-modal');

        if (authOverlay) {
            authOverlay.addEventListener('click', hideAuthModal);
        }

        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', hideAuthModal);
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const authModal = document.getElementById('auth-modal');
                if (authModal && authModal.style.display === 'block') {
                    hideAuthModal();
                }
            }
        });
    }

    // 隐藏认证模态框
    function hideAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            // 切换到登录表单
            const registerForm = document.getElementById('register-form');
            const loginForm = document.getElementById('login-form');
            const forgotForm = document.getElementById('forgot-form');

            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
            if (forgotForm) forgotForm.classList.remove('active');
        }
    }

    // 初始化搜索功能（如果可用）
    function initSearch() {
        if (typeof initCommonSearch === 'function') {
            setTimeout(initCommonSearch, 100);
        }
    }

    // 添加动画样式
    function addAnimationStyles() {
        // 检查是否已添加动画样式
        if (document.querySelector('#product-animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'product-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(30px); }
            }
            
            @keyframes buttonClick {
                0% { transform: scale(1); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            
            .button-click {
                animation: buttonClick 0.2s ease;
            }
            
            .favorited {
                color: #e63946;
                background: #ffe6e6;
                border-color: #e63946;
            }
            
            .option-value.active {
                border-color: #5EB69C;
                color: #5EB69C;
                background: #f0f9f2;
            }
            
            .thumbnail.active {
                border-color: #5EB69C;
            }
            
            .tab-header.active {
                color: #5EB69C;
                font-weight: 500;
            }
            
            .tab-header.active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 2px;
                background: #5EB69C;
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化页面
    function init() {
        console.log('初始化商品详情页面...');

        // 更新用户状态
        updateUserStatus();

        // 初始化商品详情
        initProductComponents();

        // 绑定用户认证事件
        bindAuthEvents();

        // 初始化搜索功能
        initSearch();

        // 添加动画样式
        addAnimationStyles();

        console.log('商品详情页面初始化完成');
    }

    // 页面加载后初始化
    setTimeout(init, 100);
});

// 如果CartManager不可用，创建备用版本
if (typeof window.CartManager === 'undefined') {
    console.warn('CartManager 未加载，创建备用版本');
    
    window.CartManager = {
        addToCart: function(productId, options = {}) {
            return new Promise((resolve) => {
                console.log('备用CartManager添加商品:', productId, options);
                setTimeout(() => {
                    alert('商品已添加到购物车（测试模式）');
                    resolve(true);
                }, 300);
            });
        },
        updateCartCount: function() {
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                cartCount.textContent = '0';
            }
        },
        showSuccess: function(message) {
            alert(message);
        },
        showError: function(message) {
            alert(message);
        },
        showLoginModal: function() {
            alert('请先登录！');
        },
        isUserLoggedIn: function() {
            return !!(localStorage.getItem('xiaotuxian_user') || 
                     sessionStorage.getItem('xiaotuxian_user'));
        }
    };
}
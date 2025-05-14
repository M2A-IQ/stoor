/**
 * ملف إدارة سلة التسوق للمتجر الإلكتروني
 */

// تنفيذ الكود عند اكتمال تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة سلة التسوق
    initCart();
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
});

/**
 * تهيئة سلة التسوق
 */
function initCart() {
    // إضافة معالجات الأحداث لأزرار "أضف للسلة"
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // الحصول على معرف المنتج من سمة البيانات
            var productId = this.getAttribute('data-id');
            
            // التحقق من تسجيل الدخول قبل إضافة المنتج إلى السلة
            checkLoginBeforeAction(event, addToCart.bind(null, productId));
        });
    });
}

/**
 * إضافة منتج إلى سلة التسوق
 * @param {string} productId - معرف المنتج
 */
function addToCart(productId) {
    // الحصول على سلة التسوق الحالية من التخزين المحلي
    var cart = getCart();
    
    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
    var existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // إذا كان المنتج موجودًا بالفعل، قم بزيادة الكمية
        existingItem.quantity += 1;
    } else {
        // إذا لم يكن المنتج موجودًا، أضفه إلى السلة
        // في التطبيق الحقيقي، ستحتاج إلى الحصول على بيانات المنتج من الخادم
        // للتبسيط، سنستخدم بيانات وهمية هنا
        var product = getProductDetails(productId);
        
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // حفظ السلة المحدثة في التخزين المحلي
    saveCart(cart);
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // عرض رسالة تأكيد
    showCartNotification('تمت إضافة المنتج إلى سلة التسوق');
}

/**
 * الحصول على بيانات المنتج (وهمية للعرض فقط)
 * في التطبيق الحقيقي، ستحتاج إلى الحصول على هذه البيانات من الخادم
 * @param {string} productId - معرف المنتج
 * @returns {Object} - بيانات المنتج
 */
function getProductDetails(productId) {
    // قائمة المنتجات الوهمية للعرض فقط
    var products = {
        '1': {
            name: 'هاتف ذكي XYZ',
            price: 1200000,
            image: 'placeholder.jpg'
        },
        '2': {
            name: 'سماعات لاسلكية',
            price: 320000,
            image: 'placeholder.jpg'
        },
        '3': {
            name: 'حقيبة ظهر',
            price: 150000,
            image: 'placeholder.jpg'
        },
        '4': {
            name: 'ساعة ذكية',
            price: 450000,
            image: 'placeholder.jpg'
        }
    };
    
    return products[productId] || {
        name: 'منتج غير معروف',
        price: 0,
        image: 'placeholder.jpg'
    };
}

/**
 * الحصول على سلة التسوق من التخزين المحلي
 * @returns {Array} - مصفوفة تحتوي على عناصر السلة
 */
function getCart() {
    var cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * حفظ سلة التسوق في التخزين المحلي
 * @param {Array} cart - مصفوفة تحتوي على عناصر السلة
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * تحديث عدد العناصر في السلة
 */
function updateCartCount() {
    var cart = getCart();
    var count = 0;
    
    // حساب إجمالي عدد العناصر في السلة
    cart.forEach(function(item) {
        count += item.quantity;
    });
    
    // تحديث عدد العناصر في شارة السلة
    var cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(function(element) {
        element.textContent = count;
    });
}

/**
 * إزالة منتج من سلة التسوق
 * @param {string} productId - معرف المنتج
 */
function removeFromCart(productId) {
    var cart = getCart();
    
    // إزالة المنتج من السلة
    cart = cart.filter(item => item.id !== productId);
    
    // حفظ السلة المحدثة
    saveCart(cart);
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // إذا كنا في صفحة السلة، قم بتحديث عرض السلة
    if (document.querySelector('.cart-items')) {
        renderCart();
    }
}

/**
 * تحديث كمية منتج في سلة التسوق
 * @param {string} productId - معرف المنتج
 * @param {number} quantity - الكمية الجديدة
 */
function updateCartItemQuantity(productId, quantity) {
    var cart = getCart();
    
    // البحث عن المنتج في السلة
    var item = cart.find(item => item.id === productId);
    
    if (item) {
        // تحديث الكمية
        item.quantity = parseInt(quantity);
        
        // إذا كانت الكمية 0 أو أقل، قم بإزالة المنتج من السلة
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        // حفظ السلة المحدثة
        saveCart(cart);
        
        // تحديث عدد العناصر في السلة
        updateCartCount();
        
        // إذا كنا في صفحة السلة، قم بتحديث عرض السلة
        if (document.querySelector('.cart-items')) {
            renderCart();
        }
    }
}

/**
 * عرض إشعار سلة التسوق
 * @param {string} message - رسالة الإشعار
 */
function showCartNotification(message) {
    // إنشاء عنصر الإشعار
    var notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    // إضافة الإشعار إلى المستند
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(function() {
        notification.classList.add('show');
    }, 10);
    
    // إخفاء وإزالة الإشعار بعد 3 ثوانٍ
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// إضافة أنماط CSS للإشعارات
function addNotificationStyles() {
    var style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1050;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .cart-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    
    document.head.appendChild(style);
}

// إضافة أنماط الإشعارات عند تحميل الصفحة
addNotificationStyles();
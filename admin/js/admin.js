// وظائف خاصة بلوحة التحكم

// التحقق من حالة المصادقة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initializeUI();
});

// التحقق من صلاحيات المشرف
async function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        // إذا لم يكن المستخدم مسجل دخول أو ليس مشرفاً، قم بتوجيهه إلى صفحة تسجيل الدخول
        window.location.href = '../login.html';
        return;
    }

    // تحديث واجهة المستخدم بمعلومات المشرف
    const adminNameElement = document.querySelector('.admin-name');
    if (adminNameElement) {
        adminNameElement.textContent = user.displayName || user.email;
    }
}

// تهيئة واجهة المستخدم
function initializeUI() {
    // تهيئة التلميحات
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // تهيئة القوائم المنسدلة
    const dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    dropdownTriggerList.map(function (dropdownTriggerEl) {
        return new bootstrap.Dropdown(dropdownTriggerEl);
    });
}

// دالة لتحديث البيانات في الوقت الحقيقي
function updateDashboardData() {
    // في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
    // هذا مجرد مثال للمحاكاة

    // تحديث إحصائيات المبيعات
    const salesElement = document.querySelector('#totalSales');
    if (salesElement) {
        const currentSales = parseInt(salesElement.textContent.replace(/[^0-9]/g, ''));
        const newSales = currentSales + Math.floor(Math.random() * 100);
        salesElement.textContent = newSales.toLocaleString() + ' ر.س';
    }

    // تحديث عدد الطلبات الجديدة
    const ordersElement = document.querySelector('#newOrders');
    if (ordersElement) {
        const currentOrders = parseInt(ordersElement.textContent);
        const newOrders = currentOrders + Math.floor(Math.random() * 3);
        ordersElement.textContent = newOrders;
    }
}

// تحديث البيانات كل 30 ثانية
setInterval(updateDashboardData, 30000);

// دالة لمعالجة الطلبات
function handleOrder(orderId, action) {
    // في التطبيق الحقيقي، سيتم إرسال الطلب إلى الخادم
    const orderElement = document.querySelector(`#order-${orderId}`);
    if (orderElement) {
        const statusBadge = orderElement.querySelector('.badge');
        switch(action) {
            case 'approve':
                statusBadge.className = 'badge bg-success';
                statusBadge.textContent = 'مكتمل';
                break;
            case 'process':
                statusBadge.className = 'badge bg-warning';
                statusBadge.textContent = 'قيد المعالجة';
                break;
            case 'ship':
                statusBadge.className = 'badge bg-info';
                statusBadge.textContent = 'قيد الشحن';
                break;
            case 'cancel':
                statusBadge.className = 'badge bg-danger';
                statusBadge.textContent = 'ملغي';
                break;
        }
    }
}

// معالجة نموذج إعدادات المتجر
document.addEventListener('DOMContentLoaded', function() {
    const storeSettingsForm = document.getElementById('storeSettingsForm');
    if (storeSettingsForm) {
        storeSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // جمع البيانات من النموذج
            const formData = new FormData(this);
            // في التطبيق الحقيقي، سيتم إرسال البيانات إلى الخادم
            saveStoreSettings(formData);
        });
    }

    const paymentSettingsForm = document.getElementById('paymentSettingsForm');
    if (paymentSettingsForm) {
        paymentSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // جمع البيانات من النموذج
            const formData = new FormData(this);
            // في التطبيق الحقيقي، سيتم إرسال البيانات إلى الخادم
            savePaymentSettings(formData);
        });
    }
});

// حفظ إعدادات المتجر
function saveStoreSettings(formData) {
    // محاكاة عملية الحفظ
    setTimeout(() => {
        showAlert('success', 'تم حفظ إعدادات المتجر بنجاح');
    }, 1000);
}

// حفظ إعدادات الدفع والشحن
function savePaymentSettings(formData) {
    // محاكاة عملية الحفظ
    setTimeout(() => {
        showAlert('success', 'تم حفظ إعدادات الدفع والشحن بنجاح');
    }, 1000);
}

// عرض رسالة تنبيه
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.row'));
    
    // إخفاء التنبيه تلقائياً بعد 3 ثواني
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// دالة لإدارة المخزون
function updateStock(productId, quantity) {
    // في التطبيق الحقيقي، سيتم إرسال الطلب إلى الخادم
    const productElement = document.querySelector(`#product-${productId}`);
    if (productElement) {
        const stockElement = productElement.querySelector('.stock-count');
        if (stockElement) {
            const currentStock = parseInt(stockElement.textContent);
            const newStock = currentStock + quantity;
            stockElement.textContent = newStock;

            // تحديث حالة المخزون
            const statusElement = productElement.querySelector('.stock-status');
            if (statusElement) {
                if (newStock <= 0) {
                    statusElement.className = 'badge bg-danger';
                    statusElement.textContent = 'نفذ المخزون';
                } else if (newStock <= 10) {
                    statusElement.className = 'badge bg-warning';
                    statusElement.textContent = 'مخزون منخفض';
                } else {
                    statusElement.className = 'badge bg-success';
                    statusElement.textContent = 'متوفر';
                }
            }
        }
    }
}

// دالة لإدارة التنبيهات
function addNotification(type, message) {
    const notificationsList = document.querySelector('.notifications-list');
    if (notificationsList) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        notificationsList.insertBefore(notification, notificationsList.firstChild);

        // حذف التنبيه تلقائياً بعد 5 ثواني
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// دالة للبحث في الجداول
function searchTable(inputElement, tableId) {
    const searchText = inputElement.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // نبدأ من 1 لتجاوز صف العناوين
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchText)) {
                found = true;
                break;
            }
        }

        row.style.display = found ? '' : 'none';
    }
}

// دالة لتصدير البيانات
function exportData(tableId, format) {
    const table = document.getElementById(tableId);
    if (!table) return;

    switch(format) {
        case 'csv':
            const csv = [];
            const rows = table.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = [], cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    let text = cols[j].innerText;
                    // تنظيف النص من الفواصل
                    text = text.replace(/(
|\n|\r)/gm, '').replace(/,/g, ';');
                    row.push('"' + text + '"');
                }
                csv.push(row.join(','));
            }

            const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'export.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            break;

        case 'print':
            window.print();
            break;
    }
}
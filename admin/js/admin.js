// وظائف خاصة بلوحة التحكم

// تهيئة المخططات البيانية (يمكن استخدام مكتبة Chart.js في التطبيق الحقيقي)
document.addEventListener('DOMContentLoaded', function() {
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
});

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
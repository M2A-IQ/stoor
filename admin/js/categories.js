// وظائف إدارة الأقسام

// تهيئة التخزين المحلي للأقسام
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// دالة لإضافة قسم جديد
function addCategory(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('categoryName');
    const descriptionInput = document.getElementById('categoryDescription');
    const iconInput = document.getElementById('categoryIcon');
    
    try {
        const newCategory = {
            id: Date.now().toString(),
            name: nameInput.value,
            description: descriptionInput.value,
            icon: iconInput.value,
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        // إغلاق النافذة المنبثقة وإعادة تحميل الأقسام
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
        modal.hide();
        loadCategories();
        
        // إظهار رسالة نجاح
        addNotification('success', 'تم إضافة القسم بنجاح');
        
        // إعادة تعيين النموذج
        event.target.reset();
    } catch (error) {
        console.error('خطأ في إضافة القسم:', error);
        addNotification('danger', 'حدث خطأ أثناء إضافة القسم');
    }
}

// دالة لتحميل الأقسام
function loadCategories() {
    try {
        categories = JSON.parse(localStorage.getItem('categories')) || [];
        const sortedCategories = categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const categoriesContainer = document.querySelector('.row.g-4');
        categoriesContainer.innerHTML = '';
        
        sortedCategories.forEach(category => {
            const categoryElement = createCategoryElement(category.id, category);
            categoriesContainer.appendChild(categoryElement);
        });
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
        addNotification('danger', 'حدث خطأ أثناء تحميل الأقسام');
    }
}

// دالة لإنشاء عنصر القسم
function createCategoryElement(id, category) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4';
    div.id = `category-${id}`;
    
    div.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">
                        <i class="${category.icon} text-primary me-2"></i>
                        ${category.name}
                    </h5>
                    <div class="dropdown">
                        <button class="btn btn-link text-dark p-0" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="editCategory('${id}')"><i class="fas fa-edit me-1"></i> تعديل</a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteCategory('${id}')"><i class="fas fa-trash me-1"></i> حذف</a></li>
                        </ul>
                    </div>
                </div>
                <p class="card-text text-muted">${category.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">${category.productCount} منتج</span>
                    <small class="text-muted">تم التحديث: ${formatDate(category.updatedAt)}</small>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// دالة لتعديل قسم
function editCategory(id) {
    try {
        const category = categories.find(c => c.id === id);
        if (!category) throw new Error('القسم غير موجود');
        
        // تعبئة نموذج التعديل
        document.getElementById('editCategoryId').value = id;
        document.getElementById('editCategoryName').value = category.name;
        document.getElementById('editCategoryDescription').value = category.description;
        document.getElementById('editCategoryIcon').value = category.icon;
        
        // فتح النافذة المنبثقة
        const modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
        modal.show();
    } catch (error) {
        console.error('خطأ في تحميل بيانات القسم:', error);
        addNotification('danger', 'حدث خطأ أثناء تحميل بيانات القسم');
    }
}

// دالة لحفظ تعديلات القسم
function saveCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('editCategoryId').value;
    const nameInput = document.getElementById('editCategoryName');
    const descriptionInput = document.getElementById('editCategoryDescription');
    const iconInput = document.getElementById('editCategoryIcon');
    
    try {
        const categoryIndex = categories.findIndex(c => c.id === id);
        if (categoryIndex === -1) throw new Error('القسم غير موجود');
        
        categories[categoryIndex] = {
            ...categories[categoryIndex],
            name: nameInput.value,
            description: descriptionInput.value,
            icon: iconInput.value,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('categories', JSON.stringify(categories));
        
        // إغلاق النافذة المنبثقة وإعادة تحميل الأقسام
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
        modal.hide();
        loadCategories();
        
        // إظهار رسالة نجاح
        addNotification('success', 'تم تحديث القسم بنجاح');
    } catch (error) {
        console.error('خطأ في تحديث القسم:', error);
        addNotification('danger', 'حدث خطأ أثناء تحديث القسم');
    }
}

// دالة لحذف قسم
async function deleteCategory(id) {
    if (confirm('هل أنت متأكد من حذف هذا القسم؟')) {
        try {
            await categoriesRef.doc(id).delete();
            
            // إزالة عنصر القسم من الصفحة
            document.getElementById(`category-${id}`).remove();
            
            // إظهار رسالة نجاح
            addNotification('success', 'تم حذف القسم بنجاح');
        } catch (error) {
            console.error('خطأ في حذف القسم:', error);
            addNotification('danger', 'حدث خطأ أثناء حذف القسم');
        }
    }
}

// دالة لتنسيق التاريخ
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('ar-SA');
}

// تحميل الأقسام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadCategories);

// إضافة مستمعي الأحداث للنماذج
document.getElementById('addCategoryForm').addEventListener('submit', addCategory);
document.getElementById('editCategoryForm').addEventListener('submit', saveCategory);
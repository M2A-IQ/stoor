// وظائف التصفية والبحث لصفحة المنتجات

// استدعاء العناصر
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const productsGrid = document.getElementById('productsGrid');

// تهيئة المتغيرات
let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// دالة تحميل المنتجات
async function loadProducts() {
    try {
        // هنا يمكن استبدال هذا بطلب API حقيقي
        products = [
            {
                id: 1,
                name: 'هاتف ذكي XYZ',
                price: 1200000,
                oldPrice: 1500000,
                rating: 4.5,
                category: 1,
                badge: { text: 'جديد', class: 'bg-danger' },
                image: '#f1c40f'
            },
            {
                id: 2,
                name: 'سماعات لاسلكية',
                price: 320000,
                oldPrice: 400000,
                rating: 4.0,
                category: 1,
                badge: { text: 'خصم 20%', class: 'bg-success' },
                image: '#3498db'
            },
            {
                id: 3,
                name: 'حقيبة ظهر',
                price: 150000,
                oldPrice: null,
                rating: 3.5,
                category: 2,
                badge: null,
                image: '#2ecc71'
            },
            {
                id: 4,
                name: 'ساعة ذكية',
                price: 450000,
                oldPrice: 500000,
                rating: 5.0,
                category: 1,
                badge: { text: 'الأكثر مبيعاً', class: 'bg-info' },
                image: '#9b59b6'
            }
        ];
        filteredProducts = [...products];
        applyFilters();
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
    }
}

// دالة تطبيق التصفية
function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortBy = sortFilter.value;

    // تصفية حسب البحث والفئة
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // الترتيب
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name, 'ar');
            case 'name-desc':
                return b.name.localeCompare(a.name, 'ar');
            default: // newest
                return b.id - a.id;
        }
    });

    // عرض النتائج
    displayProducts();
}

// دالة عرض المنتجات
function displayProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = paginatedProducts.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <a href="product.html?id=${product.id}" class="product-link">
                <div class="card product-card h-100">
                    ${product.badge ? `
                        <div class="product-badge ${product.badge.class}">${product.badge.text}</div>
                    ` : ''}
                    <div class="product-image" style="background-color: ${product.image}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="product-rating mb-2">
                            ${getRatingStars(product.rating)}
                            <span class="ms-1">(${product.rating})</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">${formatPrice(product.price)}</span>
                            ${product.oldPrice ? `
                                <span class="old-price">${formatPrice(product.oldPrice)}</span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 d-flex justify-content-center">
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    updatePagination();
    initializeCartButtons();
}

// دالة تحديث ترقيم الصفحات
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationElement = document.querySelector('.pagination');

    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;

    paginationElement.innerHTML = paginationHTML;

    // إضافة مستمعي الأحداث لأزرار الترقيم
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.closest('.page-link').dataset.page);
            if (newPage && newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
                currentPage = newPage;
                displayProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// دالة تنسيق السعر
function formatPrice(price) {
    return price.toLocaleString('ar-IQ') + ' د.ع';
}

// دالة إنشاء نجوم التقييم
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let stars = '';

    // إضافة النجوم الممتلئة
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }

    // إضافة نصف نجمة إذا وجدت
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }

    // إضافة النجوم الفارغة
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }

    return stars;
}

// دالة تهيئة أزرار سلة التسوق
function initializeCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.dataset.id;
            addToCart(productId);
        });
    });
}

// دالة إعادة تعيين التصفية
function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    sortFilter.value = 'newest';
    currentPage = 1;
    applyFilters();
}

// إضافة مستمعي الأحداث
searchInput.addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
});

categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});

sortFilter.addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});

// تحميل المنتجات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);
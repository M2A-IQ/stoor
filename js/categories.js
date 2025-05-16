// وظائف عرض الأقسام في الواجهة الأمامية

// استيراد وتهيئة Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';

// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJ_tmqg6FZYTa2tNnmfJZYD_xcBMXSX9I",
  authDomain: "stor-57fed.firebaseapp.com",
  projectId: "stor-57fed",
  storageBucket: "stor-57fed.firebasestorage.app",
  messagingSenderId: "500181738580",
  appId: "1:500181738580:web:0639ab36efedbb1f3479c1",
  measurementId: "G-LW9RNCXX5N"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const categoriesRef = collection(db, 'categories');

// دالة لتحميل الأقسام
async function loadCategories() {
    try {
        const q = query(categoriesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const categoriesList = document.getElementById('categoriesList');
        
        if (!categoriesList) return;
        
        categoriesList.innerHTML = '';
        
        if (querySnapshot.empty) {
            categoriesList.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">لا توجد أقسام متاحة حالياً</p>
                </div>
            `;
            return;
        }
        
        querySnapshot.forEach(doc => {
            const category = doc.data();
            const categoryElement = createCategoryElement(doc.id, category);
            categoriesList.appendChild(categoryElement);
        })
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
        const categoriesList = document.getElementById('categoriesList');
        if (categoriesList) {
            categoriesList.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger">حدث خطأ أثناء تحميل الأقسام. يرجى المحاولة مرة أخرى.</p>
                </div>
            `;
        }
    }
}

// دالة لإنشاء عنصر القسم
function createCategoryElement(id, category) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4';
    div.id = `category-${id}`;
    
    div.innerHTML = `
        <a href="products.html?category=${id}" class="text-decoration-none">
            <div class="card h-100 category-card">
                <div class="card-body text-center">
                    <i class="${category.icon} fa-3x mb-3 text-primary"></i>
                    <h5 class="card-title">${category.name}</h5>
                    <p class="card-text text-muted">${category.description}</p>
                    <div class="mt-3">
                        <span class="badge bg-primary">${category.productCount} منتج</span>
                    </div>
                </div>
            </div>
        </a>
    `;
    
    return div;
}

// تحميل الأقسام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadCategories);
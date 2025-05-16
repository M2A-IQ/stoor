/**
 * الملف الرئيسي للجافاسكريبت في المتجر الإلكتروني
 */

// تنفيذ الكود عند اكتمال تحميل الصفحة
// تهيئة الوضع الداكن
function initDarkMode() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
}

// تحديث أيقونة زر الوضع الداكن
function updateDarkModeIcon(isDark) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// تبديل الوضع الداكن
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    updateDarkModeIcon(isDark);
}

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التلميحات
    initTooltips();
    
    // تهيئة زر العودة للأعلى
    initBackToTop();
    
    // تهيئة النشرة البريدية
    initNewsletter();
    
    // تهيئة الوضع الداكن
    initDarkMode();
});

/**
 * تهيئة التلميحات (Tooltips)
 */
function initTooltips() {
    // تهيئة جميع عناصر التلميحات في بوتستراب
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * تهيئة زر العودة للأعلى
 */
function initBackToTop() {
    // الحصول على زر العودة للأعلى
    var backToTopButton = document.getElementById('backToTop');
    
    // إذا لم يتم العثور على الزر، قم بالخروج
    if (!backToTopButton) return;
    
    // إظهار أو إخفاء الزر بناءً على موضع التمرير
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // التمرير للأعلى عند النقر على الزر
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * تهيئة النشرة البريدية
 */
function initNewsletter() {
    // الحصول على نموذج النشرة البريدية
    var newsletterForm = document.querySelector('.newsletter-form');
    
    // إذا لم يتم العثور على النموذج، قم بالخروج
    if (!newsletterForm) return;
    
    // إضافة معالج حدث لتقديم النموذج
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // الحصول على قيمة البريد الإلكتروني
        var email = newsletterForm.querySelector('input[type="email"]').value;
        
        // هنا يمكنك إضافة كود للتحقق من صحة البريد الإلكتروني وإرساله إلى الخادم
        // للتبسيط، سنعرض رسالة تأكيد فقط
        alert('شكراً لاشتراكك في النشرة البريدية! سيتم إرسال آخر العروض والتحديثات إلى: ' + email);
        
        // إعادة تعيين النموذج
        newsletterForm.reset();
    });
}

/**
 * تحميل الخط العربي Tajawal من Google Fonts
 */
function loadFonts() {
    // إنشاء عنصر رابط لتحميل الخط
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
    
    // إضافة عنصر الرابط إلى رأس المستند
    document.head.appendChild(fontLink);
}

// تحميل الخطوط عند تحميل الصفحة
loadFonts();
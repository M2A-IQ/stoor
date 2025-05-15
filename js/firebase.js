// تهيئة Firebase عبر CDN
// تأكد من إضافة سكريبتات Firebase CDN في رأس ملف HTML الخاص بك:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js"></script>

// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDJ_tmqg6FZYTa2tNnmfJZYD_xcBMXSX9I",
    authDomain: "stor-57fed.firebaseapp.com",
    projectId: "stor-57fed",
    storageBucket: "stor-57fed.firebasestorage.app",
    messagingSenderId: "500181738580",
    appId: "1:500181738580:web:26f9251f448eb6ae3479c1",
    measurementId: "G-XQXBEKWBW9"
};

// تهيئة التطبيق
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = firebase.analytics();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// دالة إنشاء حساب جديد
async function createAccount(email, password) {
    try {
        console.log('محاولة إنشاء حساب جديد في Firebase...');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('تم إنشاء الحساب في Firebase بنجاح');

        // تخزين معلومات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user',
            lastLogin: new Date().toISOString()
        }));

        console.log('تم إنشاء الحساب بنجاح، جاري إعادة التوجيه...');
        alert('تم إنشاء الحساب بنجاح');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return user;
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        let errorMessage = 'حدث خطأ في إنشاء الحساب';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'كلمة المرور ضعيفة جداً';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صالح';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً';
        }
        alert(errorMessage);
        throw error;
    }
}

// دالة تسجيل الدخول
async function loginWithEmailAndPassword(email, password) {
    try {
        console.log('محاولة تسجيل الدخول في Firebase...');
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('تم تسجيل الدخول في Firebase بنجاح');

        // التحقق من البريد الإلكتروني للمسؤول
        const isAdmin = user.email === 'admin@stor.com';

        // تخزين معلومات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: isAdmin ? 'admin' : 'user',
            lastLogin: new Date().toISOString()
        }));

        console.log('تم تسجيل الدخول بنجاح، جاري إعادة التوجيه...');
        alert('تم تسجيل الدخول بنجاح');

        setTimeout(() => {
            if (isAdmin) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);

        return user;
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        let errorMessage = 'حدث خطأ في تسجيل الدخول';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'البريد الإلكتروني غير مسجل';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'كلمة المرور غير صحيحة';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صالح';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'تم تعطيل هذا الحساب';
        }
        alert(errorMessage);
        throw error;
    }
}

// دالة تسجيل الدخول باستخدام Google
async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        const isAdmin = user.email === 'admin@stor.com';
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: isAdmin ? 'admin' : 'user',
            lastLogin: new Date().toISOString()
        }));
        if (isAdmin) {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
        return user;
    } catch (error) {
        console.error('خطأ في تسجيل الدخول باستخدام Google:', error);
        alert('حدث خطأ في تسجيل الدخول باستخدام Google');
        throw error;
    }
}

// دالة إعادة تعيين كلمة المرور
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
        console.error('خطأ في إرسال رابط إعادة تعيين كلمة المرور:', error);
        let errorMessage = 'حدث خطأ في إرسال رابط إعادة تعيين كلمة المرور';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'البريد الإلكتروني غير مسجل';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'البريد الإلكتروني غير صالح';
        }
        alert(errorMessage);
        throw error;
    }
}

// دالة تسجيل الخروج
async function logoutUser() {
    try {
        await auth.signOut();
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        throw error;
    }
}

// دالة التحقق من حالة تسجيل الدخول
function checkAuthState() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                reject('لم يتم تسجيل الدخول');
            }
        });
    });
}

// دالة التحقق من صلاحيات المسؤول
async function checkAdminAuth() {
    try {
        const user = await checkAuthState();
        if (!user) throw new Error('لم يتم تسجيل الدخول');
        const isAdmin = user.email === 'admin@stor.com';
        if (!isAdmin) throw new Error('غير مصرح بالوصول');
        const userData = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
            ...userData,
            lastAuthCheck: new Date().toISOString()
        }));
        return true;
    } catch (error) {
        console.error('خطأ في التحقق من الصلاحيات:', error);
        window.location.href = 'login.html';
        throw error;
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.createAccount = createAccount;
window.loginWithEmailAndPassword = loginWithEmailAndPassword;
window.signInWithGoogle = signInWithGoogle;
window.resetPassword = resetPassword;
window.logoutUser = logoutUser;
window.checkAuthState = checkAuthState;
window.checkAdminAuth = checkAdminAuth;
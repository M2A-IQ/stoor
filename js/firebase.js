// تهيئة Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, signOut, onAuthStateChanged, RecaptchaVerifier } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// تهيئة RecaptchaVerifier
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'normal',
    callback: response => {
        console.log('reCAPTCHA solved');
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.disabled = false;
    },
    'expired-callback': () => {
        console.log('reCAPTCHA expired');
        window.recaptchaVerifier = null;
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.disabled = true;
    }
}, auth);

// دالة تنسيق رقم الهاتف
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return `+964${cleaned}`;
}

// دالة تسجيل الدخول باستخدام رقم الهاتف
export const loginWithPhoneAndPassword = async (phone) => {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        const appVerifier = window.recaptchaVerifier;

        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        window.confirmationResult = confirmationResult;

        const verificationForm = document.getElementById('verificationCodeForm');
        const loginForm = document.getElementById('loginForm');

        if (verificationForm && loginForm) {
            verificationForm.classList.remove('d-none');
            loginForm.classList.add('d-none');
            alert('تم إرسال الرمز');
        } else {
            throw new Error('لم يتم العثور على نماذج التحقق');
        }

        return confirmationResult;
    } catch (error) {
        console.error('خطأ في إرسال رمز التحقق:', error);
        alert('خطأ في الإرسال: ' + error.message);
        window.recaptchaVerifier = null;
        throw error;
    }
};

// دالة التحقق من الرمز
export const verifyCode = async (code) => {
    try {
        const confirmationResult = window.confirmationResult;
        if (!confirmationResult) {
            throw new Error('لم يتم إرسال رمز التحقق');
        }

        const result = await confirmationResult.confirm(code);
        const user = result.user;

        // التحقق من رقم الهاتف للمسؤول
        const isAdmin = user.phoneNumber === '+9647727139210';

        // تخزين معلومات المستخدم في localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            phone: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: isAdmin ? 'admin' : 'user',
            lastLogin: new Date().toISOString()
        }));

        alert('تم تسجيل الدخول بنجاح');

        // إعادة توجيه المستخدم حسب صلاحياته
        if (isAdmin) {
            window.location.href = '/admin/dashboard.html';
        } else {
            window.location.href = '/index.html';
        }

        return user;
    } catch (error) {
        console.error('خطأ في التحقق من الرمز:', error);
        alert('الرمز غير صحيح');
        throw error;
    }
};

// دالة تسجيل الخروج
export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        throw error;
    }
};

// دالة التحقق من حالة تسجيل الدخول
export const checkAuthState = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                reject('لم يتم تسجيل الدخول');
            }
        });
    });
};

// دالة التحقق من صلاحيات المسؤول
export const checkAdminAuth = async () => {
    try {
        const user = await checkAuthState();
        if (!user) throw new Error('لم يتم تسجيل الدخول');

        const isAdmin = user.phoneNumber === '+9647727139210';
        if (!isAdmin) throw new Error('غير مصرح بالوصول');

        const userData = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
            ...userData,
            lastAuthCheck: new Date().toISOString()
        }));

        return true;
    } catch (error) {
        console.error('خطأ في التحقق من الصلاحيات:', error);
        window.location.href = '/login.html';
        throw error;
    }
};
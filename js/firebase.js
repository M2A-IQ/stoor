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
let recaptchaVerifier;

// دالة تهيئة RecaptchaVerifier
async function initRecaptcha() {
    try {
        if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    // تم التحقق بنجاح
                    console.log('reCAPTCHA solved');
                    // تفعيل زر إرسال رمز التحقق
                    const loginButton = document.getElementById('loginButton');
                    if (loginButton) loginButton.disabled = false;
                },
                'expired-callback': () => {
                    // انتهت صلاحية التحقق
                    console.log('reCAPTCHA expired');
                    // إعادة تهيئة reCAPTCHA
                    recaptchaVerifier = null;
                    initRecaptcha();
                }
            });
            // تعطيل زر إرسال رمز التحقق حتى يتم حل reCAPTCHA
            const loginButton = document.getElementById('loginButton');
            if (loginButton) loginButton.disabled = true;
            
            await recaptchaVerifier.render();
        }
        return recaptchaVerifier;
    } catch (error) {
        console.error('خطأ في تهيئة reCAPTCHA:', error);
        return null;
    }
}

// دالة تسجيل الدخول باستخدام رقم الهاتف
export const loginWithPhoneAndPassword = async (phone) => {
    try {
        // تنسيق رقم الهاتف
        const formattedPhone = formatPhoneNumber(phone);
        
        // تهيئة reCAPTCHA
        const verifier = initRecaptcha();
        
        // إرسال رمز التحقق
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
        
        // تخزين confirmationResult في localStorage للاستخدام لاحقاً
        window.confirmationResult = confirmationResult;
        
        // إظهار نموذج إدخال رمز التحقق
        document.getElementById('verificationCodeForm').classList.remove('d-none');
        document.getElementById('loginForm').classList.add('d-none');
        
        return confirmationResult;
    } catch (error) {
        console.error('خطأ في إرسال رمز التحقق:', error);
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

        const userCredential = await confirmationResult.confirm(code);
        const user = userCredential.user;

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

        // إعادة توجيه المستخدم حسب صلاحياته
        if (isAdmin) {
            window.location.href = '/admin/dashboard.html';
        } else {
            window.location.href = '/index.html';
        }

        return user;
    } catch (error) {
        console.error('خطأ في التحقق من الرمز:', error);
        throw error;
    }
};

// دالة تنسيق رقم الهاتف
function formatPhoneNumber(phone) {
    // إزالة أي أحرف غير رقمية
    const cleaned = phone.replace(/\D/g, '');
    
    // إضافة رمز الدولة
    return `+964${cleaned}`;
}

// دالة تسجيل الخروج
export const logoutUser = async () => {
    try {
        await signOut(auth);
        // حذف معلومات المستخدم من localStorage
        localStorage.removeItem('user');
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
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
                // المستخدم مسجل الدخول
                resolve(user);
            } else {
                // المستخدم غير مسجل الدخول
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

        // التحقق من رقم الهاتف للمسؤول
        const isAdmin = user.phoneNumber === '+9647727139210';

        if (!isAdmin) {
            throw new Error('غير مصرح بالوصول');
        }

        // تحديث وقت آخر تحقق
        const userData = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
            ...userData,
            lastAuthCheck: new Date().toISOString()
        }));

        return true;
    } catch (error) {
        console.error('خطأ في التحقق من الصلاحيات:', error);
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = '/login.html';
        throw error;
    }
};

// دالة تحديث معلومات المستخدم
export const updateUserProfile = async (userData) => {
    try {
        const user = auth.currentUser;
        if (user) {
            // تحديث معلومات المستخدم في Firebase
            await user.updateProfile(userData);
            
            // تحديث المعلومات في localStorage
            const currentData = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...currentData,
                ...userData
            }));
            
            return true;
        }
        throw new Error('لم يتم العثور على المستخدم');
    } catch (error) {
        console.error('خطأ في تحديث الملف الشخصي:', error);
        throw error;
    }
};
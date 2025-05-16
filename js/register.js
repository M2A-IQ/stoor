import { createAccount, signInWithGoogle } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // إخفاء رسالة الترحيب عند تحميل الصفحة
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.classList.add('d-none');
    }
    // إزالة صف show-validation من جميع الحقول عند تحميل الصفحة
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('show-validation');
        // إضافة مستمع لحدث الإدخال لإزالة الصف عند تغيير القيمة
        input.addEventListener('input', () => {
            input.classList.remove('show-validation');
        });
    });

    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');
    const spinner = registerButton.querySelector('.spinner-border');
    const btnText = registerButton.querySelector('.btn-text');
    const errorElement = document.getElementById('errorMessage');
    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');

    // دالة إظهار رسالة الخطأ
    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }

    // دالة إخفاء رسالة الخطأ
    function hideError() {
        errorElement.classList.add('d-none');
    }

    // دالة التحقق من صحة كلمة المرور
    function validatePassword(password) {
        return password.length >= 8;
    }

    // معالجة إنشاء حساب
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideError();
        
        if (!registerForm.checkValidity()) {
            registerForm.classList.add('was-validated');
            // إضافة الصف show-validation لجميع حقول الإدخال
            registerForm.querySelectorAll('.form-control').forEach(input => {
                input.classList.add('show-validation');
            });
            return;
        }

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // التحقق من إدخال جميع الحقول
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showError('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // التحقق من صحة كلمة المرور
        if (!validatePassword(password)) {
            showError('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل');
            return;
        }

        // التحقق من تطابق كلمتي المرور
        if (password !== confirmPassword) {
            showError('كلمتا المرور غير متطابقتين');
            return;
        }

        try {
            console.log('بدء عملية إنشاء الحساب...');
            // تعطيل زر التسجيل وإظهار مؤشر التحميل
            registerButton.disabled = true;
            spinner.classList.remove('d-none');
            btnText.textContent = 'جاري إنشاء الحساب...';

            console.log('إنشاء حساب في Firebase...');
            // إنشاء حساب جديد في Firebase
            const user = await createAccount(email, password);
            
            console.log('تحديث معلومات المستخدم...');
            // تحديث معلومات المستخدم في localStorage
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            const updatedUserData = {
                ...userData,
                displayName: `${firstName} ${lastName}`,
                firstName: firstName,
                lastName: lastName,
                email: email
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            console.log('تم تحديث معلومات المستخدم بنجاح');
            
            // توجيه المستخدم إلى الصفحة الرئيسية
            window.location.href = 'index.html';
        } catch (error) {
            // معالجة الأخطاء
            let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    // إظهار رسالة الترحيب عند وجود حساب مسبق
                    if (welcomeMessage) {
                        welcomeMessage.classList.remove('d-none');
                        welcomeMessage.scrollIntoView({ behavior: 'smooth' });
                        return;
                    }
                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'كلمة المرور ضعيفة جداً';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'تسجيل المستخدمين معطل حالياً';
                    break;
            }
            showError(errorMessage);
        } finally {
            // إعادة تفعيل زر التسجيل وإخفاء مؤشر التحميل
            registerButton.disabled = false;
            spinner.classList.add('d-none');
            btnText.innerHTML = '<i class="fas fa-user-plus me-2"></i> إنشاء حساب';
        }
    });

    // معالجة إظهار/إخفاء كلمة المرور
    togglePasswordButton.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = togglePasswordButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    // معالجة إظهار/إخفاء تأكيد كلمة المرور
    toggleConfirmPasswordButton.addEventListener('click', () => {
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const icon = toggleConfirmPasswordButton.querySelector('i');
        
        if (confirmPasswordInput.type === 'password') {
            confirmPasswordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            confirmPasswordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    // معالجة تسجيل الدخول باستخدام Google
    window.handleCredentialResponse = async (response) => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('خطأ في تسجيل الدخول باستخدام Google:', error);
            showError('حدث خطأ في تسجيل الدخول باستخدام Google');
        }
    };

    // معالجة التبديل إلى صفحة تسجيل الدخول
    const loginToggleBtn = document.getElementById('loginToggleBtn');
    if (loginToggleBtn) {
        loginToggleBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
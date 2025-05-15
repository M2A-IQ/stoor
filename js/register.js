import { createAccount, signInWithGoogle } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
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
            // تعطيل زر التسجيل وإظهار مؤشر التحميل
            registerButton.disabled = true;
            spinner.classList.remove('d-none');
            btnText.textContent = 'جاري إنشاء الحساب...';

            // إنشاء حساب جديد في Firebase
            await createAccount(email, password);
        } catch (error) {
            // معالجة الأخطاء
            let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
            switch (error.code) {
                case 'auth/email-already-in-use':
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
});
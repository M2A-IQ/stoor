import { loginWithEmailAndPassword, signInWithGoogle, resetPassword } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const spinner = loginButton.querySelector('.spinner-border');
    const btnText = loginButton.querySelector('.btn-text');
    const errorElement = document.getElementById('errorMessage');
    const togglePasswordButton = document.getElementById('togglePassword');

    // معالجة تسجيل الدخول
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!loginForm.checkValidity()) {
            loginForm.classList.add('was-validated');
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('بدء عملية تسجيل الدخول...');
            // تعطيل زر تسجيل الدخول وإظهار مؤشر التحميل
            loginButton.disabled = true;
            spinner.classList.remove('d-none');
            btnText.textContent = 'جاري تسجيل الدخول...';

            console.log('محاولة تسجيل الدخول...');
            await loginWithEmailAndPassword(email, password);
            console.log('تم تسجيل الدخول بنجاح');
        } catch (error) {
            // إظهار رسالة الخطأ
            let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'البريد الإلكتروني غير مسجل';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'كلمة المرور غير صحيحة';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'البريد الإلكتروني غير صالح';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً';
                    break;
            }
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('d-none');
        } finally {
            // إعادة تفعيل زر تسجيل الدخول وإخفاء مؤشر التحميل
            loginButton.disabled = false;
            spinner.classList.add('d-none');
            btnText.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i> تسجيل الدخول';
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

    // معالجة تسجيل الدخول باستخدام Google
    window.handleCredentialResponse = async (response) => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('خطأ في تسجيل الدخول باستخدام Google:', error);
            errorElement.textContent = 'حدث خطأ في تسجيل الدخول باستخدام Google';
            errorElement.classList.remove('d-none');
        }
    };

    // معالجة نسيت كلمة المرور
    const forgotPasswordLink = document.querySelector('a[href="forgot-password.html"]');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (!email) {
                errorElement.textContent = 'يرجى إدخال البريد الإلكتروني لإعادة تعيين كلمة المرور';
                errorElement.classList.remove('d-none');
                return;
            }

            try {
                await resetPassword(email);
            } catch (error) {
                console.error('خطأ في إرسال رابط إعادة تعيين كلمة المرور:', error);
                errorElement.textContent = 'حدث خطأ في إرسال رابط إعادة تعيين كلمة المرور';
                errorElement.classList.remove('d-none');
            }
        });
    }
});
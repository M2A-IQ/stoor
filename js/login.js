import { loginWithPhoneAndPassword, verifyCode } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const verificationForm = document.getElementById('verificationCodeForm');
    const loginButton = document.getElementById('loginButton');
    const verifyButton = document.getElementById('verifyButton');
    const resendButton = document.getElementById('resendCode');
    const spinnerLogin = loginButton.querySelector('.spinner-border');
    const spinnerVerify = verifyButton.querySelector('.spinner-border');
    const btnTextLogin = loginButton.querySelector('.btn-text');
    const btnTextVerify = verifyButton.querySelector('.btn-text');

    // معالجة إرسال رمز التحقق
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!loginForm.checkValidity()) {
            e.stopPropagation();
            loginForm.classList.add('was-validated');
            return;
        }

        const phone = document.getElementById('phone').value;

        try {
            // تعطيل زر الإرسال وإظهار مؤشر التحميل
            loginButton.disabled = true;
            spinnerLogin.classList.remove('d-none');
            btnTextLogin.textContent = 'جاري إرسال الرمز...';

            // تهيئة reCAPTCHA قبل إرسال رمز التحقق
            const verifier = await initRecaptcha();
            if (!verifier) {
                throw new Error('فشل في تهيئة reCAPTCHA');
            }

            const result = await loginWithPhoneAndPassword(phone);
            if (result) {
                // إظهار نموذج التحقق وإخفاء نموذج تسجيل الدخول
                document.getElementById('verificationCodeForm').classList.remove('d-none');
                document.getElementById('loginForm').classList.add('d-none');
            }
        } catch (error) {
            // إظهار رسالة الخطأ
            let errorMessage = 'حدث خطأ أثناء إرسال رمز التحقق';
            switch (error.code) {
                case 'auth/invalid-phone-number':
                    errorMessage = 'رقم الهاتف غير صالح';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'تم إرسال العديد من الطلبات. يرجى المحاولة لاحقاً';
                    break;
                case 'auth/quota-exceeded':
                    errorMessage = 'تم تجاوز الحد المسموح به من المحاولات';
                    break;
            }
            const errorElement = document.getElementById('errorMessage');
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('d-none');
        } finally {
            // إعادة تفعيل زر الإرسال وإخفاء مؤشر التحميل
            loginButton.disabled = false;
            spinnerLogin.classList.add('d-none');
            btnTextLogin.innerHTML = '<i class="fas fa-paper-plane me-2"></i> إرسال رمز التحقق';
        }
    });

    // معالجة التحقق من الرمز
    verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!verificationForm.checkValidity()) {
            e.stopPropagation();
            verificationForm.classList.add('was-validated');
            return;
        }

        const code = document.getElementById('verificationCode').value;

        try {
            // تعطيل زر التحقق وإظهار مؤشر التحميل
            verifyButton.disabled = true;
            spinnerVerify.classList.remove('d-none');
            btnTextVerify.textContent = 'جاري التحقق...';

            await verifyCode(code);
        } catch (error) {
            // إظهار رسالة الخطأ
            let errorMessage = 'حدث خطأ أثناء التحقق من الرمز';
            switch (error.code) {
                case 'auth/invalid-verification-code':
                    errorMessage = 'رمز التحقق غير صحيح';
                    break;
                case 'auth/code-expired':
                    errorMessage = 'انتهت صلاحية رمز التحقق';
                    break;
            }
            alert(errorMessage);
        } finally {
            // إعادة تفعيل زر التحقق وإخفاء مؤشر التحميل
            verifyButton.disabled = false;
            spinnerVerify.classList.add('d-none');
            btnTextVerify.innerHTML = '<i class="fas fa-check me-2"></i> تأكيد الرمز';
        }
    });

    // معالجة إعادة إرسال الرمز
    resendButton.addEventListener('click', async () => {
        const phone = document.getElementById('phone').value;
        resendButton.disabled = true;
        try {
            await loginWithPhoneAndPassword(phone);
            alert('تم إعادة إرسال رمز التحقق');
        } catch (error) {
            alert('حدث خطأ أثناء إعادة إرسال الرمز');
        } finally {
            resendButton.disabled = false;
        }
    });
});
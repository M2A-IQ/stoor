// Import Firebase from CDN (these scripts should be added to HTML)
// <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoX7bHO9u98LB9n6Dq8rMwyb_jci_Ha4g",
  authDomain: "stor2-537b7.firebaseapp.com",
  projectId: "stor2-537b7",
  storageBucket: "stor2-537b7.firebasestorage.app",
  messagingSenderId: "427333905777",
  appId: "1:427333905777:web:7508e43e909004eb741ad0",
  measurementId: "G-47YM6T8MMX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Export functions to window object
window.createAccount = async (email, password, username) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // تحديث ملف تعريف المستخدم بإضافة اسم المستخدم
    await user.updateProfile({
      displayName: username
    });

    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName // حفظ اسم المستخدم أيضاً
    }));

    // حفظ معلومات المستخدم في Firestore
    await db.collection('users').doc(user.uid).set({
      username: username,
      email: email
    });

    return userCredential;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};



window.loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email
    }));

    // حفظ معلومات المستخدم في Firestore
    // ملاحظة: عادة يتم حفظ بيانات المستخدم عند الإنشاء، ولكن سنقوم بتحديثها هنا أيضاً للمزامنة
    await db.collection('users').doc(user.uid).set({
      // يجب الحصول على اسم المستخدم من مكان ما عند تسجيل الدخول بالبريد الإلكتروني إذا لم يكن متاحاً مباشرة
      // حالياً، سنفترض أنه يمكن الحصول عليه من user.displayName بعد التحديث الأول عند الإنشاء
      username: user.displayName || 'N/A',
      email: user.email
    }, { merge: true }); // استخدم merge: true لتجنب الكتابة فوق الحقول الأخرى إذا كانت موجودة

    return userCredential;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};



window.signInWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      client_id: '427333905777-ih70b6su7dc8fhqc0eocmqd33ntc29jd.apps.googleusercontent.com'
    });
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }));

    // حفظ معلومات المستخدم في Firestore
    await db.collection('users').doc(user.uid).set({
      username: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    }, { merge: true }); // استخدم merge: true لتجنب الكتابة فوق الحقول الأخرى إذا كانت موجودة

    return result;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};



window.logoutUser = async () => {
  try {
    await auth.signOut();
    // مسح معلومات المستخدم من localStorage
    localStorage.removeItem('user');
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};



window.checkAuthState = (callback) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      // تحديث معلومات المستخدم في localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
    } else {
      // مسح معلومات المستخدم من localStorage عند تسجيل الخروج
      localStorage.removeItem('user');
    }
    callback(user);
  });
};
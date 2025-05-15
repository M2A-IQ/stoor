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
// قائمة البريد الإلكتروني للمشرفين
const adminEmails = ['mustafa050908@gmail.com'];

window.createAccount = async (email, password, username) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // تحديث ملف تعريف المستخدم بإضافة اسم المستخدم
    await user.updateProfile({
      displayName: username
    });

    // التحقق مما إذا كان البريد الإلكتروني في قائمة المشرفين
    const isAdmin = adminEmails.includes(email);

    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin: isAdmin
    }));

    // حفظ معلومات المستخدم في Firestore
    await db.collection('users').doc(user.uid).set({
      username: username,
      email: email,
      isAdmin: isAdmin
    });

    // إذا كان المستخدم مشرفًا، قم بتوجيهه إلى لوحة التحكم
    if (isAdmin) {
      window.location.href = 'admin/dashboard.html';
    }

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

    // التحقق من حالة المشرف في Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    const isAdmin = userData?.isAdmin || adminEmails.includes(user.email);

    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin: isAdmin
    }));

    // تحديث معلومات المستخدم في Firestore
    await db.collection('users').doc(user.uid).set({
      username: user.displayName || 'N/A',
      email: user.email,
      isAdmin: isAdmin
    }, { merge: true });

    // توجيه المشرف إلى لوحة التحكم
    if (isAdmin) {
      window.location.href = 'admin/dashboard.html';
    }

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

    // التحقق مما إذا كان البريد الإلكتروني في قائمة المشرفين
    const isAdmin = adminEmails.includes(user.email);

    // حفظ معلومات المستخدم في localStorage
    localStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: isAdmin
    }));

    // حفظ معلومات المستخدم في Firestore
    await db.collection('users').doc(user.uid).set({
      username: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      isAdmin: isAdmin
    }, { merge: true });

    // توجيه المشرف إلى لوحة التحكم
    if (isAdmin) {
      window.location.href = 'admin/dashboard.html';
    }

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
  return auth.onAuthStateChanged(async (user) => {
    console.log('Authentication state changed. User:', user);
    if (user) {
      // التحقق من حالة المشرف
      let isAdmin = false;
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        isAdmin = userData?.isAdmin || adminEmails.includes(user.email);
      } catch (error) {
        console.error('Error checking admin status:', error);
        isAdmin = adminEmails.includes(user.email);
      }

      // تحديث معلومات المستخدم في localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: isAdmin
      }));
      console.log('User logged in. Display Name:', user.displayName, 'Is Admin:', isAdmin);

      // تحديث معلومات المستخدم في Firestore
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        isAdmin: isAdmin
      }, { merge: true });
    } else {
      // مسح معلومات المستخدم من localStorage عند تسجيل الخروج
      localStorage.removeItem('user');
      console.log('User logged out.');
    }
    callback(user);
  });
};
import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase
const supabaseUrl = 'https://rdpiavjnubfjdikrphcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcGlhdmpudWJmamRpa3JwaGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTcwNTcsImV4cCI6MjA2MjkzMzA1N30.3XVD9sBAClmXTBbOmCoYGI2yxEJ55Fv_wdu9YY_3BoA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// وظائف المصادقة
export const auth = {
  // تسجيل مستخدم جديد
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) {
      console.error('حدث خطأ أثناء التسجيل:', error.message)
      throw error
    }
    
    if (!data.session) {
      return { message: 'تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق.' }
    }
    
    return { message: 'تم التسجيل والدخول بنجاح', data }
  },

  // تسجيل الدخول
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // تسجيل الخروج
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // الاستماع لتغييرات حالة المصادقة
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  }
}
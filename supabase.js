import { createClient } from '@supabase/supabase-js'

// تكوين عميل Supabase
const supabaseUrl = 'https://rdpiavjnubfjdikrphcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcGlhdmpudWJmamRpa3JwaGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTcwNTcsImV4cCI6MjA2MjkzMzA1N30.3XVD9sBAClmXTBbOmCoYGI2yxEJ55Fv_wdu9YY_3BoA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// وظيفة تسجيل الدخول باستخدام Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('خطأ في تسجيل الدخول باستخدام Google:', error.message)
    throw error
  }
}

// وظيفة تسجيل الخروج
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error.message)
    throw error
  }
}

// وظيفة الاستماع لتغييرات حالة المصادقة
export const onAuthStateChange = (callback) => {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return subscription
  } catch (error) {
    console.error('خطأ في الاستماع لتغييرات حالة المصادقة:', error.message)
    throw error
  }
}
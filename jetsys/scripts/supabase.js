// scripts/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ये values तुम्हें Supabase dashboard से मिलेंगी
const SUPABASE_URL = 'https://rqbyqouminzmojvfadai.supabase.co'
const SUPABASE_ANON_KEY = 'process.env.SUPABASE_KEY'

// Supabase client create करो
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Real-time subscriptions
export const subscribeToInventory = (callback) => {
  return supabase
    .from('items')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()
}

export const subscribeToUsage = (callback) => {
  return supabase
    .from('usage_logs')
    .on('*', payload => {
      callback(payload)
    })
    .subscribe()
}
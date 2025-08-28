// scripts/auth.js
import { supabase } from './supabase.js'

export class AuthManager {
    constructor() {
        this.currentUser = null
        this.initAuthState()
    }

    async initAuthState() {
        const { data: { user } } = await supabase.auth.getUser()
        this.currentUser = user
        this.updateUI()
    }

    updateUI() {
        const userEmailElement = document.getElementById('userEmail')
        const logoutBtn = document.getElementById('logoutBtn')
        
        if (userEmailElement) {
            userEmailElement.textContent = this.currentUser?.email || ''
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout())
        }
    }

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            window.location.href = 'auth.html'
        } else {
            console.error('Logout error:', error)
        }
    }

    // Check if user is authenticated
    requireAuth() {
        if (!this.currentUser) {
            window.location.href = 'auth.html'
            return false
        }
        return true
    }

    // Check if user is admin
    async isAdmin() {
        if (!this.currentUser) return false
        
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', this.currentUser.id)
            .single()
            
        return userData?.role === 'admin'
    }
}

// Initialize auth manager
export const authManager = new AuthManager()
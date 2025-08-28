// scripts/inventory.js
import { supabase } from './supabase.js'
import { authManager } from './auth.js'

export class InventoryManager {
    constructor() {
        this.currentItems = []
        this.categories = []
    }

    // Get all inventory items
    async getItems() {
        if (!authManager.requireAuth()) return

        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('name')

        if (error) {
            console.error('Error fetching items:', error)
            return []
        }

        this.currentItems = data
        return data
    }

    // Add new item
    async addItem(itemData) {
        if (!authManager.requireAuth()) return

        const { data: { user } } = await supabase.auth.getUser()
        
        const { data, error } = await supabase
            .from('items')
            .insert([{
                ...itemData,
                created_by: user.id
            }])

        if (error) {
            console.error('Error adding item:', error)
            throw error
        }

        return data
    }

    // Update item
    async updateItem(itemId, updates) {
        if (!authManager.requireAuth()) return

        const { data, error } = await supabase
            .from('items')
            .update(updates)
            .eq('id', itemId)

        if (error) {
            console.error('Error updating item:', error)
            throw error
        }

        return data
    }

    // Delete item
    async deleteItem(itemId) {
        if (!authManager.requireAuth()) return

        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId)

        if (error) {
            console.error('Error deleting item:', error)
            throw error
        }
    }

    // Get categories
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('name')
            .order('name')

        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }

        this.categories = data.map(cat => cat.name)
        return this.categories
    }

    // Add new category
    async addCategory(categoryName) {
        const { error } = await supabase
            .from('categories')
            .insert([{ name: categoryName }])
            .onConflict('name')
            .ignore()

        if (error) {
            console.error('Error adding category:', error)
        }
    }

    // Get low stock items
    getLowStockItems() {
        return this.currentItems.filter(item => item.quantity < item.min_stock)
    }

    // Get critical stock items
    getCriticalStockItems() {
        return this.currentItems.filter(item => item.quantity < item.min_stock * 0.5)
    }
}

export const inventoryManager = new InventoryManager()
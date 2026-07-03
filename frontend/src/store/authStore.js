import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('token') || null,
        loading: false
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        userName: (state) => state.user?.nome || 'Usuário',
        userInitials: (state) => {
            if (!state.user?.nome) return '?'
            return state.user.nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }
    },
    
    actions: {
        async login(email, senha) {
            try {
                this.loading = true
                const response = await api.post('/auth/login', { email, senha })
                const { user, token } = response.data
                
                // Limpar dados anteriores
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                
                this.user = user
                this.token = token
                
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('token', token)
                
                return { success: true }
            } catch (error) {
                return { 
                    success: false, 
                    error: error.response?.data?.error || 'Erro ao fazer login' 
                }
            } finally {
                this.loading = false
            }
        },
        
        async register(nome, email, senha) {
            try {
                this.loading = true
                const response = await api.post('/auth/register', { nome, email, senha })
                const { user, token } = response.data
                
                this.user = user
                this.token = token
                
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('token', token)
                
                return { success: true }
            } catch (error) {
                return { 
                    success: false, 
                    error: error.response?.data?.error || 'Erro ao registrar' 
                }
            } finally {
                this.loading = false
            }
        },
        
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        },
        
        async fetchUser() {
            try {
                const response = await api.get('/users/profile')
                this.user = response.data
                localStorage.setItem('user', JSON.stringify(this.user))
                return response.data
            } catch (error) {
                console.error('Erro ao buscar usuário:', error)
                throw error
            }
        }
    }
})
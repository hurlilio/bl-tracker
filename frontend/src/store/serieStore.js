import { defineStore } from 'pinia'
import api from '../services/api'

export const useSerieStore = defineStore('serie', {
    state: () => ({
        series: [],
        allSeries: [],
        currentSerie: null,
        userProgress: [],
        loading: false,
        error: null
    }),
    
    actions: {
        // Buscar séries do usuário
        async fetchSeries(filters = {}) {
            try {
                this.loading = true
                this.error = null
                console.log('Buscando séries do usuário...')
                
                const response = await api.get('/series', { params: filters })
                this.series = response.data
                console.log('Séries do usuário:', this.series.length)
                return this.series
            } catch (error) {
                this.error = error.response?.data?.error || 'Erro ao carregar séries'
                throw error
            } finally {
                this.loading = false
            }
        },
        
        // Buscar todas as séries (para adicionar)
        async fetchAllSeries() {
            try {
                const response = await api.get('/series/all')
                this.allSeries = response.data
                return this.allSeries
            } catch (error) {
                console.error('Erro ao buscar todas as séries:', error)
                throw error
            }
        },
        
        // Adicionar série ao catálogo
        async addToCatalog(serieId) {
            try {
                await api.post(`/series/add/${serieId}`)
                await this.fetchSeries()
                return { success: true }
            } catch (error) {
                throw error
            }
        },
        
        // Remover série do catálogo
        async removeFromCatalog(serieId) {
            try {
                await api.delete(`/series/remove/${serieId}`)
                await this.fetchSeries()
                return { success: true }
            } catch (error) {
                throw error
            }
        },
        
        // Verificar se série está no catálogo
        async checkInCatalog(serieId) {
            try {
                const response = await api.get(`/series/check/${serieId}`)
                return response.data.inCatalog
            } catch (error) {
                console.error('Erro ao verificar catálogo:', error)
                return false
            }
        },
        
        async fetchSerie(id) {
            try {
                this.loading = true
                this.error = null
                console.log('Buscando série ID:', id)
                
                const response = await api.get(`/series/${id}`)
                this.currentSerie = response.data
                return response.data
            } catch (error) {
                console.error('Erro ao buscar série:', error)
                this.error = error.response?.data?.error || 'Erro ao carregar série'
                throw error
            } finally {
                this.loading = false
            }
        },
        
        async saveProgress(data) {
            try {
                const response = await api.post('/progress', data)
                return response.data
            } catch (error) {
                throw error
            }
        },
        
        async fetchUserProgress() {
            try {
                const response = await api.get('/users/progress')
                this.userProgress = response.data
                return response.data
            } catch (error) {
                throw error
            }
        },

        async deleteSerie(id) {
            try {
                this.loading = true
                const response = await api.delete(`/series/${id}`)
                this.series = this.series.filter(s => s.id !== id)
                if (this.currentSerie && this.currentSerie.id === id) {
                    this.currentSerie = null
                }
                return response.data
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
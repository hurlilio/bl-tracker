<template>
    <div class="page-container">
        <div class="page-header">
            <div>
                <h1 class="page-title">🎬 Catálogo de Séries</h1>
                <p class="page-subtitle">{{ series.length }} séries disponíveis</p>
            </div>
            <div class="search-box">
                <input 
                    type="text" 
                    v-model="search" 
                    placeholder="Buscar séries..."
                    @input="loadSeries"
                    class="search-input"
                />
                <select v-model="filters.pais" @change="loadSeries" class="filter-select">
                    <option value="">🌍 Todos os países</option>
                    <option value="Coreia do Sul">🇰🇷 Coreia do Sul</option>
                    <option value="Japão">🇯🇵 Japão</option>
                    <option value="Tailândia">🇹🇭 Tailândia</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="Taiwan">🇹🇼 Taiwan</option>
                </select>
            </div>
        </div>
        
        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando séries...</p>
        </div>
        
        <div v-else-if="series.length === 0" class="empty-state">
            <i class="fas fa-film"></i>
            <h3>Nenhuma série encontrada</h3>
            <p>Tente ajustar os filtros de busca</p>
                <router-link to="/add-series" class="btn btn-primary" style="margin-top: 12px;">
                    <i class="fas fa-plus"></i> Adicionar Séries
                </router-link>
        </div>
        
        <div v-else class="series-grid">
            <div 
                v-for="serie in series" 
                :key="serie.id" 
                class="serie-card"
                @click="goToSerie(serie.id)"
            >
                <div class="serie-image">
                    <img 
                        :src="serie.capa || '/placeholder.jpg'" 
                        :alt="serie.titulo"
                        @error="$event.target.src = '/placeholder.jpg'"
                    />
                    <div class="serie-overlay">
                        <span class="serie-year">{{ serie.ano || 'N/A' }}</span>
                    </div>
                </div>
                <div class="serie-info">
                    <h3>{{ serie.titulo }}</h3>
                    <div class="serie-meta">
                        <span><i class="fas fa-map-marker-alt"></i> {{ serie.pais || 'N/A' }}</span>
                        <span><i class="fas fa-layer-group"></i> {{ serie.temporadas || 0 }} temp.</span>
                    </div>
                    <p class="serie-sinopse">{{ truncate(serie.sinopse, 80) }}</p>
                    <div class="serie-actions">
                        <button class="btn btn-primary btn-sm" @click.stop="goToSerie(serie.id)">
                            Ver detalhes →
                        </button>
                        <button 
                            class="btn btn-danger-outline btn-sm" 
                            @click.stop="confirmDelete(serie)"
                            title="Excluir série"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação -->
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
            <div class="modal-content">
                <div class="modal-icon">⚠️</div>
                <h2>Confirmar Exclusão</h2>
                <p>Tem certeza que deseja excluir <strong>"{{ serieToDelete?.titulo }}"</strong>?</p>
                <p class="warning-text">Esta ação não pode ser desfeita.</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
                    <button class="btn btn-danger" @click="deleteSerie" :disabled="deleting">
                        {{ deleting ? 'Excluindo...' : 'Confirmar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSerieStore } from '../store/serieStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const serieStore = useSerieStore()
const toast = useToast()

const series = ref([])
const loading = ref(false)
const search = ref('')
const filters = ref({ pais: '' })
const showDeleteModal = ref(false)
const serieToDelete = ref(null)
const deleting = ref(false)

const loadSeries = async () => {
    try {
        loading.value = true
        const params = {}
        if (search.value) params.search = search.value
        if (filters.value.pais) params.pais = filters.value.pais
        
        const data = await serieStore.fetchSeries(params)
        series.value = data || []
    } catch (err) {
        toast.error('Erro ao carregar séries')
        console.error(err)
    } finally {
        loading.value = false
    }
}

const goToSerie = (id) => {
    router.push(`/series/${id}`)
}

const confirmDelete = (serie) => {
    serieToDelete.value = serie
    showDeleteModal.value = true
}

const deleteSerie = async () => {
    if (!serieToDelete.value) return
    
    deleting.value = true
    try {
        await serieStore.deleteSerie(serieToDelete.value.id)
        toast.success(`"${serieToDelete.value.titulo}" excluída!`)
        showDeleteModal.value = false
        serieToDelete.value = null
        await loadSeries()
    } catch (error) {
        toast.error('Erro ao excluir série')
    } finally {
        deleting.value = false
    }
}

const truncate = (text, length) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(() => {
    loadSeries()
})
</script>

<style scoped>
.page-container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 16px;
}

.search-box {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.search-input {
    padding: 10px 20px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary);
    font-size: 14px;
    min-width: 200px;
    transition: var(--transition);
}

.search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-subtle);
}

.search-input::placeholder {
    color: var(--text-tertiary);
}

.filter-select {
    padding: 10px 20px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition);
}

.filter-select:focus {
    outline: none;
    border-color: var(--primary);
}

.series-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.serie-card {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: var(--transition);
    border: 1px solid var(--border-color);
    cursor: pointer;
}

.serie-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-color-hover);
    box-shadow: var(--shadow-hover);
}

.serie-image {
    position: relative;
    overflow: hidden;
    height: 200px;
}

.serie-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.serie-card:hover .serie-image img {
    transform: scale(1.05);
}

.serie-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
}

.serie-year {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 12px;
    border-radius: var(--border-radius-full);
    font-size: 12px;
    font-weight: 600;
}

.serie-info {
    padding: 16px 18px;
}

.serie-info h3 {
    font-size: 16px;
    margin-bottom: 4px;
    color: var(--text-primary);
}

.serie-meta {
    display: flex;
    gap: 14px;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.serie-meta i {
    margin-right: 4px;
}

.serie-sinopse {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 12px;
}

.serie-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.serie-actions .btn-sm {
    flex: 1;
}

.serie-actions .btn-danger-outline {
    flex: 0;
}

.btn-danger-outline {
    background: transparent;
    color: #EF4444;
    border: 1.5px solid rgba(239, 68, 68, 0.2);
    padding: 6px 14px;
    border-radius: var(--border-radius-full);
    font-size: 13px;
    transition: var(--transition);
    cursor: pointer;
}

.btn-danger-outline:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: #EF4444;
    transform: scale(1.05);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    padding: 32px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    border: 1px solid var(--border-color);
}

.modal-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.modal-content h2 {
    color: var(--text-primary);
    margin-bottom: 8px;
}

.modal-content p {
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.warning-text {
    color: #EF4444 !important;
    font-size: 14px;
    margin-top: 8px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
}

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state i {
    font-size: 48px;
    color: var(--text-tertiary);
    margin-bottom: 16px;
}

.empty-state h3 {
    color: var(--text-primary);
    margin-bottom: 4px;
}

.empty-state p {
    color: var(--text-secondary);
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-box {
        flex-direction: column;
    }
    
    .series-grid {
        grid-template-columns: 1fr;
    }
    
    .serie-image {
        height: 160px;
    }
}
</style>
<template>
    <div class="add-séries-container">
        <div class="search-section">
            <h2 class="page-title"> Buscar séries</h2>
            <p class="page-subtitle">Encontre séries na maior base de dados do mundo</p>
            
            <div class="search-bar">
                <input 
                    v-model="searchQuery" 
                    placeholder="Digite o nome da Série..."
                    @keyup.enter="searchséries"
                    class="search-input"
                />
                <button @click="searchséries" class="btn btn-primary">
                    <i class="fas fa-search"></i> Buscar
                </button>
            </div>
            
            <div class="filter-options">
                <button 
                    @click="loadPopular" 
                    class="filter-btn"
                    :class="{ active: activeFilter === 'popular' }"
                >
                    <i class="fas fa-fire"></i> Populares
                </button>
                <button 
                    @click="loadTrending" 
                    class="filter-btn"
                    :class="{ active: activeFilter === 'trending' }"
                >
                    <i class="fas fa-chart-line"></i> Em Alta
                </button>
                <button 
                    @click="loadAll" 
                    class="filter-btn"
                    :class="{ active: activeFilter === 'all' }"
                >
                    <i class="fas fa-list"></i> Todas
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Buscando séries...</p>
        </div>

        <div v-else-if="searchResults.length === 0" class="empty-state">
            <i class="fas fa-film"></i>
            <h3>Nenhuma Série encontrada</h3>
            <p>Tente buscar por outro nome</p>
        </div>

        <div v-else class="results-grid">
            <div v-for="Série in searchResults" :key="Série.id" class="Série-result-card">
                <img 
                    :src="Série.capa || '/placeholder.jpg'" 
                    :alt="Série.titulo"
                    @error="$event.target.src = '/placeholder.jpg'"
                    class="Série-poster"
                />
                <div class="Série-info">
                    <h3>{{ Série.titulo }}</h3>
                    <div class="Série-meta">
                        <span><i class="fas fa-calendar"></i> {{ Série.ano }}</span>
                        <span><i class="fas fa-globe"></i> {{ Série.país }}</span>
                        <span><i class="fas fa-star" style="color: #FFD93D;"></i> {{ Série.nota?.toFixed(1) || 'N/A' }}</span>
                    </div>
                    <p class="Série-overview">{{ truncate(Série.sinopse, 120) }}</p>
                    <div class="Série-actions">
                        <button 
                            @click="importSérie(Série.id)" 
                            class="btn btn-success btn-sm"
                            :disabled="importing"
                        >
                            <i class="fas fa-plus"></i> 
                            {{ importing ? 'Importando...' : 'Adicionar' }}
                        </button>
                        <button 
                            @click="viewDetails(Série.id)" 
                            class="btn btn-primary btn-sm"
                        >
                            <i class="fas fa-eye"></i> Ver
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="Págination" v-if="totalPages > 1">
            <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="filter-btn"
            >
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="filter-btn"
            >
                Próxima <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const importing = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const activeFilter = ref('popular')

const searchséries = async () => {
    if (!searchQuery.value.trim()) {
        toast.warning('Digite o nome da Série')
        return
    }
    
    loading.value = true
    try {
        const response = await api.get('/tmdb/search', {
            params: { query: searchQuery.value, page: currentPage.value }
        })
        searchResults.value = response.data.results || []
        totalPages.value = response.data.total_pages || 1
        activeFilter.value = 'search'
    } catch (error) {
        toast.error('Erro ao buscar séries')
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadPopular = async () => {
    loading.value = true
    activeFilter.value = 'popular'
    try {
        const response = await api.get('/tmdb/popular', {
            params: { page: currentPage.value }
        })
        searchResults.value = response.data.results || []
        totalPages.value = response.data.total_pages || 1
    } catch (error) {
        toast.error('Erro ao carregar séries populares')
    } finally {
        loading.value = false
    }
}

const loadTrending = async () => {
    loading.value = true
    activeFilter.value = 'trending'
    try {
        const response = await api.get('/tmdb/trending', {
            params: { page: currentPage.value }
        })
        searchResults.value = response.data.results || []
        totalPages.value = response.data.total_pages || 1
    } catch (error) {
        toast.error('Erro ao carregar séries em alta')
    } finally {
        loading.value = false
    }
}

const loadAll = async () => {
    searchQuery.value = ''
    activeFilter.value = 'all'
    loading.value = true
    try {
        const response = await api.get('/tmdb/popular', {
            params: { page: currentPage.value }
        })
        searchResults.value = response.data.results || []
        totalPages.value = response.data.total_pages || 1
    } catch (error) {
        toast.error('Erro ao carregar séries')
    } finally {
        loading.value = false
    }
}

const importSérie = async (tmdbId) => {
    importing.value = true
    try {
        await api.post(`/tmdb/import/${tmdbId}`)
        toast.success('Série adicionada com sucesso!')
        searchResults.value = searchResults.value.filter(s => s.id !== tmdbId)
    } catch (error) {
        if (error.response?.status === 409) {
            toast.warning('Série ja existe no Catálogo')
        } else {
            toast.error('Erro ao importar Série')
        }
    } finally {
        importing.value = false
    }
}

const viewDetails = async (tmdbId) => {
    try {
        const response = await api.get(`/tmdb/details/${tmdbId}`)
        window.open(`https://www.themoviedb.org/tv/${tmdbId}`, '_blank')
    } catch (error) {
        window.open(`https://www.themoviedb.org/tv/${tmdbId}`, '_blank')
    }
}

const truncate = (text, length) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        loadPage()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        loadPage()
    }
}

const loadPage = () => {
    switch (activeFilter.value) {
        case 'popular':
            loadPopular()
            break
        case 'trending':
            loadTrending()
            break
        case 'search':
            searchséries()
            break
        default:
            loadPopular()
    }
}

onMounted(() => {
    loadPopular()
})
</script>

<style scoped>
.add-séries-container {
    max-width: 1200px;
    margin: 0 auto;
}

.search-section {
    margin-bottom: 30px;
}

.search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.search-input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid var(--dark-border);
    border-radius: var(--border-radius-sm);
    font-size: 16px;
    transition: var(--transition);
    background: var(--dark-card);
    color: var(--white);
}

.search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
}

.search-input::placeholder {
    color: var(--gray);
}

.filter-options {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-options .btn-sm {
    padding: 8px 16px;
}

.filter-options .active {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.Série-result-card {
    background: var(--dark-card);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--dark-border);
}

.Série-result-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
    border-color: var(--primary);
}

.Série-poster {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.Série-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.Série-info h3 {
    font-size: 16px;
    margin-bottom: 6px;
    color: var(--white);
}

.Série-meta {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--gray);
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.Série-meta i {
    margin-right: 4px;
}

.Série-overview {
    font-size: 13px;
    color: var(--gray);
    line-height: 1.6;
    flex: 1;
    margin-bottom: 12px;
}

.Série-actions {
    display: flex;
    gap: 8px;
}

.Págination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 30px;
}

.page-info {
    color: var(--gray);
    font-size: 14px;
}

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 4px solid var(--dark-border);
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
    padding: 80px 20px;
}

.empty-state i {
    font-size: 64px;
    color: var(--gray);
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 24px;
    color: var(--white);
    margin-bottom: 8px;
}

.empty-state p {
    color: var(--gray);
}

@media (max-width: 768px) {
    .search-bar {
        flex-direction: column;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
    
    .Série-poster {
        height: 160px;
    }
}
</style>
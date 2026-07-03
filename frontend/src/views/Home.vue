<template>
    <div class="dashboard">
        <!-- Header -->
        <div class="dashboard-header">
            <div>
                <h1 class="page-title">📊 Dashboard</h1>
                <p class="page-subtitle">Bem-vindo de volta, {{ authStore.userName }}!</p>
            </div>
            <div class="header-actions">
                <span class="total-series">📺 {{ progressos.length }} série{{ progressos.length !== 1 ? 's' : '' }}</span>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">▶️</div>
                <div class="stat-info">
                    <span class="stat-label">Assistindo</span>
                    <span class="stat-value">{{ stats.assistindo || 0 }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                    <span class="stat-label">Concluídas</span>
                    <span class="stat-value">{{ stats.concluido || 0 }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⏸️</div>
                <div class="stat-info">
                    <span class="stat-label">Pausadas</span>
                    <span class="stat-value">{{ stats.pausado || 0 }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💫</div>
                <div class="stat-info">
                    <span class="stat-label">Quero Assistir</span>
                    <span class="stat-value">{{ stats.quero_assistir || 0 }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-info">
                    <span class="stat-label">Média Notas</span>
                    <span class="stat-value">{{ stats.mediaNota || 0 }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                    <span class="stat-label">Progresso Total</span>
                    <span class="stat-value">{{ stats.progressoTotal || 0 }}%</span>
                </div>
            </div>
        </div>

        <!-- Minhas Séries -->
        <div class="series-section card-standard">
            <div class="section-header">
                <h2>📺 Minhas Séries</h2>
                <div class="filter-tabs">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.value"
                        @click="activeTab = tab.value"
                        class="filter-btn"
                        :class="{ active: activeTab === tab.value }"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando...</p>
            </div>

            <div v-else-if="filteredProgress.length === 0" class="empty-state-standard">
                <i class="fas fa-film"></i>
                <p>Nenhuma série encontrada</p>
                <span class="hint">Comece a adicionar séries ao seu catálogo!</span>
            </div>

            <div v-else class="series-list">
                <div 
                    v-for="p in filteredProgress" 
                    :key="p.id" 
                    class="list-item"
                    @click="goToSerie(p.serie_id)"
                >
                    <div class="series-item-content">
                        <img 
                            :src="p.capa || '/placeholder.jpg'" 
                            :alt="p.titulo"
                            @error="$event.target.src = '/placeholder.jpg'"
                            class="series-thumb"
                        />
                        <div class="series-info">
                            <div class="series-title-row">
                                <h3>{{ p.titulo }}</h3>
                                <span class="badge-status" :class="p.status">
                                    {{ getStatusLabel(p.status) }}
                                </span>
                            </div>
                            <div class="series-progress">
                                <div class="progress-bar">
                                    <div 
                                        class="progress-fill" 
                                        :style="{ width: getProgressPercent(p) + '%' }"
                                        :class="getProgressClass(p)"
                                    ></div>
                                </div>
                                <span class="progress-text">
                                    {{ p.episodio_atual || 0 }} episódio{{ p.episodio_atual !== 1 ? 's' : '' }}
                                    <span v-if="p.nota">• ⭐ {{ p.nota }}</span>
                                </span>
                            </div>
                            <p v-if="p.comentario" class="series-comment">
                                💬 {{ p.comentario }}
                            </p>
                        </div>
                        <div class="series-actions">
                            <button class="btn btn-primary btn-sm" @click.stop="goToSerie(p.serie_id)">
                                Ver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useSerieStore } from '../store/serieStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const serieStore = useSerieStore()
const toast = useToast()

const progressos = ref([])
const loading = ref(true)
const activeTab = ref('all')

const tabs = [
    { label: 'Todas', value: 'all' },
    { label: '▶️ Assistindo', value: 'assistindo' },
    { label: '✅ Concluídas', value: 'concluido' },
    { label: '💫 Quero Assistir', value: 'quero_assistir' },
    { label: '⏸️ Pausadas', value: 'pausado' }
]

const stats = computed(() => {
    const stats = {
        assistindo: 0,
        concluido: 0,
        pausado: 0,
        dropado: 0,
        quero_assistir: 0,
        mediaNota: 0,
        progressoTotal: 0
    }
    
    let totalNotas = 0
    let countNotas = 0
    
    progressos.value.forEach(p => {
        if (stats[p.status] !== undefined) stats[p.status]++
        if (p.nota) {
            totalNotas += Number(p.nota)
            countNotas++
        }
    })
    
    stats.mediaNota = countNotas > 0 ? (totalNotas / countNotas).toFixed(1) : 0
    const total = progressos.value.length || 1
    stats.progressoTotal = Math.round((stats.concluido / total) * 100)
    
    return stats
})

const filteredProgress = computed(() => {
    if (activeTab.value === 'all') return progressos.value
    return progressos.value.filter(p => p.status === activeTab.value)
})

const getStatusLabel = (status) => {
    const labels = {
        assistindo: '▶️ Assistindo',
        concluido: '✅ Concluído',
        pausado: '⏸️ Pausado',
        dropado: '❌ Dropado',
        quero_assistir: '💫 Quero Assistir'
    }
    return labels[status] || status
}

const getProgressPercent = (p) => {
    if (!p.episodio_atual) return 0
    const totalEp = (p.temporadas || 1) * 10
    const percent = Math.min((p.episodio_atual / totalEp) * 100, 100)
    return Math.round(percent)
}

const getProgressClass = (p) => {
    const percent = getProgressPercent(p)
    if (percent >= 80) return 'progress-high'
    if (percent >= 40) return 'progress-mid'
    return 'progress-low'
}

const goToSerie = (id) => {
    router.push(`/series/${id}`)
}

const loadData = async () => {
    try {
        loading.value = true
        const data = await serieStore.fetchUserProgress()
        progressos.value = data || []
    } catch (error) {
        toast.error('Erro ao carregar progresso')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.dashboard {
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 16px;
}

.total-series {
    background: var(--bg-card);
    padding: 8px 20px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 14px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 14px;
    margin-bottom: 28px;
}

.stat-card {
    background: var(--bg-card);
    border-radius: 14px;
    padding: 14px 18px;
    border: 1px solid var(--border-color);
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--border-color-hover);
}

.stat-icon {
    font-size: 24px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 11px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
}

.series-section {
    padding: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 12px;
}

.section-header h2 {
    font-size: 18px;
    color: var(--text-primary);
}

.filter-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 6px 16px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.filter-btn:hover {
    background: rgba(59, 130, 246, 0.06);
    border-color: var(--border-color-hover);
    color: var(--text-primary);
}

.filter-btn.active {
    background: var(--gradient-primary);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 20px var(--primary-glow);
}

.series-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.list-item {
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    transition: var(--transition);
    cursor: pointer;
}

.list-item:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateX(4px);
}

.series-item-content {
    display: flex;
    align-items: center;
    gap: 14px;
}

.series-thumb {
    width: 50px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
}

.series-info {
    flex: 1;
    min-width: 0;
}

.series-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
    flex-wrap: wrap;
}

.series-title-row h3 {
    font-size: 14px;
    color: var(--text-primary);
}

.badge-status {
    padding: 2px 10px;
    border-radius: var(--border-radius-full);
    font-size: 10px;
    font-weight: 600;
    border: 1px solid transparent;
}

.badge-status.assistindo {
    background: rgba(59, 130, 246, 0.12);
    color: var(--primary);
    border-color: rgba(59, 130, 246, 0.2);
}

.badge-status.concluido {
    background: rgba(34, 197, 94, 0.12);
    color: #22C55E;
    border-color: rgba(34, 197, 94, 0.2);
}

.badge-status.pausado {
    background: rgba(249, 115, 22, 0.12);
    color: #F97316;
    border-color: rgba(249, 115, 22, 0.15);
}

.badge-status.quero_assistir {
    background: rgba(139, 92, 246, 0.12);
    color: #8B5CF6;
    border-color: rgba(139, 92, 246, 0.15);
}

.badge-status.dropado {
    background: rgba(239, 68, 68, 0.12);
    color: #EF4444;
    border-color: rgba(239, 68, 68, 0.15);
}

.series-progress {
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: var(--border-color);
    border-radius: 10px;
    overflow: hidden;
    max-width: 150px;
}

.progress-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.6s ease;
}

.progress-fill.progress-high { background: var(--gradient-primary); }
.progress-fill.progress-mid { background: #F97316; }
.progress-fill.progress-low { background: #8B5CF6; }

.progress-text {
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
}

.series-comment {
    font-size: 12px;
    color: var(--text-tertiary);
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.series-actions {
    flex-shrink: 0;
}

.loading {
    text-align: center;
    padding: 40px;
}

.loading-spinner {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.empty-state-standard {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
}

.empty-state-standard i {
    font-size: 32px;
    color: var(--text-tertiary);
    margin-bottom: 12px;
}

.empty-state-standard p {
    font-size: 15px;
    font-weight: 500;
}

.empty-state-standard .hint {
    font-size: 13px;
    color: var(--text-tertiary);
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .series-item-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }
    
    .series-thumb {
        width: 100%;
        height: 100px;
        object-fit: cover;
    }
    
    .series-title-row {
        justify-content: center;
    }
    
    .series-progress {
        flex-direction: column;
        align-items: center;
    }
    
    .progress-bar {
        max-width: 100%;
        width: 100%;
    }
    
    .section-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filter-tabs {
        justify-content: center;
    }
}
</style>
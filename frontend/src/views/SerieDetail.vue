<template>
    <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando série...</p>
    </div>

    <div v-else-if="serie" class="serie-detail">
        <!-- Botão Voltar -->
        <div class="back-button">
            <button class="btn btn-secondary" @click="goBack">
                <i class="fas fa-arrow-left"></i> Voltar
            </button>
        </div>

        <!-- Hero -->
        <div class="hero-banner" :style="{ backgroundImage: `linear-gradient(135deg, rgba(10,12,16,0.92) 0%, rgba(10,12,16,0.6) 100%), url(${serie.capa || ''})` }">
            <div class="hero-content">
                <div class="hero-tags">
                    <span class="tag tag-primary">Série</span>
                    <span class="tag tag-year">{{ serie.ano || 'N/A' }}</span>
                    <span class="tag tag-country">{{ serie.pais || 'N/A' }}</span>
                </div>
                <h1 class="hero-title">{{ serie.titulo }}</h1>
                <div class="hero-meta">
                    <span><i class="fas fa-layer-group"></i> {{ serie.temporadas || 0 }} temporada{{ serie.temporadas > 1 ? 's' : '' }}</span>
                    <span><i class="fas fa-tag"></i> {{ serie.genero || 'N/A' }}</span>
                </div>
                <p class="hero-sinopse">{{ serie.sinopse || 'Sinopse não disponível' }}</p>
            </div>
        </div>

        <!-- Progresso -->
        <div class="card-standard">
            <div class="section-header">
                <h2><i class="fas fa-chart-line"></i> Meu Progresso</h2>
                <span class="badge-status" :class="progresso.status">
                    {{ getStatusLabel(progresso.status) }}
                </span>
            </div>

            <form @submit.prevent="saveProgress" class="form-standard">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-flag"></i> Status</label>
                        <select v-model="progresso.status" class="form-control">
                            <option value="quero_assistir">💫 Quero Assistir</option>
                            <option value="assistindo">▶️ Assistindo</option>
                            <option value="pausado">⏸️ Pausado</option>
                            <option value="concluido">✅ Concluído</option>
                            <option value="dropado">❌ Dropado</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-play-circle"></i> Episódio</label>
                        <input 
                            type="number" 
                            v-model.number="progresso.episodio_atual" 
                            min="0" 
                            placeholder="0"
                            class="form-control"
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-star"></i> Nota</label>
                        <input 
                            type="number" 
                            v-model.number="progresso.nota" 
                            min="0" 
                            max="10" 
                            step="0.5"
                            placeholder="0"
                            class="form-control"
                        />
                    </div>
                </div>

                <div class="form-group full-width">
                    <label class="form-label"><i class="fas fa-comment"></i> Comentário</label>
                    <textarea 
                        v-model="progresso.comentario" 
                        rows="3" 
                        placeholder="O que você achou?"
                        class="form-control"
                    ></textarea>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="saving">
                    <i class="fas fa-save"></i>
                    {{ saving ? 'Salvando...' : 'Salvar Progresso' }}
                </button>
            </form>
        </div>

        <!-- Interpretações -->
        <div class="card-standard">
            <div class="section-header">
                <h2><i class="fas fa-comments"></i> Interpretações</h2>
                <button class="btn btn-primary btn-sm" @click="showNewInterpretation = !showNewInterpretation">
                    <i class="fas" :class="showNewInterpretation ? 'fa-times' : 'fa-plus'"></i>
                    {{ showNewInterpretation ? 'Fechar' : 'Nova' }}
                </button>
            </div>

            <div v-if="showNewInterpretation" class="new-interpretation">
                <h3>✍️ Nova Interpretação</h3>
                <form @submit.prevent="saveInterpretation" class="form-standard">
                    <div class="form-group">
                        <label class="form-label">Título</label>
                        <input 
                            v-model="newInterpretation.titulo" 
                            placeholder="Título da interpretação"
                            class="form-control"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Conteúdo</label>
                        <textarea 
                            v-model="newInterpretation.conteudo" 
                            rows="4" 
                            placeholder="Sua interpretação..."
                            class="form-control"
                            required
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="newInterpretation.spoiler" />
                            <span>⚠️ Contém spoilers</span>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary" :disabled="savingInterpretation">
                        <i class="fas fa-paper-plane"></i>
                        {{ savingInterpretation ? 'Publicando...' : 'Publicar' }}
                    </button>
                </form>
            </div>

            <div class="interpretations-list">
                <div v-if="interpretations.length === 0" class="empty-state-standard">
                    <i class="fas fa-comment-dots"></i>
                    <p>Nenhuma interpretação</p>
                    <span class="hint">Seja o primeiro a compartilhar sua visão!</span>
                </div>

                <div v-else v-for="interp in interpretations" :key="interp.id" class="list-item">
                    <div class="interp-header">
                        <div class="interp-user">
                            <span class="interp-avatar">{{ interp.usuario_nome?.charAt(0) || '?' }}</span>
                            <div>
                                <span class="interp-name">{{ interp.usuario_nome }}</span>
                                <span class="interp-date">{{ formatDate(interp.created_at) }}</span>
                            </div>
                        </div>
                        <span v-if="interp.spoiler" class="badge-spoiler">⚠️ Spoiler</span>
                    </div>
                    <h4 class="interp-title">{{ interp.titulo }}</h4>
                    <p class="interp-content">{{ interp.conteudo }}</p>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Série não encontrada</h3>
        <p>A série que você está procurando não existe.</p>
        <button class="btn btn-primary" @click="goBack">Voltar</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSerieStore } from '../store/serieStore'
import { useToast } from 'vue-toastification'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const serieStore = useSerieStore()
const toast = useToast()

const serie = ref(null)
const loading = ref(true)
const saving = ref(false)
const savingInterpretation = ref(false)
const showNewInterpretation = ref(false)

const progresso = ref({
    status: 'quero_assistir',
    episodio_atual: 0,
    nota: null,
    comentario: ''
})

const interpretations = ref([])
const newInterpretation = ref({
    titulo: '',
    conteudo: '',
    spoiler: false
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

const goBack = () => {
    router.push('/series')
}

const loadSerie = async () => {
    try {
        loading.value = true
        const id = route.params.id
        console.log('Carregando série ID:', id)
        
        const data = await serieStore.fetchSerie(id)
        console.log('Série carregada:', data)
        serie.value = data
        
        await loadProgress()
        await loadInterpretations()
    } catch (error) {
        console.error('Erro ao carregar série:', error)
        toast.error('Erro ao carregar série')
        router.push('/series')
    } finally {
        loading.value = false
    }
}

const loadProgress = async () => {
    try {
        const response = await api.get(`/progress/${serie.value.id}`)
        console.log('Progresso carregado:', response.data)
        if (response.data && response.data.id) {
            progresso.value = {
                status: response.data.status || 'quero_assistir',
                episodio_atual: response.data.episodio_atual || 0,
                nota: response.data.nota || null,
                comentario: response.data.comentario || ''
            }
        }
    } catch (error) {
        console.log('Sem progresso ainda')
        progresso.value.episodio_atual = 0
    }
}

const loadInterpretations = async () => {
    try {
        const response = await api.get(`/interpretations/serie/${serie.value.id}`)
        interpretations.value = response.data || []
    } catch (error) {
        console.error('Erro ao carregar interpretações:', error)
    }
}

const saveProgress = async () => {
    try {
        saving.value = true
        const episodioAtual = parseInt(progresso.value.episodio_atual) || 0
        const nota = progresso.value.nota ? parseFloat(progresso.value.nota) : null
        
        const data = {
            serieId: parseInt(serie.value.id),
            episodioAtual: episodioAtual,
            status: progresso.value.status || 'quero_assistir',
            nota: nota,
            comentario: progresso.value.comentario || ''
        }
        
        console.log('Salvando progresso:', data)
        await serieStore.saveProgress(data)
        toast.success('Progresso salvo! ✨')
        await loadProgress()
    } catch (error) {
        console.error('Erro ao salvar progresso:', error)
        toast.error('Erro ao salvar progresso')
    } finally {
        saving.value = false
    }
}

const saveInterpretation = async () => {
    try {
        savingInterpretation.value = true
        await api.post('/interpretations', {
            serieId: parseInt(serie.value.id),
            titulo: newInterpretation.value.titulo,
            conteudo: newInterpretation.value.conteudo,
            spoiler: newInterpretation.value.spoiler || false
        })
        toast.success('Interpretação publicada! 🎉')
        newInterpretation.value = { titulo: '', conteudo: '', spoiler: false }
        showNewInterpretation.value = false
        await loadInterpretations()
    } catch (error) {
        console.error('Erro ao publicar interpretação:', error)
        toast.error('Erro ao publicar interpretação')
    } finally {
        savingInterpretation.value = false
    }
}

const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
    loadSerie()
})
</script>

<style scoped>
.serie-detail {
    max-width: 1000px;
    margin: 0 auto;
}

.back-button {
    margin-bottom: 20px;
}

.back-button .btn {
    padding: 8px 20px;
}

.hero-banner {
    border-radius: var(--border-radius);
    padding: 40px 36px;
    margin-bottom: 24px;
    background-size: cover;
    background-position: center;
    min-height: 220px;
    display: flex;
    align-items: flex-end;
}

.hero-content {
    width: 100%;
}

.hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
}

.tag {
    padding: 3px 14px;
    border-radius: var(--border-radius-full);
    font-size: 11px;
    font-weight: 600;
}

.tag-primary {
    background: rgba(59, 130, 246, 0.2);
    color: var(--primary);
    border: 1px solid rgba(59, 130, 246, 0.15);
}

.tag-year {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.04);
}

.tag-country {
    background: rgba(249, 115, 22, 0.12);
    color: var(--secondary);
    border: 1px solid rgba(249, 115, 22, 0.1);
}

.hero-title {
    font-size: 30px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 6px;
    letter-spacing: -0.5px;
}

.hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 10px;
}

.hero-meta i {
    margin-right: 6px;
    color: var(--primary);
}

.hero-sinopse {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(241, 245, 249, 0.8);
    max-width: 80%;
}

.card-standard {
    padding: 24px;
    margin-bottom: 24px;
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

.section-header h2 i {
    color: var(--primary);
    margin-right: 8px;
}

.badge-status {
    padding: 4px 16px;
    border-radius: var(--border-radius-full);
    font-size: 12px;
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
    color: var(--secondary);
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

.form-standard {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
}

.form-label i {
    color: var(--primary);
    font-size: 14px;
}

.form-control {
    padding: 10px 16px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    width: 100%;
}

.form-control:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-subtle);
}

.form-control::placeholder {
    color: var(--text-tertiary);
}

select.form-control {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
}

select.form-control option {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

textarea.form-control {
    border-radius: var(--border-radius-sm);
    resize: vertical;
    min-height: 80px;
}

.new-interpretation {
    background: rgba(59, 130, 246, 0.04);
    padding: 20px;
    border-radius: var(--border-radius-sm);
    margin-bottom: 20px;
    border: 1px solid rgba(59, 130, 246, 0.08);
}

.new-interpretation h3 {
    font-size: 16px;
    color: var(--primary);
    margin-bottom: 14px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
    cursor: pointer;
}

.interpretations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.list-item {
    padding: 14px 18px;
    border-radius: var(--border-radius-sm);
    border-left: 3px solid var(--primary);
    background: rgba(255, 255, 255, 0.02);
    transition: var(--transition);
}

.list-item:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateX(4px);
}

.interp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    flex-wrap: wrap;
    gap: 8px;
}

.interp-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.interp-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--gradient-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
}

.interp-name {
    font-weight: 600;
    color: var(--primary);
    font-size: 14px;
}

.interp-date {
    font-size: 12px;
    color: var(--text-tertiary);
    display: block;
}

.interp-title {
    color: var(--text-primary);
    font-size: 15px;
    margin-bottom: 2px;
}

.interp-content {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 14px;
}

.badge-spoiler {
    background: rgba(239, 68, 68, 0.12);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.12);
    font-size: 10px;
    padding: 2px 12px;
    border-radius: var(--border-radius-full);
}

.loading {
    text-align: center;
    padding: 80px 20px;
}

.loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
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
    margin-bottom: 20px;
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
    .hero-banner {
        padding: 24px 20px;
        min-height: 180px;
    }

    .hero-title {
        font-size: 22px;
    }

    .hero-sinopse {
        max-width: 100%;
        font-size: 14px;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .interp-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
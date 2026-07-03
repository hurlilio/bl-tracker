<template>
    <div class="profile-container">
        <div class="profile-header">
            <h1 class="page-title">👤 Meu Perfil</h1>
            <p class="page-subtitle">Gerencie suas informações pessoais</p>
        </div>

        <div class="profile-card card-standard">
            <div class="profile-avatar-section">
                <div class="profile-avatar">
                    <span class="avatar-text">{{ authStore.userInitials }}</span>
                </div>
                <div class="profile-name">
                    <h2>{{ user?.nome || 'Usuário' }}</h2>
                    <span class="profile-email">{{ user?.email }}</span>
                </div>
            </div>

            <form @submit.prevent="updateProfile" class="profile-form">
                <div class="form-group">
                    <label>Nome</label>
                    <input 
                        v-model="editData.nome" 
                        class="input-modern"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>Bio</label>
                    <textarea 
                        v-model="editData.bio" 
                        rows="3" 
                        placeholder="Fale um pouco sobre você..."
                        class="input-modern"
                    ></textarea>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="saving">
                    <i class="fas fa-save"></i>
                    {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
                </button>
            </form>
        </div>

        <!-- Estatísticas -->
        <div class="stats-section card-standard">
            <h2>📊 Estatísticas</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">{{ stats.total || 0 }}</span>
                    <span class="stat-label">Total de Séries</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ stats.concluido || 0 }}</span>
                    <span class="stat-label">Concluídas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ stats.assistindo || 0 }}</span>
                    <span class="stat-label">Assistindo</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ stats.mediaNota || 0 }}</span>
                    <span class="stat-label">Média Notas</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useSerieStore } from '../store/serieStore'
import api from '../services/api'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const serieStore = useSerieStore()
const toast = useToast()

const user = computed(() => authStore.user)
const saving = ref(false)
const progressos = ref([])

const editData = ref({
    nome: '',
    bio: ''
})

const stats = computed(() => {
    const stats = {
        total: 0,
        assistindo: 0,
        concluido: 0,
        pausado: 0,
        mediaNota: 0
    }
    
    let totalNotas = 0
    let countNotas = 0
    
    progressos.value.forEach(p => {
        stats.total++
        if (stats[p.status] !== undefined) {
            stats[p.status]++
        }
        if (p.nota) {
            totalNotas += Number(p.nota)
            countNotas++
        }
    })
    
    stats.mediaNota = countNotas > 0 ? (totalNotas / countNotas).toFixed(1) : 0
    
    return stats
})

const loadData = async () => {
    try {
        if (user.value) {
            editData.value.nome = user.value.nome
            editData.value.bio = user.value.bio || ''
        }
        
        const data = await serieStore.fetchUserProgress()
        progressos.value = data || []
    } catch (error) {
        toast.error('Erro ao carregar dados')
    }
}

const updateProfile = async () => {
    try {
        saving.value = true
        const response = await api.put('/users/profile', editData.value)
        
        authStore.user = { ...authStore.user, ...response.data }
        localStorage.setItem('user', JSON.stringify(authStore.user))
        
        toast.success('Perfil atualizado com sucesso! ✨')
    } catch (error) {
        toast.error('Erro ao atualizar perfil')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 0 auto;
}

.profile-header {
    margin-bottom: 28px;
}

.profile-header .page-title {
    margin-bottom: 4px;
}

.profile-header .page-subtitle {
    color: var(--text-secondary);
    font-size: 15px;
}

.profile-card {
    padding: 28px;
    margin-bottom: 24px;
}

.profile-avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-text {
    font-size: 32px;
    font-weight: 700;
    color: white;
}

.profile-name h2 {
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.profile-email {
    color: var(--text-secondary);
    font-size: 14px;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.profile-form .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.profile-form .input-modern {
    padding: 10px 16px;
    border-radius: var(--border-radius-full);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    width: 100%;
}

.profile-form .input-modern:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-subtle);
}

.profile-form .input-modern::placeholder {
    color: var(--text-tertiary);
}

.profile-form textarea.input-modern {
    border-radius: var(--border-radius-sm);
    resize: vertical;
    min-height: 80px;
}

.stats-section {
    padding: 24px 28px;
}

.stats-section h2 {
    font-size: 18px;
    color: var(--text-primary);
    margin-bottom: 16px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
}

.stat-item {
    text-align: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--border-color);
}

.stat-number {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-label {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
}

@media (max-width: 768px) {
    .profile-avatar-section {
        flex-direction: column;
        text-align: center;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
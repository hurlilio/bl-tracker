<template>
    <div>
        <div class="page-header">
            <div>
                <h1 class="page-title">👥 Grupos</h1>
                <p class="page-subtitle">Organize suas séries com amigos</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary" @click="showJoinGroup = true">
                    <i class="fas fa-door-open"></i> Entrar com código
                </button>
                <button class="btn btn-primary" @click="showCreateGroup = true">
                    <i class="fas fa-plus"></i> Criar Grupo
                </button>
            </div>
        </div>
        
        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando grupos...</p>
        </div>
        
        <div v-else-if="groups.length === 0" class="empty-state">
            <i class="fas fa-users"></i>
            <h3>Nenhum grupo ainda</h3>
            <p>Crie um novo grupo ou use um código de convite para entrar</p>
        </div>
        
        <div v-else class="groups-grid">
            <div v-for="group in groups" :key="group.id" class="group-card">
                <div class="group-header">
                    <div class="group-icon">👥</div>
                    <div class="group-title">
                        <h3>{{ group.nome }}</h3>
                        <span class="group-role" v-if="group.role === 'admin'">
                            <i class="fas fa-crown"></i> Admin
                        </span>
                    </div>
                </div>
                <p v-if="group.Descrição" class="group-desc">{{ group.Descrição }}</p>
                <div class="group-stats">
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <span>{{ group.total_membros || 0 }} membros</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-code"></i>
                        <span>{{ group.código_convite }}</span>
                    </div>
                </div>
                <p class="group-date">
                    <i class="fas fa-calendar-alt"></i>
                    Criado em {{ formatDate(group.created_at) }}
                </p>
            </div>
        </div>
        
        <!-- Modal Criar Grupo -->
        <div v-if="showCreateGroup" class="modal-overlay" @click.self="showCreateGroup = false">
            <div class="modal-content">
                <h2><i class="fas fa-plus-circle"></i> Criar Novo Grupo</h2>
                <form @submit.prevent="createGroup">
                    <div class="form-group">
                        <label>Nome do Grupo</label>
                        <input v-model="newGroup.nome" required placeholder="Ex: Doidos por BL" />
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea v-model="newGroup.Descrição" rows="3" placeholder="Descreva seu grupo..."></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" @click="showCreateGroup = false">Cancelar</button>
                        <button type="submit" class="btn btn-primary" :disabled="creating">
                            {{ creating ? 'Criando...' : 'Criar Grupo' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Modal Entrar em Grupo -->
        <div v-if="showJoinGroup" class="modal-overlay" @click.self="showJoinGroup = false">
            <div class="modal-content">
                <h2><i class="fas fa-door-open"></i> Entrar em Grupo</h2>
                <p>Digite o código de convite do grupo:</p>
                <form @submit.prevent="joinGroup">
                    <div class="form-group">
                        <label>código de Convite</label>
                        <input v-model="joinCode" placeholder="Ex: ABCD1234" required maxlength="8" />
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" @click="showJoinGroup = false">Cancelar</button>
                        <button type="submit" class="btn btn-primary" :disabled="joining">
                            {{ joining ? 'Entrando...' : 'Entrar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const groups = ref([])
const loading = ref(true)
const showCreateGroup = ref(false)
const showJoinGroup = ref(false)
const creating = ref(false)
const joining = ref(false)

const newGroup = ref({ nome: '', Descrição: '' })
const joinCode = ref('')

const loadGroups = async () => {
    try {
        loading.value = true
        const response = await api.get('/groups/my-groups')
        groups.value = response.data || []
    } catch (error) {
        toast.error('Erro ao carregar grupos')
    } finally {
        loading.value = false
    }
}

const createGroup = async () => {
    try {
        creating.value = true
        await api.post('/groups', newGroup.value)
        toast.success('Grupo criado com sucesso!')
        showCreateGroup.value = false
        newGroup.value = { nome: '', Descrição: '' }
        await loadGroups()
    } catch (error) {
        toast.error('Erro ao criar grupo')
    } finally {
        creating.value = false
    }
}

const joinGroup = async () => {
    try {
        joining.value = true
        await api.post(`/groups/join/${joinCode.value.toUpperCase()}`)
        toast.success('Entrou no grupo com sucesso!')
        showJoinGroup.value = false
        joinCode.value = ''
        await loadGroups()
    } catch (error) {
        toast.error('código invalido ou erro ao entrar no grupo')
    } finally {
        joining.value = false
    }
}

const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    })
}

onMounted(() => {
    loadGroups()
})
</script>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
}

.header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.group-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius);
    padding: 24px;
    box-shadow: var(--shadow);
    transition: var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.group-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

.group-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
}

.group-icon {
    font-size: 32px;
}

.group-title {
    flex: 1;
}

.group-title h3 {
    color: var(--dark);
    font-size: 18px;
}

.group-role {
    font-size: 12px;
    color: #f59e0b;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
}

.group-desc {
    color: var(--gray);
    margin-bottom: 16px;
    line-height: 1.6;
}

.group-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--gray);
    background: var(--light);
    padding: 6px 14px;
    border-radius: 20px;
}

.stat-item i {
    color: var(--primary);
}

.group-date {
    font-size: 13px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    padding: 32px;
    border-radius: var(--border-radius);
    width: 100%;
    max-width: 480px;
    animation: modalIn 0.3s ease;
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-content h2 {
    margin-bottom: 20px;
    color: var(--dark);
}

.modal-content h2 i {
    color: var(--primary);
}

.modal-content p {
    color: var(--gray);
    margin-bottom: 16px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 4px solid var(--gray-light);
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
    margin-bottom: 20px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.empty-state h3 {
    font-size: 24px;
    margin-bottom: 8px;
    color: var(--dark);
}

.empty-state p {
    color: var(--gray);
    font-size: 16px;
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .header-actions {
        flex-direction: column;
    }
    
    .header-actions .btn {
        width: 100%;
        justify-content: center;
    }
    
    .groups-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        padding: 24px;
        margin: 16px;
    }
}
</style>
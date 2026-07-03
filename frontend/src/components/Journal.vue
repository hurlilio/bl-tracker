<template>
    <div class="journal-container card">
        <div class="journal-header">
            <h2>?? Jornal de Bordo</h2>
            <button class="btn btn-primary btn-sm" @click="showForm = !showForm">
                {{ showForm ? '? Fechar' : '?? Nova Entrada' }}
            </button>
        </div>

        <div v-if="showForm" class="journal-form">
            <div class="form-group">
                <label>?? S?rie</label>
                <select v-model="newEntry.serieId">
                    <option v-for="p in progressos" :key="p.serie_id" :value="p.serie_id">{{ p.titulo }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>?? O que assistiu?</label>
                <textarea v-model="newEntry.content" rows="3" placeholder="Escreva suas reflex?es..."></textarea>
            </div>
            <div class="form-group">
                <label>?? Cita??o favorita</label>
                <input v-model="newEntry.quote" placeholder="'Melhor epis?dio at? agora!'" />
            </div>
            <button class="btn btn-primary" @click="saveEntry">?? Salvar</button>
        </div>

        <div class="journal-list">
            <div v-if="entries.length === 0" class="empty-state">
                <p>Nenhuma entrada ainda. Comece a escrever seu di?rio de s?ries!</p>
            </div>
            <div v-for="entry in entries" :key="entry.id" class="journal-entry">
                <div class="entry-header">
                    <span class="entry-date">{{ formatDate(entry.date) }}</span>
                    <span class="entry-serie">{{ entry.serie }}</span>
                </div>
                <p>{{ entry.content }}</p>
                <blockquote v-if="entry.quote">?? "{{ entry.quote }}"</blockquote>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ progressos: { type: Array, required: true } })

const showForm = ref(false)
const entries = ref([])

const newEntry = ref({ serieId: null, content: '', quote: '' })

// Carregar entries do localStorage
onMounted(() => {
    const saved = localStorage.getItem('bl_journal')
    if (saved) entries.value = JSON.parse(saved)
})

const saveEntry = () => {
    if (!newEntry.value.serieId || !newEntry.value.content) return
    
    const serie = props.progressos.find(p => p.serie_id === newEntry.value.serieId)
    entries.value.unshift({
        id: Date.now(),
        serie: serie?.titulo || 'S?rie desconhecida',
        serieId: newEntry.value.serieId,
        content: newEntry.value.content,
        quote: newEntry.value.quote,
        date: new Date().toISOString()
    })
    
    localStorage.setItem('bl_journal', JSON.stringify(entries.value))
    newEntry.value = { serieId: null, content: '', quote: '' }
    showForm.value = false
}

const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.journal-container { padding: 20px; margin-top: 24px; }
.journal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.journal-header h2 { color: var(--white); font-size: 20px; }
.journal-form { background: var(--dark-secondary); padding: 20px; border-radius: var(--border-radius-sm); margin-bottom: 16px; }
.journal-list { display: flex; flex-direction: column; gap: 12px; }
.journal-entry { background: var(--dark-secondary); padding: 14px 16px; border-radius: var(--border-radius-sm); border-left: 3px solid var(--primary); }
.entry-header { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
.entry-date { color: var(--gray); }
.entry-serie { color: var(--primary); font-weight: 600; }
.journal-entry p { color: var(--white); font-size: 14px; }
.journal-entry blockquote { color: var(--gray); font-style: italic; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--gray); }
</style>

<template>
    <div class="export-container card">
        <h2>?? Exportar Dados</h2>
        <div class="export-buttons">
            <button class="btn btn-primary" @click="exportPDF">?? PDF</button>
            <button class="btn btn-secondary" @click="exportCSV">?? CSV</button>
            <button class="btn btn-success" @click="exportJSON">?? JSON</button>
        </div>
    </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'

const props = defineProps({ progressos: { type: Array, required: true } })
const toast = useToast()

const exportCSV = () => {
    const headers = ['S?rie', 'Status', 'Epis?dios', 'Nota', 'Coment?rio', '?ltima Atualiza??o']
    const rows = props.progressos.map(p => [
        p.titulo,
        p.status,
        p.episodio_atual || 0,
        p.nota || 'N/A',
        p.comentario || '',
        new Date(p.updated_at).toLocaleDateString('pt-BR')
    ])
    
    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
        csv += row.join(',') + '\n'
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bl_tracker_dados.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('?? CSV exportado com sucesso!')
}

const exportJSON = () => {
    const data = JSON.stringify(props.progressos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bl_tracker_dados.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('?? JSON exportado com sucesso!')
}

const exportPDF = () => {
    toast.info('?? Fun??o PDF em desenvolvimento! Use CSV ou JSON por enquanto.')
}
</script>

<style scoped>
.export-container { padding: 20px; margin-top: 24px; }
.export-container h2 { color: var(--white); margin-bottom: 16px; font-size: 20px; }
.export-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
</style>

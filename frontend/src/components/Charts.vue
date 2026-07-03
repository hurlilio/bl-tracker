<template>
    <div class="charts-grid">
        <div class="chart-card card-standard">
            <h3>📊 Status</h3>
            <canvas ref="statusChart"></canvas>
        </div>
        <div class="chart-card card-standard">
            <h3>⭐ Notas</h3>
            <canvas ref="ratingChart"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({ progressos: { type: Array, required: true } })

const statusChart = ref(null)
const ratingChart = ref(null)
let charts = {}

const createCharts = () => {
    Object.values(charts).forEach(c => c.destroy())
    charts = {}

    // Status
    const statusMap = { assistindo: 0, concluido: 0, pausado: 0, quero_assistir: 0 }
    props.progressos.forEach(p => {
        if (statusMap[p.status] !== undefined) statusMap[p.status]++
    })
    
    charts.status = new Chart(statusChart.value, {
        type: 'doughnut',
        data: {
            labels: ['▶️ Assistindo', '✅ Concluído', '⏸️ Pausado', '💫 Quero Assistir'],
            datasets: [{
                data: Object.values(statusMap),
                backgroundColor: ['#7C3AED', '#F59E0B', '#EC4899', '#A78BFA'],
                borderColor: '#1a1025',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 12 } } }
        }
    })

    // Notas
    const ratingRanges = { '0-3': 0, '4-6': 0, '7-8': 0, '9-10': 0 }
    props.progressos.forEach(p => {
        if (p.nota) {
            const n = Number(p.nota)
            if (n <= 3) ratingRanges['0-3']++
            else if (n <= 6) ratingRanges['4-6']++
            else if (n <= 8) ratingRanges['7-8']++
            else ratingRanges['9-10']++
        }
    })
    
    charts.rating = new Chart(ratingChart.value, {
        type: 'bar',
        data: {
            labels: Object.keys(ratingRanges),
            datasets: [{
                label: 'Séries',
                data: Object.values(ratingRanges),
                backgroundColor: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#9ca3af', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#9ca3af' }, grid: { display: false } }
            }
        }
    })
}

watch(() => props.progressos, () => createCharts(), { deep: true })
onMounted(() => createCharts())
</script>

<style scoped>
.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 24px;
}
.chart-card { padding: 20px; }
.chart-card h3 { color: var(--text-primary); margin-bottom: 12px; font-size: 15px; }
.chart-card canvas { max-height: 200px; max-width: 100%; }
@media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }
</style>
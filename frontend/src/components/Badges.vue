<template>
    <div class="badges-container">
        <div class="badges-header">
            <h2>🏆 Conquistas</h2>
            <span class="badges-count">{{ earnedBadges.length }}/{{ allBadges.length }}</span>
        </div>
        <div class="badges-grid">
            <div v-for="badge in allBadges" :key="badge.id" class="badge-item" :class="{ earned: isEarned(badge.id) }">
                <span class="badge-icon">{{ badge.icon }}</span>
                <div class="badge-info">
                    <strong>{{ badge.name }}</strong>
                    <span>{{ badge.description }}</span>
                    <span v-if="isEarned(badge.id)" class="earned-label">✅ Desbloqueado</span>
                    <span v-else class="locked-label">🔒 {{ badge.requirement }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ progressos: { type: Array, required: true }, series: { type: Array, default: () => [] } })

const allBadges = [
    { id: 'first', icon: '🌟', name: 'Primeira Série', description: 'Adicionou sua primeira série', requirement: 'Adicionar 1 série' },
    { id: 'collector', icon: '📚', name: 'Colecionador', description: 'Tem 5+ séries', requirement: 'Ter 5 séries' },
    { id: 'critic', icon: '⭐', name: 'Crítico', description: 'Avaliou 5+ séries', requirement: '5+ avaliações' },
    { id: 'completionist', icon: '🎯', name: 'Completo', description: 'Concluiu 3+ séries', requirement: '3 séries concluídas' }
]

const earnedBadges = computed(() => {
    const earned = []
    const completed = props.progressos.filter(p => p.status === 'concluido').length
    const rated = props.progressos.filter(p => p.nota > 0).length
    
    if (props.series.length >= 1) earned.push('first')
    if (props.series.length >= 5) earned.push('collector')
    if (rated >= 5) earned.push('critic')
    if (completed >= 3) earned.push('completionist')
    return earned
})

const isEarned = (id) => earnedBadges.value.includes(id)
</script>

<style scoped>
.badges-container { margin-top: 24px; }
.badges-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.badges-header h2 { color: var(--text-primary); font-size: 18px; }
.badges-count { background: var(--gradient-primary); padding: 4px 16px; border-radius: 50px; color: white; font-weight: 600; font-size: 13px; }
.badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.badge-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-secondary); border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); transition: var(--transition); opacity: 0.5; filter: grayscale(0.8); }
.badge-item.earned { opacity: 1; filter: none; border-color: var(--primary); }
.badge-item:hover { transform: translateX(4px); }
.badge-icon { font-size: 24px; }
.badge-info { display: flex; flex-direction: column; }
.badge-info strong { color: var(--text-primary); font-size: 13px; }
.badge-info span { color: var(--text-secondary); font-size: 11px; }
.earned-label { color: #F59E0B; font-weight: 600; font-size: 10px; margin-top: 2px; }
.locked-label { color: var(--text-tertiary); font-size: 10px; margin-top: 2px; }
@media (max-width: 768px) { .badges-grid { grid-template-columns: 1fr; } }
</style>
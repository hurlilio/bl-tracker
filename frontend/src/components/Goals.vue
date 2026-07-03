<template>
    <div class="goals-container card">
        <h2>?? Metas Semanais</h2>
        <div class="goals-grid">
            <div v-for="goal in goals" :key="goal.id" class="goal-item">
                <div class="goal-header">
                    <span class="goal-icon">{{ goal.icon }}</span>
                    <span class="goal-name">{{ goal.name }}</span>
                    <span class="goal-progress">{{ goal.current }}/{{ goal.target }}</span>
                </div>
                <div class="goal-bar">
                    <div class="goal-fill" :style="{ width: (goal.current / goal.target * 100) + '%' }" :class="getGoalClass(goal)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ progressos: { type: Array, required: true } })

const goals = computed(() => {
    const totalEpisodes = props.progressos.reduce((sum, p) => sum + (p.episodio_atual || 0), 0)
    const completed = props.progressos.filter(p => p.status === 'concluido').length
    const watching = props.progressos.filter(p => p.status === 'assistindo').length

    return [
        { id: 1, icon: '??', name: 'Epis?dios na semana', current: Math.min(totalEpisodes % 30, 10), target: 10 },
        { id: 2, icon: '?', name: 'S?ries conclu?das', current: completed % 3, target: 3 },
        { id: 3, icon: '??', name: 'S?ries em andamento', current: Math.min(watching, 5), target: 5 }
    ]
})

const getGoalClass = (goal) => {
    const pct = goal.current / goal.target * 100
    if (pct >= 80) return 'goal-high'
    if (pct >= 40) return 'goal-mid'
    return 'goal-low'
}
</script>

<style scoped>
.goals-container { padding: 20px; margin-top: 24px; }
.goals-container h2 { color: var(--white); margin-bottom: 16px; font-size: 20px; }
.goals-grid { display: flex; flex-direction: column; gap: 12px; }
.goal-item { background: var(--dark-secondary); padding: 12px 16px; border-radius: var(--border-radius-sm); }
.goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.goal-icon { font-size: 20px; }
.goal-name { color: var(--white); flex: 1; margin-left: 10px; font-size: 14px; }
.goal-progress { color: var(--gray); font-size: 14px; font-weight: 600; }
.goal-bar { height: 6px; background: var(--dark-border); border-radius: 10px; overflow: hidden; }
.goal-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
.goal-fill.goal-high { background: var(--gradient); }
.goal-fill.goal-mid { background: #F39C12; }
.goal-fill.goal-low { background: var(--primary); }
</style>

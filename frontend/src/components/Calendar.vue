<template>
    <div class="calendar-container card">
        <div class="calendar-header">
            <button @click="prevMonth" class="btn btn-secondary btn-sm">?</button>
            <h3>{{ currentMonth }} {{ currentYear }}</h3>
            <button @click="nextMonth" class="btn btn-secondary btn-sm">?</button>
        </div>
        <div class="calendar-grid">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-weekday">{{ day }}</div>
            <div v-for="day in calendarDays" :key="day.date" class="calendar-day" :class="{ active: day.hasActivity }">
                <span>{{ day.day }}</span>
                <span v-if="day.hasActivity" class="dot"></span>
            </div>
        </div>
        <div class="calendar-stats">
            <span>?? {{ totalDays }} dias com atividade</span>
            <span>?? {{ totalEpisodes }} epis?dios no m?s</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ progressos: { type: Array, required: true } })

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S?b']

const calendarDays = computed(() => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    
    // Dias que tiveram atividade (simulado)
    const activeDays = new Set()
    props.progressos.forEach(p => {
        if (p.updated_at) {
            const d = new Date(p.updated_at)
            if (d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value) {
                activeDays.add(d.getDate())
            }
        }
    })

    for (let i = 0; i < firstDay; i++) {
        days.push({ day: '', date: null, hasActivity: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
        days.push({ day: d, date: new Date(currentYear.value, currentMonth.value, d), hasActivity: activeDays.has(d) })
    }
    return days
})

const totalDays = computed(() => calendarDays.value.filter(d => d.hasActivity).length)
const totalEpisodes = computed(() => {
    return props.progressos.reduce((sum, p) => {
        if (p.updated_at) {
            const d = new Date(p.updated_at)
            if (d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value) {
                return sum + (p.episodio_atual || 0)
            }
        }
        return sum
    }, 0)
})

const prevMonth = () => {
    if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
    else { currentMonth.value-- }
}
const nextMonth = () => {
    if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
    else { currentMonth.value++ }
}
</script>

<style scoped>
.calendar-container { padding: 20px; margin-top: 24px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.calendar-header h3 { color: var(--white); }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.calendar-weekday { text-align: center; color: var(--gray); font-size: 12px; padding: 8px 0; font-weight: 600; }
.calendar-day { text-align: center; padding: 8px 4px; border-radius: 8px; color: var(--gray); position: relative; font-size: 14px; }
.calendar-day.active { background: rgba(231, 76, 60, 0.2); color: var(--white); }
.calendar-day .dot { display: inline-block; width: 6px; height: 6px; background: var(--primary); border-radius: 50%; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); }
.calendar-stats { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--dark-border); color: var(--gray); font-size: 14px; }
</style>

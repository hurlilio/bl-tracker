<template>
    <div class="notifications-container">
        <div class="notif-header" @click="showDropdown = !showDropdown">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
        </div>
        <div v-if="showDropdown" class="notif-dropdown card">
            <div class="notif-list">
                <div v-if="notifications.length === 0" class="empty-state">
                    <p>?? Nenhuma notifica??o</p>
                </div>
                <div v-for="notif in notifications" :key="notif.id" class="notif-item" :class="{ unread: !notif.read }">
                    <span class="notif-icon">{{ notif.icon }}</span>
                    <div class="notif-content">
                        <p>{{ notif.message }}</p>
                        <span class="notif-time">{{ formatTime(notif.time) }}</span>
                    </div>
                    <button v-if="!notif.read" class="btn btn-sm btn-secondary" @click="markRead(notif.id)">?</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ progressos: { type: Array, required: true } })

const showDropdown = ref(false)
const notifications = ref([])

// Gerar notifica??es baseadas no progresso
const generateNotifications = () => {
    const newNotifs = []
    const now = Date.now()
    
    props.progressos.forEach(p => {
        // S?rie conclu?da
        if (p.status === 'concluido') {
            newNotifs.push({
                id: 'completed_' + p.serie_id,
                icon: '?',
                message: `"${p.titulo}" foi conclu?da! ??`,
                time: now,
                read: false
            })
        }
        // S?rie com 5+ epis?dios
        if (p.episodio_atual >= 5 && p.status === 'assistindo') {
            newNotifs.push({
                id: 'progress_' + p.serie_id,
                icon: '??',
                message: `"${p.titulo}" - ${p.episodio_atual} epis?dios assistidos!`,
                time: now,
                read: false
            })
        }
    })
    
    // Limitar a 10 notifica??es
    notifications.value = newNotifs.slice(0, 10)
    localStorage.setItem('bl_notifications', JSON.stringify(notifications.value))
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const markRead = (id) => {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
    localStorage.setItem('bl_notifications', JSON.stringify(notifications.value))
}

const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'agora'
    if (diff < 3600000) return Math.floor(diff / 60000) + 'min'
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h'
    return new Date(timestamp).toLocaleDateString('pt-BR')
}

onMounted(() => {
    const saved = localStorage.getItem('bl_notifications')
    if (saved) notifications.value = JSON.parse(saved)
    else generateNotifications()
})
</script>

<style scoped>
.notifications-container { position: relative; display: inline-block; }
.notif-header { cursor: pointer; padding: 8px 12px; border-radius: var(--border-radius-sm); transition: var(--transition); position: relative; }
.notif-header:hover { background: rgba(231, 76, 60, 0.1); }
.notif-header i { font-size: 20px; color: var(--gray); }
.notif-badge { position: absolute; top: 0; right: 0; background: var(--primary); color: white; font-size: 10px; padding: 2px 6px; border-radius: 50%; font-weight: 700; }
.notif-dropdown { position: absolute; top: 100%; right: 0; width: 320px; max-height: 400px; overflow-y: auto; margin-top: 8px; padding: 0; z-index: 1000; }
.notif-list { padding: 8px 0; }
.notif-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--dark-border); transition: var(--transition); }
.notif-item:hover { background: var(--dark-secondary); }
.notif-item.unread { background: rgba(231, 76, 60, 0.05); }
.notif-icon { font-size: 20px; }
.notif-content { flex: 1; }
.notif-content p { color: var(--white); font-size: 14px; margin: 0; }
.notif-time { color: var(--gray); font-size: 11px; }
.empty-state { text-align: center; padding: 20px; color: var(--gray); }
</style>

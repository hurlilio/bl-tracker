<template>
    <div id="app">
        <Navbar v-if="authStore.isAuthenticated" />
        <div class="app-container">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './store/authStore'

const authStore = useAuthStore()
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Cores Principais - Azul e Laranja */
    --primary: #3B82F6;
    --primary-dark: #2563EB;
    --primary-light: #60A5FA;
    --primary-glow: rgba(59, 130, 246, 0.25);
    --primary-subtle: rgba(59, 130, 246, 0.08);
    
    --secondary: #F97316;
    --secondary-dark: #EA580C;
    --secondary-light: #FB923C;
    
    --accent: #8B5CF6;
    --accent-glow: rgba(139, 92, 246, 0.12);
    
    /* Gradientes */
    --gradient-primary: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    --gradient-secondary: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
    --gradient-accent: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
    --gradient-bg: linear-gradient(160deg, #0a0c10 0%, #12161a 30%, #0e1116 60%, #0a0c10 100%);
    
    /* Status */
    --status-watching: rgba(59, 130, 246, 0.12);
    --status-watching-border: rgba(59, 130, 246, 0.2);
    --status-completed: rgba(34, 197, 94, 0.12);
    --status-completed-border: rgba(34, 197, 94, 0.2);
    --status-paused: rgba(249, 115, 22, 0.12);
    --status-paused-border: rgba(249, 115, 22, 0.2);
    --status-dropped: rgba(239, 68, 68, 0.12);
    --status-dropped-border: rgba(239, 68, 68, 0.2);
    --status-want: rgba(139, 92, 246, 0.12);
    --status-want-border: rgba(139, 92, 246, 0.2);
    
    /* Superfícies */
    --bg-primary: #0a0c10;
    --bg-secondary: #12161a;
    --bg-card: rgba(18, 22, 26, 0.92);
    --bg-card-hover: rgba(28, 32, 38, 0.92);
    --border-color: rgba(59, 130, 246, 0.06);
    --border-color-hover: rgba(59, 130, 246, 0.12);
    
    /* Textos */
    --text-primary: #f1f5f9;
    --text-secondary: rgba(241, 245, 249, 0.7);
    --text-tertiary: rgba(241, 245, 249, 0.4);
    --text-muted: #94a3b8;
    
    /* Sombras */
    --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
    --shadow-hover: 0 12px 48px rgba(59, 130, 246, 0.08);
    
    /* Bordas */
    --border-radius: 16px;
    --border-radius-sm: 10px;
    --border-radius-full: 50px;
    
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
    background: var(--gradient-bg);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
}

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-container {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    width: 100%;
    margin-top: 76px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

@media (max-width: 768px) {
    .app-container {
        padding: 16px;
        margin-top: 64px;
    }
}
</style>
<template>
    <nav class="navbar">
        <div class="navbar-container">
            <router-link to="/" class="navbar-brand">
                <span class="brand-icon">✦</span>
                <span class="brand-text">BL Tracker</span>
            </router-link>
            
            <button class="navbar-toggle" @click="isOpen = !isOpen">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <div class="navbar-links" :class="{ active: isOpen }">
                <router-link to="/" class="nav-link" @click="isOpen = false">
                    <i class="fas fa-home"></i>
                    <span>Início</span>
                </router-link>
                <router-link to="/series" class="nav-link" @click="isOpen = false">
                    <i class="fas fa-film"></i>
                    <span>Séries</span>
                </router-link>
                <router-link to="/add-series" class="nav-link" @click="isOpen = false">
                    <i class="fas fa-plus-circle"></i>
                    <span>Adicionar</span>
                </router-link>
                <router-link to="/groups" class="nav-link" @click="isOpen = false">
                    <i class="fas fa-users"></i>
                    <span>Grupos</span>
                </router-link>
                <router-link to="/profile" class="nav-link" @click="isOpen = false">
                    <i class="fas fa-user"></i>
                    <span>Perfil</span>
                </router-link>
                <button class="nav-link logout-btn" @click="handleLogout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sair</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const isOpen = ref(false)

const handleLogout = () => {
    authStore.logout()
    toast.success('Até logo! ✦')
    router.push('/login')
}
</script>

<style scoped>
.navbar {
    background: rgba(15, 10, 26, 0.92);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(124, 58, 237, 0.08);
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
}

.navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -0.5px;
}

.brand-icon {
    font-size: 20px;
}

.brand-text {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.navbar-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
}

.navbar-toggle span {
    display: block;
    width: 26px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: var(--transition);
}

.navbar-links {
    display: flex;
    align-items: center;
    gap: 2px;
}

.nav-link {
    padding: 10px 20px;
    border-radius: var(--border-radius-sm);
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
}

.nav-link i {
    font-size: 15px;
    transition: var(--transition);
}

.nav-link:hover {
    background: rgba(124, 58, 237, 0.08);
    color: var(--primary);
}

.nav-link.router-link-exact-active {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 20px var(--primary-glow);
}

.logout-btn {
    color: #EF4444;
}

.logout-btn:hover {
    background: rgba(239, 68, 68, 0.08);
    color: #EF4444;
}

@media (max-width: 768px) {
    .navbar-toggle {
        display: flex;
    }
    
    .navbar-links {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: rgba(15, 10, 26, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        border-top: 1px solid rgba(124, 58, 237, 0.08);
    }
    
    .navbar-links.active {
        display: flex;
    }
    
    .nav-link {
        padding: 12px 20px;
        width: 100%;
        justify-content: center;
    }
}
</style>
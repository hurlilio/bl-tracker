<template>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-logo">
                    <span class="logo-icon">✦</span>
                    <h1>BL Tracker</h1>
                </div>
                <p class="auth-subtitle">Organize suas séries com elegância</p>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
                <div class="form-group">
                    <label>E-mail</label>
                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input 
                            type="email" 
                            v-model="email" 
                            placeholder="seu@email.com"
                            required
                            autofocus
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label>Senha</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input 
                            type="password" 
                            v-model="senha" 
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                </div>

                <div v-if="error" class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    {{ error }}
                </div>

                <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                    <span v-if="loading" class="loading-spinner-small"></span>
                    {{ loading ? 'Entrando...' : 'Entrar' }}
                </button>
            </form>

            <p class="auth-link">
                Não tem uma conta? <router-link to="/register">Cadastre-se</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const senha = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
    loading.value = true
    error.value = ''

    const result = await authStore.login(email.value, senha.value)

    if (result.success) {
        toast.success('Bem-vindo! ✨')
        router.push('/')
    } else {
        error.value = result.error || 'Erro ao fazer login'
        toast.error(error.value)
    }

    loading.value = false
}
</script>

<style scoped>
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-bg);
    padding: 20px;
}

.auth-card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    padding: 40px 48px;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-card);
    width: 100%;
    max-width: 400px;
}

.auth-header {
    text-align: center;
    margin-bottom: 32px;
}

.auth-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 6px;
}

.logo-icon {
    font-size: 28px;
}

.auth-logo h1 {
    font-size: 26px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.auth-subtitle {
    color: var(--text-secondary);
    font-size: 14px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.input-group {
    position: relative;
}

.input-group i {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: 14px;
}

.input-group input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-full);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
}

.input-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-subtle);
}

.input-group input::placeholder {
    color: var(--text-tertiary);
}

.btn-block {
    width: 100%;
    justify-content: center;
    padding: 12px;
    font-size: 15px;
    margin-top: 4px;
}

.auth-link {
    text-align: center;
    margin-top: 20px;
    color: var(--text-secondary);
    font-size: 14px;
}

.auth-link a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
}

.auth-link a:hover {
    text-decoration: underline;
}

.alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: var(--border-radius-sm);
    margin-bottom: 14px;
    font-size: 14px;
}

.alert-danger {
    background: rgba(239, 68, 68, 0.08);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.15);
}

.loading-spinner-small {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
    .auth-card {
        padding: 28px 24px;
    }

    .auth-logo h1 {
        font-size: 22px;
    }
}
</style>
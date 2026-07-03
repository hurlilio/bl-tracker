import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { requiresGuest: true, title: 'Login' }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: { requiresGuest: true, title: 'Cadastro' }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true, title: 'Dashboard' }
    },
    {
        path: '/series',
        name: 'Series',
        component: () => import('../views/Series.vue'),
        meta: { requiresAuth: true, title: 'Séries' }
    },
    {
        path: '/series/:id',
        name: 'SerieDetail',
        component: () => import('../views/SerieDetail.vue'),
        meta: { requiresAuth: true, title: 'Detalhes' }
    },
    {
        path: '/add-series',
        name: 'AddSeries',
        component: () => import('../components/AddSeries.vue'),
        meta: { requiresAuth: true, title: 'Adicionar Séries' }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true, title: 'Perfil' }
    },
    {
        path: '/groups',
        name: 'Groups',
        component: () => import('../views/Groups.vue'),
        meta: { requiresAuth: true, title: 'Grupos' }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    if (to.meta.title) {
        document.title = to.meta.title + ' | BL Tracker'
    } else {
        document.title = 'BL Tracker'
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router
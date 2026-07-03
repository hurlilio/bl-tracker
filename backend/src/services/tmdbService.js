const axios = require('axios');

// API Key pública do TMDB (válida para leitura)
const TMDB_API_KEY = '82a09d2b05d192688d297e8bd7e354a4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
    constructor() {
        this.apiKey = TMDB_API_KEY;
        this.baseUrl = TMDB_BASE_URL;
        this.imageUrl = TMDB_IMAGE_URL;
    }

    async searchSeries(query, page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/search/tv`, {
                params: {
                    api_key: this.apiKey,
                    query: query,
                    page: page,
                    language: 'pt-BR'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar series:', error.message);
            throw error;
        }
    }

    async getPopularSeries(page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/tv/popular`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'pt-BR'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar populares:', error.message);
            throw error;
        }
    }

    async getTrendingSeries(page = 1) {
        try {
            const response = await axios.get(`${this.baseUrl}/trending/tv/week`, {
                params: {
                    api_key: this.apiKey,
                    page: page,
                    language: 'pt-BR'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar em alta:', error.message);
            throw error;
        }
    }

    async getSerieDetails(tmdbId) {
        try {
            const response = await axios.get(`${this.baseUrl}/tv/${tmdbId}`, {
                params: {
                    api_key: this.apiKey,
                    language: 'pt-BR',
                    append_to_response: 'credits,similar'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar detalhes:', error.message);
            throw error;
        }
    }

    async getGenres() {
        try {
            const response = await axios.get(`${this.baseUrl}/genre/tv/list`, {
                params: {
                    api_key: this.apiKey,
                    language: 'pt-BR'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar generos:', error.message);
            throw error;
        }
    }

    getImageUrl(path, size = 'w500') {
        if (!path) return null;
        return `${this.imageUrl}/${size}${path}`;
    }
}

module.exports = new TMDBService();
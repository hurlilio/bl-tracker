const tmdbService = require('../services/tmdbService');
const pool = require('../config/database');

exports.searchSeries = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Termo de busca é obrigatório' });
        }
        const result = await tmdbService.searchSeries(query, page);
        const series = result.results.map(serie => ({
            id: serie.id,
            titulo: serie.name || 'N/A',
            sinopse: serie.overview || 'Sinopse não disponível',
            pais: serie.origin_country?.[0] || 'N/A',
            ano: serie.first_air_date?.split('-')[0] || 'N/A',
            temporadas: serie.number_of_seasons || 0,
            capa: tmdbService.getImageUrl(serie.poster_path),
            nota: serie.vote_average || 0
        }));
        res.json({ page: result.page, total_pages: result.total_pages, total_results: result.total_results, results: series });
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
        res.status(500).json({ error: 'Erro ao buscar séries: ' + error.message });
    }
};

exports.getPopular = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const result = await tmdbService.getPopularSeries(page);
        const series = result.results.map(serie => ({
            id: serie.id,
            titulo: serie.name || 'N/A',
            sinopse: serie.overview || 'Sinopse não disponível',
            pais: serie.origin_country?.[0] || 'N/A',
            ano: serie.first_air_date?.split('-')[0] || 'N/A',
            temporadas: serie.number_of_seasons || 0,
            capa: tmdbService.getImageUrl(serie.poster_path),
            nota: serie.vote_average || 0
        }));
        res.json({ page: result.page, total_pages: result.total_pages, total_results: result.total_results, results: series });
    } catch (error) {
        console.error('Erro ao buscar populares:', error);
        res.status(500).json({ error: 'Erro ao buscar séries populares: ' + error.message });
    }
};

exports.getTrending = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const result = await tmdbService.getTrendingSeries(page);
        const series = result.results.map(serie => ({
            id: serie.id,
            titulo: serie.name || 'N/A',
            sinopse: serie.overview || 'Sinopse não disponível',
            pais: serie.origin_country?.[0] || 'N/A',
            ano: serie.first_air_date?.split('-')[0] || 'N/A',
            temporadas: serie.number_of_seasons || 0,
            capa: tmdbService.getImageUrl(serie.poster_path),
            nota: serie.vote_average || 0
        }));
        res.json({ page: result.page, total_pages: result.total_pages, total_results: result.total_results, results: series });
    } catch (error) {
        console.error('Erro ao buscar em alta:', error);
        res.status(500).json({ error: 'Erro ao buscar séries em alta: ' + error.message });
    }
};

exports.importSerie = async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const details = await tmdbService.getSerieDetails(tmdbId);
        
        const existing = await pool.query('SELECT id FROM series WHERE titulo = $1', [details.name]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Série já existe no catálogo' });
        }
        
        const result = await pool.query(
            `INSERT INTO series (titulo, sinopse, pais, ano, temporadas, capa, genero) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                details.name || 'N/A',
                details.overview || 'Sinopse não disponível',
                details.origin_country?.[0] || 'N/A',
                details.first_air_date?.split('-')[0] || null,
                details.number_of_seasons || 0,
                tmdbService.getImageUrl(details.poster_path),
                details.genres?.map(g => g.name).join(', ') || 'N/A'
            ]
        );
        res.status(201).json({ message: 'Série importada com sucesso', serie: result.rows[0] });
    } catch (error) {
        console.error('Erro ao importar série:', error);
        res.status(500).json({ error: 'Erro ao importar série: ' + error.message });
    }
};

exports.getSerieDetailsTMDB = async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const details = await tmdbService.getSerieDetails(tmdbId);
        res.json({ 
            ...details, 
            poster_url: tmdbService.getImageUrl(details.poster_path),
            backdrop_url: tmdbService.getImageUrl(details.backdrop_path)
        });
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes: ' + error.message });
    }
};
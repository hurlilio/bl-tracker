const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serieRoutes = require('./routes/serieRoutes');
const progressRoutes = require('./routes/progressRoutes');
const groupRoutes = require('./routes/groupRoutes');
const interpretationRoutes = require('./routes/interpretationRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/series', serieRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/interpretations', interpretationRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'BL Tracker API' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
});

module.exports = app;
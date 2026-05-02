require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const itemRoutes = require('./routes/itemRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickStock backend API is running.',
    endpoints: {
      health: '/api/health',
      items: '/api/items',
      stats: '/api/items/stats/summary'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QuickStock API is running.'
  });
});

app.use('/api/items', itemRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

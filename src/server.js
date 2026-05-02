const app = require('./app');
const { initDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`QuickStock backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

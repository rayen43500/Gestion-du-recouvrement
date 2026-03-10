require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   Recouvra+ API Server Started        ║
    ╠═══════════════════════════════════════╣
    ║ Environment: ${NODE_ENV.padEnd(24)} ║
    ║ Port: ${PORT.toString().padEnd(29)} ║
    ║ Swagger: http://localhost:${PORT}/api-docs ║
    ╚═══════════════════════════════════════╝
    `);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { isConnected } from './config/db.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isConnected() ? 'connected' : 'fallback-in-memory',
    timestamp: new Date().toISOString(),
  });
});

// Invoices API
app.use('/api/invoices', invoiceRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server if executed directly
if (process.env.NODE_ENV !== 'test' && import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`[Server] Invoice API listening on http://localhost:${PORT}`);
  });
}

import dotenv from 'dotenv';
import http from 'http';
import { AddressInfo } from 'net';
import winston from 'winston';

// Configure environment variables
dotenv.config();

// Import the Express app
import app from './app';

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'server' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// Create HTTP server
const server = http.createServer(app);

// Server configuration
const PORT = parseInt(process.env.PORT || '8082', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Health check function

// Graceful shutdown function

// Before server shutdown

// Start the server
server.listen(PORT, HOST, () => {
  const address = server.address() as AddressInfo;
  logger.info(`Server running at http://${address.address}:${address.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default server;

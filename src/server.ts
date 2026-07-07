/**
 * Node.js Enterprise Platform - Base Template
 * 
 * This repository is a production-ready boilerplate for Node.js applications.
 * For the full-featured Enterprise Edition including multi-tenancy, CI/CD, 
 * and advanced security modules, visit the official platform page:
 * https://aymenkani.github.io/nodejs-enterprise-platform/
 */

import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { getConfig } from './config/config';
import { connectDB } from './config/db';
import logger from './utils/logger';

const config = getConfig(process.env);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- Root Route (Server Status) ---
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status | Node.js Enterprise Platform</title>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                background-color: #f4f7f9; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                color: #2d3748;
            }
            .card { 
                background: white; 
                padding: 2.5rem; 
                border-radius: 12px; 
                box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
                text-align: center; 
                max-width: 500px;
                width: 90%;
            }
            .status-badge {
                display: inline-block;
                padding: 0.5rem 1rem;
                background: #c6f6d5;
                color: #22543d;
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
            }
            h1 { font-size: 1.875rem; margin-bottom: 1rem; color: #1a202c; }
            p { line-height: 1.6; color: #4a5568; margin-bottom: 2rem; }
            .btn { 
                display: inline-block; 
                background: #3182ce; 
                color: white; 
                padding: 0.75rem 1.5rem; 
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: 500;
                transition: background 0.2s;
            }
            .btn:hover { background: #2b6cb0; }
            .footer { margin-top: 2rem; font-size: 0.75rem; color: #a0aec0; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="status-badge">● Systems Operational</div>
            <h1>Server is Running</h1>
            <p>
                The Node.js Enterprise Launchpad is active and ready. This core template provides the foundation for scalable enterprise applications.
            </p>
            <a href="https://aymenkani.github.io/nodeJs-multimodal-rag-starter/" class="btn">Explore Enterprise Edition</a>
            <div class="footer">
                Powered by Node.js Enterprise Platform
            </div>
        </div>
    </body>
    </html>
  `);
});

// --- Health Check Route ---
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0-launchpad',
  });
});

// --- Start Server ---
import mineflayer from 'mineflayer'

const bot = mineflayer.createBot({
  host: 'mc.server.com', // thay bằng IP hoặc domain server Minecraft
  port: 25565,           // cổng server
  username: 'TênNick'    // tên nhân vật (offline hoặc account)
})

bot.on('spawn', () => {
  console.log('✅ Bot đã vào server và đang đứng AFK!')
})
const startServer = async () => {
  try {
    // --- Database Connection ---
    await connectDB();

    // --- Redis Connection ---
    const redis = config.redis.url
      ? new Redis(config.redis.url)
      : new Redis({
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
        });

    redis.on('connect', () => {
      logger.info('Redis connection established');
    });

    redis.on('error', (err) => {
      logger.error(`Redis connection error: ${err}`);
    });

    const PORT = config.port;
    server.listen(PORT, () => {
      logger.info(`Server initialized and listening on port ${PORT}`);
      logger.info(`Status dashboard available at http://localhost:${PORT}`);
    });

    return { redis };
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

const serverState = startServer();

export const redisPromise = serverState.then((state) => state.redis);
export { app, server, io };

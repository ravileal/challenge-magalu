import fastify from 'fastify';
import 'dotenv/config';
import jwt from '@fastify/jwt';

import { setupDependencies } from './container';
import { connectRedis, disconnectRedis } from './infrastructure/database/redis/client';
import { connection as knexConnection } from './infrastructure/database/knex';

import { clientRoutes } from './presentation/routes/client.routes';
import { favoriteRoutes } from './presentation/routes/favorite.routes';
import { authRoutes } from './presentation/routes/auth.routes';
import { RedisCacheAdapter } from './infrastructure/services/RedisCacheAdapter';
import { errorHandler } from './presentation/errors/errorHandler';

const app = fastify({ logger: true });

const start = async () => {
  try {
    await connectRedis();

    const cacheService = new RedisCacheAdapter();

    const { clientController, favoriteController, authController } = setupDependencies({
      knexConnection,
      cacheService,
    });

    app.register(jwt, { secret: process.env.JWT_SECRET! });

    app.addHook('onClose', async () => {
      app.log.info('Shutting down gracefully...');
      try {
        await disconnectRedis();
        await knexConnection.destroy();
        app.log.info('External connections closed.');
      } catch (error) {
        app.log.error('Error during shutdown:', error);
      }
    });

    app.setErrorHandler(errorHandler);

    app.register(authRoutes, { authController });
    app.register(clientRoutes, { clientController });
    app.register(favoriteRoutes, { favoriteController });

    const port = Number(process.env.PORT) || 3333;
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    await disconnectRedis().catch(console.error);
    await knexConnection.destroy().catch(console.error);
    process.exit(1);
  }
};

const safeShutdown = (signal: string) => async () => {
  try {
    console.log(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    await disconnectRedis();
    await knexConnection.destroy();
    console.log('Shutdown complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', safeShutdown('SIGINT'));
process.on('SIGTERM', safeShutdown('SIGTERM'));

start();

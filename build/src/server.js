"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
require("dotenv/config");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_graceful_shutdown_1 = __importDefault(require("fastify-graceful-shutdown"));
const container_1 = require("./container");
const client_1 = require("./infrastructure/database/redis/client");
const knex_1 = require("./infrastructure/database/knex");
const client_routes_1 = require("./presentation/routes/client.routes");
const favorite_routes_1 = require("./presentation/routes/favorite.routes");
const auth_routes_1 = require("./presentation/routes/auth.routes");
const app = (0, fastify_1.default)({ logger: true });
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, client_1.connectRedis)();
        app.register(jwt_1.default, { secret: process.env.JWT_SECRET });
        app.register(fastify_graceful_shutdown_1.default);
        app.register(auth_routes_1.authRoutes, { authController: container_1.authController });
        app.register(client_routes_1.clientRoutes, { clientController: container_1.clientController });
        app.register(favorite_routes_1.favoriteRoutes, { favoriteController: container_1.favoriteController });
        app.after(() => {
            app.gracefulShutdown((signal) => __awaiter(void 0, void 0, void 0, function* () {
                app.log.info(`Received ${signal}, shutting down gracefully...`);
                try {
                    yield (0, client_1.disconnectRedis)();
                    yield knex_1.connection.destroy();
                    app.log.info('External connections closed.');
                }
                catch (error) {
                    app.log.error('Error during shutdown:', error);
                }
            }));
        });
        const port = Number(process.env.PORT) || 3333;
        const host = process.env.HOST || '0.0.0.0';
        yield app.listen({ port, host });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
start();

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRoutes = favoriteRoutes;
const PostgresClientRepository_1 = require("../../infrastructure/database/repositories/PostgresClientRepository");
const PostgresFavoriteRepository_1 = require("../../infrastructure/database/repositories/PostgresFavoriteRepository");
const FakeStoreApiAdapter_1 = require("../../infrastructure/services/FakeStoreApiAdapter");
const RedisCacheAdapter_1 = require("../../infrastructure/services/RedisCacheAdapter");
const AddFavoriteUseCase_1 = require("../../application/use-cases/AddFavoriteUseCase");
const ListFavoritesUseCase_1 = require("../../application/use-cases/ListFavoritesUseCase");
const authHook_1 = require("../hooks/authHook");
function favoriteRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientRepository = new PostgresClientRepository_1.PostgresClientRepository();
        const favoriteRepository = new PostgresFavoriteRepository_1.PostgresFavoriteRepository();
        const productApiAdapter = new FakeStoreApiAdapter_1.FakeStoreApiAdapter();
        const cacheService = new RedisCacheAdapter_1.RedisCacheAdapter();
        app.addHook('onRequest', authHook_1.authHook);
        app.post('/favorites', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { clientId } = request.user;
            const { productId } = request.body;
            const addFavoriteUseCase = new AddFavoriteUseCase_1.AddFavoriteUseCase(clientRepository, productApiAdapter, favoriteRepository, cacheService);
            try {
                yield addFavoriteUseCase.execute(clientId, productId);
                return reply.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    return reply.status(500).send({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return reply.status(500);
            }
        }));
        app.get('/favorites', (request) => __awaiter(this, void 0, void 0, function* () {
            const { clientId } = request.user;
            const listFavoritesUseCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(favoriteRepository, productApiAdapter, cacheService);
            const favorites = yield listFavoritesUseCase.execute(clientId);
            return favorites;
        }));
    });
}

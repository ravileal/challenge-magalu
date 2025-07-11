"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.favoriteController = exports.clientController = void 0;
const PostgresClientRepository_1 = require("./infrastructure/database/repositories/PostgresClientRepository");
const PostgresFavoriteRepository_1 = require("./infrastructure/database/repositories/PostgresFavoriteRepository");
const FakeStoreApiAdapter_1 = require("./infrastructure/services/FakeStoreApiAdapter");
const RedisCacheAdapter_1 = require("./infrastructure/services/RedisCacheAdapter");
const CreateClientUseCase_1 = require("./application/use-cases/CreateClientUseCase");
const GetClientUseCase_1 = require("./application/use-cases/GetClientUseCase");
const UpdateClientUseCase_1 = require("./application/use-cases/UpdateClientUseCase");
const DeleteClientUseCase_1 = require("./application/use-cases/DeleteClientUseCase");
const AddFavoriteUseCase_1 = require("./application/use-cases/AddFavoriteUseCase");
const ListFavoritesUseCase_1 = require("./application/use-cases/ListFavoritesUseCase");
const ClientController_1 = require("./presentation/controllers/ClientController");
const FavoriteController_1 = require("./presentation/controllers/FavoriteController");
const AuthController_1 = require("./presentation/controllers/AuthController");
const clientRepository = new PostgresClientRepository_1.PostgresClientRepository();
const favoriteRepository = new PostgresFavoriteRepository_1.PostgresFavoriteRepository();
const productApiAdapter = new FakeStoreApiAdapter_1.FakeStoreApiAdapter();
const cacheService = new RedisCacheAdapter_1.RedisCacheAdapter();
const createClientUseCase = new CreateClientUseCase_1.CreateClientUseCase(clientRepository);
const getClientUseCase = new GetClientUseCase_1.GetClientUseCase(clientRepository);
const updateClientUseCase = new UpdateClientUseCase_1.UpdateClientUseCase(clientRepository);
const deleteClientUseCase = new DeleteClientUseCase_1.DeleteClientUseCase(clientRepository);
const addFavoriteUseCase = new AddFavoriteUseCase_1.AddFavoriteUseCase(clientRepository, productApiAdapter, favoriteRepository, cacheService);
const listFavoritesUseCase = new ListFavoritesUseCase_1.ListFavoritesUseCase(favoriteRepository, productApiAdapter, cacheService);
exports.clientController = new ClientController_1.ClientController(createClientUseCase, getClientUseCase, updateClientUseCase, deleteClientUseCase);
exports.favoriteController = new FavoriteController_1.FavoriteController(addFavoriteUseCase, listFavoritesUseCase);
exports.authController = new AuthController_1.AuthController(clientRepository);

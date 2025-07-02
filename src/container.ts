import { Knex } from 'knex';

import { PostgresClientRepository } from './infrastructure/database/repositories/PostgresClientRepository';
import { PostgresFavoriteRepository } from './infrastructure/database/repositories/PostgresFavoriteRepository';
import { FakeStoreApiAdapter } from './infrastructure/services/FakeStoreApiAdapter';

import { CreateClientUseCase } from './application/use-cases/CreateClientUseCase';
import { GetClientUseCase } from './application/use-cases/GetClientUseCase';
import { UpdateClientUseCase } from './application/use-cases/UpdateClientUseCase';
import { DeleteClientUseCase } from './application/use-cases/DeleteClientUseCase';
import { AddFavoriteUseCase } from './application/use-cases/AddFavoriteUseCase';
import { ListFavoritesUseCase } from './application/use-cases/ListFavoritesUseCase';

import { ClientController } from './presentation/controllers/ClientController';
import { FavoriteController } from './presentation/controllers/FavoriteController';
import { AuthController } from './presentation/controllers/AuthController';
import { ICacheService } from './application/services/ICacheService';

interface AppDependencies {
  knexConnection: Knex;
  cacheService: ICacheService;
}

export function setupDependencies(dependencies: AppDependencies) {
  const { knexConnection, cacheService } = dependencies;

  const clientRepository = new PostgresClientRepository(knexConnection);
  const favoriteRepository = new PostgresFavoriteRepository(knexConnection);
  const productApiAdapter = new FakeStoreApiAdapter();

  const createClientUseCase = new CreateClientUseCase(clientRepository);
  const getClientUseCase = new GetClientUseCase(clientRepository);
  const updateClientUseCase = new UpdateClientUseCase(clientRepository);
  const deleteClientUseCase = new DeleteClientUseCase(clientRepository);

  const addFavoriteUseCase = new AddFavoriteUseCase(
    clientRepository,
    productApiAdapter,
    favoriteRepository,
    cacheService,
  );
  const listFavoritesUseCase = new ListFavoritesUseCase(favoriteRepository, productApiAdapter, cacheService);

  const clientController = new ClientController(
    createClientUseCase,
    getClientUseCase,
    updateClientUseCase,
    deleteClientUseCase,
  );
  const favoriteController = new FavoriteController(addFavoriteUseCase, listFavoritesUseCase);
  const authController = new AuthController(clientRepository);

  return { clientController, favoriteController, authController };
}

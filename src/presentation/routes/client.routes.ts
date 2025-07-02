import { FastifyInstance } from 'fastify';
import { ClientController } from '../controllers/ClientController';
import { authHook } from '../hooks/authHook';

interface IClientRoutesOptions {
  clientController: ClientController;
}

export async function clientRoutes(app: FastifyInstance, options: IClientRoutesOptions) {
  const { clientController } = options;

  app.post('/clients', clientController.create.bind(clientController));
  app.get('/clients/:id', { onRequest: [authHook] }, clientController.findById.bind(clientController));
  app.put('/clients/:id', { onRequest: [authHook] }, clientController.update.bind(clientController));
  app.delete('/clients/:id', { onRequest: [authHook] }, clientController.delete.bind(clientController));
}

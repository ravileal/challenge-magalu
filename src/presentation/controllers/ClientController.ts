import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateClientUseCase } from '../../application/use-cases/CreateClientUseCase';
import { GetClientUseCase } from '../../application/use-cases/GetClientUseCase';
import { UpdateClientUseCase } from '../../application/use-cases/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../application/use-cases/DeleteClientUseCase';
import { createClientSchema, clientParamsSchema, updateClientSchema } from '../schemas';

export class ClientController {
  constructor(
    private createClientUseCase: CreateClientUseCase,
    private getClientUseCase: GetClientUseCase,
    private updateClientUseCase: UpdateClientUseCase,
    private deleteClientUseCase: DeleteClientUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = createClientSchema.parse(request.body);
    const client = await this.createClientUseCase.execute({ name, email });
    return reply.status(201).send(client);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = clientParamsSchema.parse(request.params);
    const data = updateClientSchema.parse(request.body);
    const updatedClient = await this.updateClientUseCase.execute(id, data);
    return reply.send(updatedClient);
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = clientParamsSchema.parse(request.params);
    const client = await this.getClientUseCase.execute(id);
    return reply.send(client);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = clientParamsSchema.parse(request.params);
    await this.deleteClientUseCase.execute(id);
    return reply.status(204).send();
  }
}

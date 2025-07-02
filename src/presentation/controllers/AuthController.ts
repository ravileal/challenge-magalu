import { FastifyRequest, FastifyReply } from 'fastify';
import { IClientRepository } from '../../application/repositories/IClientRepository';
import { loginSchema } from '../schemas';

export class AuthController {
  constructor(private clientRepository: IClientRepository) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const app = reply.server;
    const { email } = loginSchema.parse(request.body);

    const client = await this.clientRepository.findByEmail(email);

    if (!client) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = app.jwt.sign({ clientId: client.id });
    return reply.send({ token });
  }
}

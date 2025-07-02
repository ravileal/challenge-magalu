import { ZodError, ZodIssueCode } from 'zod';
import { Client } from '../../domain/client.entity';
import { IClientRepository } from '../repositories/IClientRepository';

interface CreateClientRequest {
  name: string;
  email: string;
}

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute({ name, email }: CreateClientRequest): Promise<Client> {
    const clientAlreadyExists = await this.clientRepository.findByEmail(email);

    if (clientAlreadyExists)
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['email'],
          message: 'Client with this email already exists.',
        },
      ]);

    const client = await this.clientRepository.create({ name, email });
    return client;
  }
}

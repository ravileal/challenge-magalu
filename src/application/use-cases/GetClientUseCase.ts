import { ZodError, ZodIssueCode } from 'zod';
import { Client } from '../../domain/client.entity';
import { IClientRepository } from '../repositories/IClientRepository';

export class GetClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client)
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['clientId'],
          message: 'Client not found.',
        },
      ]);

    return client;
  }
}

import { ZodError, ZodIssueCode } from 'zod';
import { Client } from '../../domain/client.entity';
import { IClientRepository } from '../repositories/IClientRepository';

interface UpdateClientRequest {
  name?: string;
  email?: string;
}

export class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string, data: UpdateClientRequest): Promise<Client> {
    const clientExists = await this.clientRepository.findById(id);
    if (!clientExists) {
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['clientId'],
          message: 'Client not found.',
        },
      ]);
    }

    if (data.email && data.email !== clientExists.email) {
      const emailInUse = await this.clientRepository.findByEmail(data.email);
      if (emailInUse)
        throw new ZodError([
          {
            code: ZodIssueCode.custom,
            path: ['email'],
            message: 'Email already in use by another client.',
          },
        ]);
    }

    const updatedClient = await this.clientRepository.update(id, data);
    return updatedClient!;
  }
}

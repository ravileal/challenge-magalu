import { ZodError, ZodIssueCode } from 'zod';
import { IClientRepository } from '../repositories/IClientRepository';

export class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<void> {
    const clientExists = await this.clientRepository.findById(id);
    if (!clientExists)
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: ['clientId'],
          message: 'Client not found.',
        },
      ]);

    await this.clientRepository.delete(id);
  }
}

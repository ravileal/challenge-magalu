import { Knex } from 'knex';
import { IClientRepository, UpdateClientData } from '../../../application/repositories/IClientRepository';
import { Client } from '../../../domain/client.entity';

export class PostgresClientRepository implements IClientRepository {
  constructor(private connection: Knex) {}

  async create(data: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const [client] = await this.connection<Client>('clients').insert(data).returning('*');
    return client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.connection<Client>('clients').where({ email }).first();
    return client || null;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.connection<Client>('clients').where({ id }).first();
    return client || null;
  }

  async update(id: string, data: UpdateClientData): Promise<Client | null> {
    const [updatedClient] = await this.connection<Client>('clients').where({ id }).update(data).returning('*');

    return updatedClient || null;
  }

  async delete(id: string): Promise<void> {
    await this.connection<Client>('clients').where({ id }).del();
  }
}

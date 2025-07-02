import { Client } from '../../domain/client.entity';

export type UpdateClientData = Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;

export interface IClientRepository {
  create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findById(id: string): Promise<Client | null>;
  update(id: string, client: UpdateClientData): Promise<Client | null>;
  delete(id: string): Promise<void>;
}

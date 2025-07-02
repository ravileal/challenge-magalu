import { Client } from '../../src/domain/client.entity';

type Override = Partial<Client>;

export function makeFakeClient(override: Override = {}): Client {
  return {
    id: 'any_client_id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: new Date(),
    updated_at: new Date(),
    ...override,
  };
}

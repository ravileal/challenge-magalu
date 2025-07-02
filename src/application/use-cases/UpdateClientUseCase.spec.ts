import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { IClientRepository } from '../repositories/IClientRepository';
import { UpdateClientUseCase } from './UpdateClientUseCase';

const mockClientRepository: IClientRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Update Client Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to update a client', async () => {
    const useCase = new UpdateClientUseCase(mockClientRepository);

    const fakeClient = makeFakeClient();

    const updatedData = { name: 'John Doe Updated' };

    jest.mocked(mockClientRepository.findById).mockResolvedValue(fakeClient);
    jest.mocked(mockClientRepository.update).mockResolvedValue({ ...fakeClient, ...updatedData });

    const updatedClient = await useCase.execute(fakeClient.id, updatedData);

    expect(updatedClient.name).toBe(updatedData.name);
    expect(mockClientRepository.update).toHaveBeenCalledWith(fakeClient.id, updatedData);
  });

  it('should throw an error if client to update is not found', async () => {
    const useCase = new UpdateClientUseCase(mockClientRepository);
    jest.mocked(mockClientRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id', { name: 'test' })).rejects.toThrow('Client not found.');
  });

  it('should throw an error if new email is already in use by another client', async () => {
    const useCase = new UpdateClientUseCase(mockClientRepository);

    const existingClient = makeFakeClient({ id: 'uuid-123', name: 'John Doe', email: 'john@doe.com' });
    const otherClientWithEmail = makeFakeClient({ id: 'uuid-456', name: 'Jane Doe', email: 'jane@doe.com' });

    jest.mocked(mockClientRepository.findById).mockResolvedValue(existingClient);
    jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(otherClientWithEmail);

    await expect(useCase.execute(existingClient.id, { email: 'jane@doe.com' })).rejects.toThrow(
      'Email already in use by another client.',
    );
  });
});

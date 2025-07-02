import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { IClientRepository } from '../repositories/IClientRepository';
import { GetClientUseCase } from './GetClientUseCase';

const mockClientRepository: IClientRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Get Client Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get a client by id', async () => {
    const useCase = new GetClientUseCase(mockClientRepository);

    const fakeClient = makeFakeClient();

    jest.mocked(mockClientRepository.findById).mockResolvedValue(fakeClient);

    const client = await useCase.execute(fakeClient.id);

    expect(client).toBeDefined();
    expect(client.id).toBe(fakeClient.id);
    expect(mockClientRepository.findById).toHaveBeenCalledWith(fakeClient.id);
  });

  it('should throw an error if client is not found', async () => {
    const useCase = new GetClientUseCase(mockClientRepository);
    const clientId = 'non-existent-id';
    jest.mocked(mockClientRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(clientId)).rejects.toThrow('Client not found.');
  });
});

import { makeFakeClient } from '../../../tests/factories/make-fake-client';
import { IClientRepository } from '../repositories/IClientRepository';
import { CreateClientUseCase } from './CreateClientUseCase';

const mockClientRepository: IClientRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Create Client Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to create a new client', async () => {
    const useCase = new CreateClientUseCase(mockClientRepository);

    const fakeClient = makeFakeClient();

    jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(null);
    jest.mocked(mockClientRepository.create).mockResolvedValue(fakeClient);

    const client = await useCase.execute({ name: fakeClient.name, email: fakeClient.email });

    expect(client).toHaveProperty('id');
    expect(client.name).toBe(fakeClient.name);
    expect(mockClientRepository.findByEmail).toHaveBeenCalledWith(fakeClient.email);
    expect(mockClientRepository.create).toHaveBeenCalledWith({ name: fakeClient.name, email: fakeClient.email });
  });

  it('should not be able to create a client with an existing email', async () => {
    const useCase = new CreateClientUseCase(mockClientRepository);

    const fakeClient = makeFakeClient();

    jest.mocked(mockClientRepository.findByEmail).mockResolvedValue(fakeClient);

    await expect(useCase.execute({ name: fakeClient.name, email: fakeClient.email })).rejects.toThrow(
      'Client with this email already exists.',
    );

    expect(mockClientRepository.create).not.toHaveBeenCalled();
  });
});

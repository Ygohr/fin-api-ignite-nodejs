import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "../../modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance Test', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it('1) Should be able to get user balance', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123"
    };

    const created_user = await createUserUseCase.execute(user);
    const result = await getBalanceUseCase.execute({user_id: created_user.id!});

    expect(result).toHaveProperty('statement');
    expect(result).toHaveProperty('balance');
  });

  it('2) Should not be able to get a non existent user balance', async () => {
    try {
      const result = await getBalanceUseCase.execute({user_id: 'inexistent_user'});
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(GetBalanceError);
      expect(error.message).toBe('User not found');
    }

  });
});

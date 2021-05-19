import { User } from "../../modules/users/entities/User";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create User Tests', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('1) Should be able to create a new user', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123"
    };

    const result = await createUserUseCase.execute(user);
    expect(result).toBeInstanceOf(User);
  });

  it('2) Should not be able to create a existent user', async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "123"
      };

      await createUserUseCase.execute(user);
      const result = await createUserUseCase.execute(user);
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(CreateUserError);
      expect(error.message).toBe('User already exists');
    }
  });
});

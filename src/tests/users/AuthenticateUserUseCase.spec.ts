import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Authenticate User tests', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('1) Should be able to authenticate a user', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "abcd"
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({email: user.email, password: user.password});
    expect(result).toHaveProperty("token");
    expect(result.token.length).toBeGreaterThan(0);
  });

  it('1) Should not be able to authenticate inexistent user', async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "abcd"
      };

      const result = await authenticateUserUseCase.execute({email: user.email, password: user.password});
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
      expect(error.message).toBe("Incorrect email or password");
    }
  });
});

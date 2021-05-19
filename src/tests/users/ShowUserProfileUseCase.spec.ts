import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Show User Profile Tests', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it('1) Should be able to show user profile', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "abcd"
    };

    const created_user = await createUserUseCase.execute(user);
    const result = await showUserProfileUseCase.execute(created_user.id!);
    expect(result).toHaveProperty("id");
  });

  it('2) Should not be able to show a non existent user profile', async () => {
    try {
      const result = await showUserProfileUseCase.execute('inexistent_id');
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(ShowUserProfileError);
      expect(error.message).toBe('User not found');
    }

  });
});

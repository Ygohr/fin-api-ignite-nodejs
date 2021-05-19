import { OperationType, Statement } from "../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get Statement Test', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it('1) Should be able to get user statement operation ', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123"
    };

    const created_user = await createUserUseCase.execute(user);

    const deposit_statement = {
      user_id: created_user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit test"
    };

    const created_statement = await createStatementUseCase.execute({
      user_id: created_user.id!,
      type: deposit_statement.type,
      amount: deposit_statement.amount,
      description: deposit_statement.description,
    });

    const result = await getStatementOperationUseCase.execute({user_id: created_user.id!, statement_id: created_statement.id!});

    expect(result).toBeInstanceOf(Statement);
    expect(result).toHaveProperty('id');
    expect(result.type).toBe(OperationType.DEPOSIT);
  });

  it('2) Should not be able to get a non existent user statement operation ', async () => {
    try {
      const result = await getStatementOperationUseCase.execute({user_id: 'inexistent_user', statement_id: ''});

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound);
      expect(error.message).toBe('User not found');
    }
  });

  it('3) Should not be able to get user non existent statement operation ', async () => {
    try {
      const user = {
        name: "test",
        email: "test@email.com",
        password: "123"
      };

      const created_user = await createUserUseCase.execute(user);
      const result = await getStatementOperationUseCase.execute({user_id: created_user.id!, statement_id: 'inexistent_statement'});

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(GetStatementOperationError.StatementNotFound);
      expect(error.message).toBe('Statement not found');
    }
  });
});

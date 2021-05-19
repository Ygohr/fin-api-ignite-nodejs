import { OperationType, Statement } from "../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Create Statements Test', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('1) Should be able to create a new statement of type deposit', async () => {
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

    const result = await createStatementUseCase.execute({
      user_id: created_user.id!,
      type: deposit_statement.type,
      amount: deposit_statement.amount,
      description: deposit_statement.description,
    });

    expect(result).toBeInstanceOf(Statement);
    expect(result.type).toBe(OperationType.DEPOSIT);
  });

  it('2) Should be able to create a new statement of type withdraw', async () => {
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

    await createStatementUseCase.execute({
      user_id: created_user.id!,
      type: deposit_statement.type,
      amount: deposit_statement.amount,
      description: deposit_statement.description,
    });


    const withdraw_statement = {
      user_id: created_user.id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "deposit test"
    };

    const result = await createStatementUseCase.execute({
      user_id: created_user.id!,
      type: withdraw_statement.type,
      amount: withdraw_statement.amount,
      description: withdraw_statement.description,
    });

    expect(result).toBeInstanceOf(Statement);
    expect(result.type).toBe(OperationType.WITHDRAW);
  });

  it('3) Should not be able to create a new statement of type withdraw when there is no enough balance', async () => {
    const user = {
      name: "test",
      email: "test@email.com",
      password: "123"
    };

    const created_user = await createUserUseCase.execute(user);

    try {
      const withdraw_statement = {
        user_id: created_user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "deposit test"
      };
      const result = await createStatementUseCase.execute({
        user_id: created_user.id!,
        type: withdraw_statement.type,
        amount: withdraw_statement.amount,
        description: withdraw_statement.description,
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(CreateStatementError.InsufficientFunds);
      expect(error.message).toBe('Insufficient funds');
    }
  });

  it('4) Should not be able to create a new statement for inexistent user', async () => {
    try {
      const withdraw_statement = {
        user_id: 'inexistent_user',
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "deposit test"
      };
      const result = await createStatementUseCase.execute({
        user_id: withdraw_statement.user_id,
        type: withdraw_statement.type,
        amount: withdraw_statement.amount,
        description: withdraw_statement.description,
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(CreateStatementError.UserNotFound);
      expect(error.message).toBe('User not found');
    }
  });
});

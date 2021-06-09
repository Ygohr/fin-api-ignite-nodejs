import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { BalanceError, ReceiverError, SenderError } from "./CreateTransferError";
import { ITransferDTO } from "./CreateTransfersDTO";

@injectable()
class CreateTransfersUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ amount, description, sender_id, receiver_id }: ITransferDTO) {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new SenderError();
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if (!receiver) {
      throw new ReceiverError();
    }

    const sender_balance = await this.statementsRepository.getUserBalance({
      user_id: sender_id
    });

    if (amount > sender_balance.balance) {
      throw new BalanceError();
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Transfer to ${receiver.name}: ${description}`
    });

    const transfer_statement = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id: sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return transfer_statement;

  }
}

export { CreateTransfersUseCase };

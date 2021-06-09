import { AppError } from "../../../../shared/errors/AppError";

export class SenderError extends AppError {
  constructor() {
    super('Sender not found', 404);
  }
}

export class ReceiverError extends AppError {
  constructor() {
    super('Receiver not found', 404);
  }
}

export class BalanceError extends AppError {
  constructor() {
    super('Not enough balance to complete transfer', 400);
  }
}

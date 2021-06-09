import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransfersUseCase } from "./CreateTransfersUseCase";

class CreateTransfersController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { id: sender_id } = request.user;
    const { receiver_id } = request.params;

    const createTrasnferUseCase = container.resolve(CreateTransfersUseCase);
    const transfer = await createTrasnferUseCase.execute({
      amount,
      description,
      sender_id,
      receiver_id
    });

    return response.status(201).json(transfer);
  }
}

export { CreateTransfersController };

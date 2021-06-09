import { Router } from 'express';

import { CreateStatementController } from '../modules/statements/useCases/createStatement/CreateStatementController';
import { CreateTransfersController } from '../modules/statements/useCases/createTransfers/CreateTransfersController';
import { GetBalanceController } from '../modules/statements/useCases/getBalance/GetBalanceController';
import { GetStatementOperationController } from '../modules/statements/useCases/getStatementOperation/GetStatementOperationController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const createTransferController = new CreateTransfersController();

statementRouter.use(ensureAuthenticated);

statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/transfer/:receiver_id', createTransferController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.get('/balance', getBalanceController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);

export { statementRouter };

/* TODO
- implement pagination and filtering
- refactor to use Dependency Injection
*/
import { Request, Response } from 'express';
import { constants } from 'http2';
import { LoanService } from '#/services/loan';
import { GenericResponse } from '#/models/response';
import { MESSAGES } from '#/util/constants';

const MINIMUM_REQUESTED_AMOUNT = 1;
const service = new LoanService();

export const getAllLoans = async (_req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loans = await service.getAllLoans();
  if (!loans) {
    response.message = MESSAGES.LOANS_NOT_FOUND;
    return res.status(constants.HTTP_STATUS_OK).json(response);
  }

  response.message = MESSAGES.LOANS_RETRIEVED;
  response.data = loans;
  return res.status(constants.HTTP_STATUS_OK).json(response);
};

export const getLoanById = async (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loan = await service.getLoanById(req.params.id);

  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_FOUND;
    return res.status(constants.HTTP_STATUS_OK).json(response);
  }

  response.message = MESSAGES.LOAN_RETRIEVED;
  response.data = loan;
  return res.status(constants.HTTP_STATUS_OK).json(response);
};

export const createLoan = async (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const { applicantName, requestedAmount } = req.body;

  if (!applicantName || !requestedAmount || requestedAmount < MINIMUM_REQUESTED_AMOUNT) {
    response.message = MESSAGES.INVALID_REQUEST_PAYLOAD;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = await service.createLoan(applicantName, requestedAmount);
  response.message = MESSAGES.LOAN_CREATED;
  response.data = loan;
  return res.status(constants.HTTP_STATUS_CREATED).json(response);
};

export const updateLoan = async (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const { id } = req.params;
  const { applicantName, requestedAmount, status } = req.body;

  if (!applicantName && !requestedAmount && !status) {
    response.message = MESSAGES.INVALID_REQUEST_PAYLOAD;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = await service.updateLoan(id, { applicantName, requestedAmount, status });
  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_UPDATED;
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
  }

  response.message = MESSAGES.LOAN_UPDATED;
  response.data = loan;
  return res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

export const deleteLoan = async (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const { id } = req.params;

  const loan = await service.getLoanById(id);
  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_FOUND;
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
  }

  const deleted = await service.deleteLoan(id);
  if (!deleted) {
    response.message = MESSAGES.LOAN_NOT_REMOVED;
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
  }

  response.message = MESSAGES.LOAN_REMOVED;
  return res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

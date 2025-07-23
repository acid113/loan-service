// TODO: Implement pagination and filtering
import { Request, Response } from 'express';
import { constants } from 'http2';
import { LoanService } from '#/services/loan';
import { GenericResponse } from '#/models/response';
import { MESSAGES } from '#/util/constants';

const MINIMUM_REQUESTED_AMOUNT = 1;

const loanService = new LoanService();

export const getAllLoans = async (_req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loans = await loanService.getAllLoans();

  if (!loans) {
    response.message = MESSAGES.LOANS_NOT_FOUND;
    return res.status(constants.HTTP_STATUS_NO_CONTENT).json(response);
  }

  response.message = MESSAGES.LOANS_RETRIEVED;
  response.data = loans;
  res.status(constants.HTTP_STATUS_OK).json(response);
};

export const getLoanById = async (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loan = await loanService.getLoanById(req.params.id);

  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_FOUND;
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json(response);
  }

  response.message = MESSAGES.LOAN_RETRIEVED;
  response.data = loan;
  res.json(response);
};

export const createLoan = async (req: Request, res: Response) => {
  const { applicantName, requestedAmount } = req.body;
  const response: GenericResponse = {};

  if (!applicantName || !requestedAmount || requestedAmount < MINIMUM_REQUESTED_AMOUNT) {
    response.message = MESSAGES.INVALID_REQUEST_PAYLOAD;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = await loanService.createLoan(applicantName, requestedAmount);
  response.message = MESSAGES.LOAN_CREATED;
  response.data = loan;
  res.status(constants.HTTP_STATUS_CREATED).json(response);
};

export const updateLoan = async (req: Request, res: Response) => {
  const { applicantName, requestedAmount, status } = req.body;
  const response: GenericResponse = {};

  if (!applicantName && !requestedAmount && !status) {
    response.message = MESSAGES.INVALID_REQUEST_PAYLOAD;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = await loanService.updateLoan(req.params.id, { applicantName, requestedAmount, status });
  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_UPDATED;
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
  }

  response.message = MESSAGES.LOAN_UPDATED;
  response.data = loan;
  res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

export const rejectLoan = async (req: Request, res: Response) => {
  const { id } = req.body;
  const response: GenericResponse = {};
  const loan = await loanService.rejectLoan(id);
  if (!loan) {
    response.message = MESSAGES.LOAN_NOT_REJECTED;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  response.message = MESSAGES.LOAN_REJECTED;
  response.data = loan;
  res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

export const deleteLoan = async (req: Request, res: Response) => {
  const { id } = req.body;
  const response: GenericResponse = {};

  if (!id) {
    response.message = MESSAGES.INVALID_REQUEST_PAYLOAD;
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const deleted = await loanService.deleteLoan(id);
  if (!deleted) {
    response.message = MESSAGES.LOAN_NOT_REMOVED;
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(response);
  }

  response.message = MESSAGES.LOAN_REMOVED;
  res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

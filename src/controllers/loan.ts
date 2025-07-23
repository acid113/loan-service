import { Request, Response } from 'express';
import http2 from 'http2';
import { LoanService } from '#/services/loan';
import { GenericResponse } from '#/models/response';

const loanService = new LoanService();
const { constants } = http2;

export const getAllLoans = (_req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loans = loanService.getAllLoans();

  if (loans) {
    response.message = 'Loans found';
    response.data = loans;
    res.status(constants.HTTP_STATUS_OK).json(response);
  } else {
    response.message = 'No existing loans';
    res.status(constants.HTTP_STATUS_NO_CONTENT).json(response);
  }
};

export const getLoanById = (req: Request, res: Response) => {
  const response: GenericResponse = {};
  const loan = loanService.getLoanById(req.params.id);

  if (!loan) {
    response.message = 'Loan not found';
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json(response);
  }

  response.data = loan;
  response.message = 'Loan found';
  res.json(response);
};

export const createLoan = (req: Request, res: Response) => {
  const { applicantName, requestedAmount } = req.body;
  const response: GenericResponse = {};

  if (!applicantName || !requestedAmount) {
    response.message = 'Invalid request payload';
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = loanService.createLoan(applicantName, requestedAmount);
  response.message = 'Loan created';
  response.data = loan;
  res.status(constants.HTTP_STATUS_CREATED).json(response);
};

export const updateLoan = (req: Request, res: Response) => {
  const { applicantName, requestedAmount, status } = req.body;
  const response: GenericResponse = {};

  if (!applicantName && !requestedAmount && !status) {
    response.message = 'Invalid request payload';
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(response);
  }

  const loan = loanService.updateLoan(applicantName, status, requestedAmount);
  response.message = 'Loan updated';
  response.data = loan;
  res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

export const deleteLoan = (req: Request, res: Response) => {
  const { id } = req.body;
  const response: GenericResponse = {};

  if (!id) {
    response.message = 'Loan not found';
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json(response);
  }

  response.message = 'Load removed';
  res.status(constants.HTTP_STATUS_ACCEPTED).json(response);
};

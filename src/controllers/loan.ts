/* TODO
- implement pagination and filtering
- update Swagger documentation
- refactor to use Dependency Injection
*/
import { Request, Response } from 'express';
import { constants } from 'http2';
import { LoanService } from '#/services/loan';
import { GenericResponse } from '#/models/response';
import { MESSAGES } from '#/util/constants';

const MINIMUM_REQUESTED_AMOUNT = 1;
const service = new LoanService();

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         applicantName:
 *           type: string
 *         requestedAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *     responses:
 *       200:
 *         description: List of loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 */
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

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get a loan by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: A loan object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Loan not found
 */
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

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - requestedAmount
 *             properties:
 *               applicantName:
 *                 type: string
 *               requestedAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Invalid request payload
 */
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

/**
 * @swagger
 * /api/loans/{id}:
 *   put:
 *     summary: Update an existing loan
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantName:
 *                 type: string
 *               requestedAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       202:
 *         description: Loan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Loan not updated
 */
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

/**
 * @swagger
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete a loan by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loan ID
 *     responses:
 *       202:
 *         description: Loan deleted successfully
 *       500:
 *         description: Loan not found or not removed
 */
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

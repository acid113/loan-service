import type { Request, Response } from 'express';
import { constants } from 'http2';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as LoanController from '../controllers/loan';
import { MESSAGES } from '#/util/constants';

// Mock the service
vi.mock('../services/loan', () => {
  const MockLoanService = vi.fn();
  MockLoanService.prototype.getAllLoans = vi.fn();
  MockLoanService.prototype.getLoanById = vi.fn();
  MockLoanService.prototype.createLoan = vi.fn();
  MockLoanService.prototype.updateLoan = vi.fn();
  MockLoanService.prototype.deleteLoan = vi.fn();

  return {
    LoanService: MockLoanService,
  };
});

// Import mocked service for control
import { LoanService } from '../services/loan';

const MOCK_LOAN = {
  id: '1',
  applicantName: 'Nata De Coco',
  requestedAmount: 1000,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const MOCK_LOANS = [
  {
    id: '1',
    applicantName: 'Nata De Coco',
    requestedAmount: 1000,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    applicantName: 'Sopas Soup',
    requestedAmount: 2000,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('getAllLoans', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('returns existing loans on success', async () => {
    // Mock the getAllLoans method to return our test data
    (LoanService.prototype.getAllLoans as any).mockResolvedValue(MOCK_LOANS);

    // Call the controller function
    await LoanController.getAllLoans(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.getAllLoans).toHaveBeenCalled();

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOANS_RETRIEVED,
      data: MOCK_LOANS,
    });
  });

  it('handles case when no loans exist', async () => {
    // Mock the service to return null (no loans)
    (LoanService.prototype.getAllLoans as any).mockResolvedValue(null);

    // Call the controller function
    await LoanController.getAllLoans(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.getAllLoans).toHaveBeenCalledTimes(1);

    // Verify the response for no loans case
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOANS_NOT_FOUND,
    });
  });
});

describe('getLoanById', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { params: { id: '1' } } as unknown as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('returns loan by ID on success', async () => {
    // Mock the getLoanById method to return our test data
    (LoanService.prototype.getLoanById as any).mockResolvedValue({
      ...MOCK_LOAN,
      status: 'APPROVED',
    });

    // Call the controller function
    await LoanController.getLoanById(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.getLoanById).toHaveBeenCalled();

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_RETRIEVED,
      data: {
        ...MOCK_LOAN,
        status: 'APPROVED',
      },
    });
  });

  it('handles case when loan is not found', async () => {
    // Mock the service to return null (loan not found)
    (LoanService.prototype.getLoanById as any).mockResolvedValue(null);

    // Call the controller function
    await LoanController.getLoanById(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.getLoanById).toHaveBeenCalled();

    // Verify the response for loan not found case
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_NOT_FOUND,
    });
  });
});

describe('createLoan', () => {
  let req: Request;
  let res: Response;
  beforeEach(() => {
    req = {
      body: {
        applicantName: 'Super Nata',
        requestedAmount: 5000,
      },
    } as unknown as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Clear all mocks
    vi.clearAllMocks();
  });
  it('creates a loan successfully', async () => {
    // Mock the createLoan method to return our test data
    (LoanService.prototype.createLoan as any).mockResolvedValue({
      applicantName: 'Super Nata',
      requestedAmount: 5000,
    });

    // Call the controller function
    await LoanController.createLoan(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.createLoan).toHaveBeenCalledWith('Super Nata', 5000);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_CREATED);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_CREATED,
      data: {
        applicantName: 'Super Nata',
        requestedAmount: 5000,
      },
    });
  });

  it('returns error message if the applicant name is missing', async () => {
    req.body.applicantName = '';

    await LoanController.createLoan(req, res);

    expect(LoanService.prototype.createLoan).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.INVALID_REQUEST_PAYLOAD,
    });
  });
  it('returns error message if the requested amount is less than the minimum', async () => {
    req.body.requestedAmount = 0;

    await LoanController.createLoan(req, res);

    expect(LoanService.prototype.createLoan).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.INVALID_REQUEST_PAYLOAD,
    });
  });
  it('returns error message if the requested amount is not provided', async () => {
    req.body.requestedAmount = undefined;

    await LoanController.createLoan(req, res);

    expect(LoanService.prototype.createLoan).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.INVALID_REQUEST_PAYLOAD,
    });
  });
});

describe('updateLoan', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      body: {},
    } as unknown as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('updates a loan successfully', async () => {
    req.body = {
      applicantName: 'Updated Nata',
      requestedAmount: 6000,
      status: 'APPROVED',
    };

    // Mock the updateLoan method to return our test data
    (LoanService.prototype.updateLoan as any).mockResolvedValue({
      ...MOCK_LOAN,
      applicantName: 'Updated Nata',
      requestedAmount: 6000,
      status: 'APPROVED',
    });

    // Call the controller function
    await LoanController.updateLoan(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.updateLoan).toHaveBeenCalledWith('1', {
      applicantName: 'Updated Nata',
      requestedAmount: 6000,
      status: 'APPROVED',
    });

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_ACCEPTED);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_UPDATED,
      data: {
        ...MOCK_LOAN,
        applicantName: 'Updated Nata',
        requestedAmount: 6000,
        status: 'APPROVED',
      },
    });
  });

  it('returns error message if no fields are provided for update', async () => {
    req.body = {};

    await LoanController.updateLoan(req, res);

    expect(LoanService.prototype.updateLoan).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.INVALID_REQUEST_PAYLOAD,
    });
  });
});

describe('deleteLoan', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = { params: { id: '1' } } as unknown as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('deletes a loan successfully', async () => {
    // Mock the getLoanById method to return our test data
    (LoanService.prototype.getLoanById as any).mockResolvedValue(MOCK_LOAN);
    (LoanService.prototype.deleteLoan as any).mockResolvedValue(true);

    // Call the controller function
    await LoanController.deleteLoan(req, res);

    // Verify the service methods were called
    expect(LoanService.prototype.getLoanById).toHaveBeenCalledWith('1');
    expect(LoanService.prototype.deleteLoan).toHaveBeenCalledWith('1');

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_ACCEPTED);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_REMOVED,
    });
  });

  it('returns error message if loan not found', async () => {
    // Mock the service to return null (loan not found)
    (LoanService.prototype.getLoanById as any).mockResolvedValue(null);

    // Call the controller function
    await LoanController.deleteLoan(req, res);

    // Verify the service method was called
    expect(LoanService.prototype.getLoanById).toHaveBeenCalledWith('1');

    // Verify the response for loan not found case
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_NOT_FOUND,
    });
  });

  it('returns error message if deletion fails', async () => {
    // Mock the getLoanById method to return our test data
    (LoanService.prototype.getLoanById as any).mockResolvedValue(MOCK_LOAN);
    // Mock the deleteLoan method to return false (deletion failed)
    (LoanService.prototype.deleteLoan as any).mockResolvedValue(false);

    // Call the controller function
    await LoanController.deleteLoan(req, res);

    // Verify the service methods were called
    expect(LoanService.prototype.getLoanById).toHaveBeenCalledWith('1');
    expect(LoanService.prototype.deleteLoan).toHaveBeenCalledWith('1');

    // Verify the response for deletion failure case
    expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGES.LOAN_NOT_REMOVED,
    });
  });
});

import type { Request, Response } from 'express';
import { constants } from 'http2';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as LoanController from '../../src/controllers/loan';

// Mock the service
vi.mock('../../src/services/loan', () => ({
  getAllLoans: vi.fn(),
  getLoanById: vi.fn(),
  createLoan: vi.fn(),
  updateLoan: vi.fn(),
  deleteLoan: vi.fn(),
}));

// Import mocked service for control
import * as LoanService from '../../src/services/loan';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockJsonResponse: any;
let mockStatus: any;

describe('getAllLoans', () => {
  beforeEach(() => {
    mockStatus = vi.fn(() => ({ json: mockJsonResponse }));
    mockJsonResponse = vi.fn();
    mockRequest = {};
    mockResponse = { status: mockStatus, json: mockJsonResponse };
    vi.clearAllMocks();
  });

  it('returns existing loans on success', async () => {
    (LoanService.getAllLoans as any).mockResolvedValue([{ id: 1, applicantName: 'Marvin', status: 'APPROVED' }]);

    await LoanController.getAllLoans(mockRequest as Request, mockResponse as Response);

    expect(LoanService.getAllLoans).toHaveBeenCalledOnce();
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      data: [{ id: 1, applicantName: 'Marvin', status: 'APPROVED' }],
      message: 'Loans retrieved successfully',
    });
  });

  it('returns error message if there are no loans', async () => {
    (LoanService.getAllLoans as any).mockResolvedValue(null);

    await LoanController.getAllLoans(mockRequest as Request, mockResponse as Response);

    expect(LoanService.getAllLoans).toHaveBeenCalledOnce();
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'No existing loans',
    });
  });
});

describe('getLoanById', () => {
  beforeEach(() => {
    mockStatus = vi.fn(() => ({ json: mockJsonResponse }));
    mockJsonResponse = vi.fn();
    mockRequest = { params: { id: '1' } };
    mockResponse = { status: mockStatus, json: mockJsonResponse };
    vi.clearAllMocks();
  });

  it('returns loan by ID on success', async () => {
    (LoanService.getLoanById as any).mockResolvedValue({ id: '1', applicantName: 'Marvin', status: 'APPROVED' });

    await LoanController.getLoanById(mockRequest as Request, mockResponse as Response);

    expect(LoanService.getLoanById).toHaveBeenCalledWith('1');
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      data: { id: '1', applicantName: 'Marvin', status: 'APPROVED' },
      message: 'Loan retrieved successfully',
    });
  });

  it('returns error message if loan not found', async () => {
    (LoanService.getLoanById as any).mockResolvedValue(null);

    await LoanController.getLoanById(mockRequest as Request, mockResponse as Response);

    expect(LoanService.getLoanById).toHaveBeenCalledWith('1');
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Loan not found',
    });
  });
});

describe('createLoan', () => {
  beforeEach(() => {
    mockStatus = vi.fn(() => ({ json: mockJsonResponse }));
    mockJsonResponse = vi.fn();
    mockRequest = { body: { applicantName: 'Marvin', requestedAmount: 1000 } };
    mockResponse = { status: mockStatus, json: mockJsonResponse };
    vi.clearAllMocks();
  });

  it('creates a loan successfully', async () => {
    (LoanService.createLoan as any).mockResolvedValue({ id: '1', applicantName: 'Marvin', requestedAmount: 1000 });

    await LoanController.createLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.createLoan).toHaveBeenCalledWith('Marvin', 1000);
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_CREATED);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      data: { id: '1', applicantName: 'Marvin', requestedAmount: 1000 },
      message: 'Loan created successfully',
    });
  });

  it('returns error message if the applicant name is missing', async () => {
    mockRequest.body.applicantName = '';

    await LoanController.createLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.createLoan).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Invalid request payload',
    });
  });

  it('returns error message if the requested amount is less than the minimum', async () => {
    mockRequest.body.requestedAmount = 0;

    await LoanController.createLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.createLoan).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Invalid request payload',
    });
  });
});

describe('updateLoan', () => {
  beforeEach(() => {
    mockStatus = vi.fn(() => ({ json: mockJsonResponse }));
    mockJsonResponse = vi.fn();
    mockRequest = { params: { id: '1' }, body: { applicantName: 'Marvin', requestedAmount: 1000, status: 'APPROVED' } };
    mockResponse = { status: mockStatus, json: mockJsonResponse };
    vi.clearAllMocks();
  });

  it('updates a loan successfully', async () => {
    (LoanService.updateLoan as any).mockResolvedValue({ id: '1', applicantName: 'Marvin', requestedAmount: 1000, status: 'APPROVED' });

    await LoanController.updateLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.updateLoan).toHaveBeenCalledWith('1', { applicantName: 'Marvin', requestedAmount: 1000, status: 'APPROVED' });
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_ACCEPTED);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      data: { id: '1', applicantName: 'Marvin', requestedAmount: 1000, status: 'APPROVED' },
      message: 'Loan updated successfully',
    });
  });

  it('returns error message if no fields are provided for update', async () => {
    mockRequest.body = {};

    await LoanController.updateLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.updateLoan).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_BAD_REQUEST);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Invalid request payload',
    });
  });
});

describe('deleteLoan', () => {
  beforeEach(() => {
    mockStatus = vi.fn(() => ({ json: mockJsonResponse }));
    mockJsonResponse = vi.fn();
    mockRequest = { params: { id: '1' } };
    mockResponse = { status: mockStatus, json: mockJsonResponse };
    vi.clearAllMocks();
  });

  it('deletes a loan successfully', async () => {
    (LoanService.getLoanById as any).mockResolvedValue({ id: '1', applicantName: 'Marvin', status: 'APPROVED' });
    (LoanService.deleteLoan as any).mockResolvedValue(true);

    await LoanController.deleteLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.deleteLoan).toHaveBeenCalledWith('1');
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_ACCEPTED);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Loan removed',
    });
  });

  it('returns error message if loan not found', async () => {
    (LoanService.getLoanById as any).mockResolvedValue(null);

    await LoanController.deleteLoan(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Loan not found',
    });
  });

  it('returns error message if deletion fails', async () => {
    (LoanService.getLoanById as any).mockResolvedValue({ id: '1', applicantName: 'Marvin', status: 'APPROVED' });
    (LoanService.deleteLoan as any).mockResolvedValue(false);

    await LoanController.deleteLoan(mockRequest as Request, mockResponse as Response);

    expect(LoanService.deleteLoan).toHaveBeenCalledWith('1');
    expect(mockStatus).toHaveBeenCalledWith(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Loan not removed',
    });
  });
});

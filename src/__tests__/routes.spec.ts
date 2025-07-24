import { constants } from 'http2';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../app';

const mocks = vi.hoisted(() => {
  return {
    getAllLoans: vi.fn(),
    getLoanById: vi.fn(),
    createLoan: vi.fn(),
    updateLoan: vi.fn(),
    deleteLoan: vi.fn(),
  };
});

vi.mock('#/controllers/loan', () => {
  return {
    getAllLoans: mocks.getAllLoans,
    getLoanById: mocks.getLoanById,
    createLoan: mocks.createLoan,
    updateLoan: mocks.updateLoan,
    deleteLoan: mocks.deleteLoan,
  };
});

describe('GET /loans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a success mocked response from controller', async () => {
    mocks.getAllLoans.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_OK).json({
        message: 'Loans retrieved successfully',
        data: [{ id: 1, applicantName: 'Nata De Coco', requestedAmount: 1000 }],
      });
    });

    const res = await request(app).get('/loans');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_OK);
    expect(body.message).toEqual('Loans retrieved successfully');
    expect(body.data).toBeDefined();
    expect(body.data[0].applicantName).toEqual('Nata De Coco');
    expect(body.data[0].requestedAmount).toEqual(1000);
  });

  it('should return a failed mocked response from controller', async () => {
    mocks.getAllLoans.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_OK).json({
        message: 'No existing loans',
      });
    });

    const res = await request(app).get('/loans');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_OK);
    expect(body.message).toEqual('No existing loans');
    expect(body.data).not.toBeDefined();
  });
});

describe('GET /loans/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of loans', async () => {
    mocks.getLoanById.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_OK).json({
        message: 'Loan retrieved successfully',
        data: { id: req.params.id, applicantName: 'Nata De Coco', requestedAmount: 1000 },
      });
    });

    const res = await request(app).get('/loans/1');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_OK);
    expect(body.message).toEqual('Loan retrieved successfully');
    expect(body.data).toBeDefined();
    expect(body.data.applicantName).toEqual('Nata De Coco');
    expect(body.data.requestedAmount).toEqual(1000);
  });

  it('should not return a list of loans', async () => {
    mocks.getLoanById.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_OK).json({
        message: 'Loan not found',
      });
    });

    const res = await request(app).get('/loans/999');
    const { status, body } = res;
    expect(status).toBe(constants.HTTP_STATUS_OK);
    expect(body.message).toEqual('Loan not found');
    expect(body.data).not.toBeDefined();
  });
});

describe('POST /loans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a loan successfully', async () => {
    mocks.createLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_CREATED).json({
        message: 'Loan created successfully',
        data: { id: 1, applicantName: req.body.applicantName, requestedAmount: req.body.requestedAmount },
      });
    });

    const res = await request(app).post('/loans').send({ applicantName: 'Nata De Coco', requestedAmount: 1000 });
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_CREATED);
    expect(body.message).toEqual('Loan created successfully');
    expect(body.data).toBeDefined();
    expect(body.data.applicantName).toEqual('Nata De Coco');
    expect(body.data.requestedAmount).toEqual(1000);
  });

  it('should return an error for invalid request payload', async () => {
    mocks.createLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        message: 'Invalid request payload',
      });
    });

    const res = await request(app).post('/loans').send({ applicantName: '', requestedAmount: -100 });
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
    expect(body.message).toEqual('Invalid request payload');
    expect(body.data).not.toBeDefined();
  });
});

describe('PUT /loans/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a loan successfully', async () => {
    mocks.updateLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_OK).json({
        message: 'Loan updated successfully',
        data: { id: req.params.id, applicantName: req.body.applicantName, requestedAmount: req.body.requestedAmount },
      });
    });

    const res = await request(app).put('/loans/1').send({ applicantName: 'Updated Name', requestedAmount: 2000 });
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_OK);
    expect(body.message).toEqual('Loan updated successfully');
    expect(body.data).toBeDefined();
    expect(body.data.applicantName).toEqual('Updated Name');
    expect(body.data.requestedAmount).toEqual(2000);
  });

  it('should return an error for invalid request payload', async () => {
    mocks.updateLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        message: 'Invalid request payload',
      });
    });

    const res = await request(app).put('/loans/1').send({});
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_BAD_REQUEST);
    expect(body.message).toEqual('Invalid request payload');
    expect(body.data).not.toBeDefined();
  });

  it('should return an error if the update failed', async () => {
    mocks.updateLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: 'Loan not updated',
      });
    });

    const res = await request(app).put('/loans/999').send({ applicantName: 'Nonexistent', requestedAmount: 500 });
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(body.message).toEqual('Loan not updated');
    expect(body.data).not.toBeDefined();
  });
});

describe('DELETE /loans/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a loan successfully', async () => {
    mocks.deleteLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_ACCEPTED).json({
        message: 'Loan deleted successfully',
      });
    });

    const res = await request(app).delete('/loans/1');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_ACCEPTED);
    expect(body.message).toEqual('Loan deleted successfully');
  });

  it('should return an error when deleting a non-existing loan', async () => {
    mocks.deleteLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: 'Loan not found',
      });
    });

    const res = await request(app).delete('/loans/999');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(body.message).toEqual('Loan not found');
  });

  it('should return an error if delete failed', async () => {
    mocks.deleteLoan.mockImplementation((req, res) => {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        message: 'Loan not removed',
      });
    });

    const res = await request(app).delete('/loans/1');
    const { status, body } = res;

    expect(status).toBe(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(body.message).toEqual('Loan not removed');
  });
});

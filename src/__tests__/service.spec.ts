import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Loan } from '#/models/loan';

const MOCK_LOAN: Loan = {
  id: '1',
  applicantName: 'Nata De Coco',
  requestedAmount: 1000,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_LOANS = [
  { id: '1', applicantName: 'Nata De Coco', requestedAmount: 1000, status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', applicantName: 'Sopas Soup', requestedAmount: 2000, status: 'PENDING', createdAt: new Date(), updatedAt: new Date() },
];

import { LoanService } from '../loan/loan.service';

// Mock the database module first
vi.mock('../database/db', () => ({
  db: {
    query: vi.fn(),
  },
}));

// Then import mocked database module
import { db } from '../database/db';

const service = new LoanService();

describe('getAllLoans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all loans', async () => {
    (db.query as any).mockResolvedValue({ rowCount: MOCK_LOANS.length, rows: MOCK_LOANS });

    const result = await service.getAllLoans();

    expect(result).toEqual(MOCK_LOANS);
  });

  it('should return null if no loans exist', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 0, rows: [] });

    const result = await service.getAllLoans();

    expect(result).toBeNull();
  });
});

describe('getLoanById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a loan by ID', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 1, rows: [MOCK_LOAN] });

    const result = await service.getLoanById('1');

    expect(result).toEqual(MOCK_LOAN);
  });

  it('should return null if loan does not exist', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 0, rows: [] });

    const result = await service.getLoanById('999');

    expect(result).toBeNull();
  });
});

describe('createLoan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a loan successfully', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 1, rows: [MOCK_LOAN] });

    const result = await service.createLoan('Nata De Coco', 1000);

    expect(result).toEqual(MOCK_LOAN);
  });
});

describe('updateLoan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if no updates provided', async () => {
    const result = await service.updateLoan('1', {});
    expect(result).toBeNull();
  });

  it('should return null if loan does not exist', async () => {
    vi.spyOn(service, 'getLoanById').mockResolvedValue(null);

    const result = await service.updateLoan('999', { applicantName: 'New Name' });
    expect(result).toBeNull();
  });

  it('should update only the status of an existing loan', async () => {
    vi.spyOn(service, 'getLoanById').mockResolvedValue(MOCK_LOAN);

    const updatedLoan = {
      ...MOCK_LOAN,
      status: 'APPROVED',
    };

    // Mock db.query for the update
    (db.query as any).mockResolvedValue({
      rowCount: 1,
      rows: [updatedLoan],
    });

    const result = await service.updateLoan('1', { status: 'APPROVED' });

    expect(result).toEqual(updatedLoan);
  });
});

describe('deleteLoan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a loan successfully', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 1 });

    const result = await service.deleteLoan('1');

    expect(result).toBe(true);
  });

  it('should return false if loan does not exist', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 0 });

    const result = await service.deleteLoan('999');

    expect(result).toBe(false);
  });
});

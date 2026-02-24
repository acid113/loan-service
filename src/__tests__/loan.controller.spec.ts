import { constants } from 'http2';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';

import { LoanController } from '#/loan/loan.controller';
import { LoanService } from '#/loan/loan.service';
import { MESSAGES } from '#/util/constants';

const MOCK_LOAN = {
  id: '1',
  applicantName: 'Nata De Coco',
  requestedAmount: 1000,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_LOANS = [MOCK_LOAN];

describe('LoanController', () => {
  let controller: LoanController;
  let service: LoanService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        {
          provide: LoanService,
          useValue: {
            getAllLoans: vi.fn(),
            getLoanById: vi.fn(),
            createLoan: vi.fn(),
            updateLoan: vi.fn(),
            deleteLoan: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(LoanController);
    service = moduleRef.get(LoanService) as unknown as LoanService;
    vi.clearAllMocks();
  });

  it('returns existing loans', async () => {
    (service.getAllLoans as any).mockResolvedValue(MOCK_LOANS);

    const result = await controller.getAllLoans();

    expect(result).toEqual({ message: MESSAGES.LOANS_RETRIEVED, data: MOCK_LOANS });
  });

  it('returns not found when no loans exist', async () => {
    (service.getAllLoans as any).mockResolvedValue(null);

    const result = await controller.getAllLoans();

    expect(result).toEqual({ message: MESSAGES.LOANS_NOT_FOUND });
  });

  it('returns loan by id', async () => {
    (service.getLoanById as any).mockResolvedValue(MOCK_LOAN);

    const result = await controller.getLoanById('1');

    expect(result).toEqual({ message: MESSAGES.LOAN_RETRIEVED, data: MOCK_LOAN });
  });

  it('returns not found when loan missing', async () => {
    (service.getLoanById as any).mockResolvedValue(null);

    const result = await controller.getLoanById('1');

    expect(result).toEqual({ message: MESSAGES.LOAN_NOT_FOUND });
  });

  it('creates a loan', async () => {
    (service.createLoan as any).mockResolvedValue(MOCK_LOAN);

    const result = await controller.createLoan({ applicantName: 'Nata De Coco', requestedAmount: 1000 });

    expect(service.createLoan).toHaveBeenCalledWith('Nata De Coco', 1000);
    expect(result).toEqual({ message: MESSAGES.LOAN_CREATED, data: MOCK_LOAN });
  });

  it('updates a loan', async () => {
    (service.updateLoan as any).mockResolvedValue({ ...MOCK_LOAN, status: 'APPROVED' });

    const result = await controller.updateLoan('1', { status: 'APPROVED' });

    expect(result).toEqual({
      message: MESSAGES.LOAN_UPDATED,
      data: { ...MOCK_LOAN, status: 'APPROVED' },
    });
  });

  it('throws when update payload missing', async () => {
    await expect(controller.updateLoan('1', {})).rejects.toMatchObject({
      status: constants.HTTP_STATUS_BAD_REQUEST,
    });
  });

  it('throws when update fails', async () => {
    (service.updateLoan as any).mockResolvedValue(null);

    await expect(controller.updateLoan('1', { status: 'APPROVED' })).rejects.toMatchObject({
      status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });
  });

  it('throws when loan missing on delete', async () => {
    (service.getLoanById as any).mockResolvedValue(null);

    await expect(controller.deleteLoan('1')).rejects.toMatchObject({
      status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });
  });

  it('throws when delete fails', async () => {
    (service.getLoanById as any).mockResolvedValue(MOCK_LOAN);
    (service.deleteLoan as any).mockResolvedValue(false);

    await expect(controller.deleteLoan('1')).rejects.toMatchObject({
      status: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });
  });

  it('deletes a loan', async () => {
    (service.getLoanById as any).mockResolvedValue(MOCK_LOAN);
    (service.deleteLoan as any).mockResolvedValue(true);

    const result = await controller.deleteLoan('1');

    expect(result).toEqual({ message: MESSAGES.LOAN_REMOVED });
  });
});

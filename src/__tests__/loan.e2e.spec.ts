import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { constants } from 'http2';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppModule } from '#/app.module';
import { AuthService } from '#/auth/auth.service';
import { JwtAuthGuard } from '#/auth/auth.guard';
import { LoanService } from '#/loan/loan.service';
import { MESSAGES } from '#/util/constants';

describe('Loan routes (e2e)', () => {
  let app: INestApplication;
  const loanService = {
    getAllLoans: vi.fn(),
    getLoanById: vi.fn(),
    createLoan: vi.fn(),
    updateLoan: vi.fn(),
    deleteLoan: vi.fn(),
  };
  const authService = {
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LoanService)
      .useValue(loanService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: () => new BadRequestException({ message: MESSAGES.INVALID_REQUEST_PAYLOAD }),
      })
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/loans returns data', async () => {
    loanService.getAllLoans.mockResolvedValue([{ id: '1', applicantName: 'Nata', requestedAmount: 1000 }]);

    const res = await request(app.getHttpServer()).get('/api/loans');

    expect(res.status).toBe(constants.HTTP_STATUS_OK);
    expect(res.body.message).toBe('Loans retrieved successfully');
  });

  it('POST /auth/login returns token', async () => {
    authService.login.mockResolvedValue({ token: 'token-value' });
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({
      username: 'admin',
      password: 'superpassword',
    });

    expect(res.status).toBe(constants.HTTP_STATUS_OK);
    expect(res.body.token).toBeDefined();
  });
});

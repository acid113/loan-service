import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';

import { AuthController } from '#/auth/auth.controller';
import { AuthService } from '#/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    service = moduleRef.get(AuthService) as unknown as AuthService;
    vi.clearAllMocks();
  });

  it('returns token on success', async () => {
    (service.login as any).mockResolvedValue({ token: 'token-value' });

    const result = await controller.login({ username: 'admin', password: 'superpassword' });

    expect(result).toEqual({ token: 'token-value' });
  });

  it('throws on invalid credentials', async () => {
    (service.login as any).mockRejectedValue(new Error('Invalid credentials'));

    await expect(controller.login({ username: 'admin', password: 'wrong' })).rejects.toMatchObject({
      status: 401,
    });
  });
});

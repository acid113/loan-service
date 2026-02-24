import { Module } from '@nestjs/common';

import { AuthController } from '#/auth/auth.controller';
import { AuthService } from '#/auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';

import { AuthModule } from '#/auth/auth.module';
import { LoanModule } from '#/loan/loan.module';

@Module({
  imports: [AuthModule, LoanModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { LoanController } from '#/loan/loan.controller';
import { LoanService } from '#/loan/loan.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}

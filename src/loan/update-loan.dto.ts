import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Loan } from '#/models/loan';
import { LOAN_STATUS } from '#/util/constants';

export class UpdateLoanDto {
  @ApiPropertyOptional({ example: 'Updated Name' })
  @IsOptional()
  @IsString()
  applicantName?: string;

  @ApiPropertyOptional({ example: 1500 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  requestedAmount?: number;

  @ApiPropertyOptional({ example: LOAN_STATUS.APPROVED })
  @IsOptional()
  @IsIn([LOAN_STATUS.PENDING, LOAN_STATUS.APPROVED, LOAN_STATUS.REJECTED])
  status?: Loan['status'];
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '#/auth/auth.guard';
import { GenericResponse } from '#/models/response';
import { MESSAGES } from '#/util/constants';
import { CreateLoanDto } from '#/loan/loan.dto';
import { LoanService } from '#/loan/loan.service';
import { UpdateLoanDto } from '#/loan/update-loan.dto';

@ApiTags('Loans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('loans')
export class LoanController {
  constructor(@Inject(LoanService) private readonly service: LoanService) {}

  @Get()
  async getAllLoans(): Promise<GenericResponse> {
    const loans = await this.service.getAllLoans();
    if (!loans) {
      return { message: MESSAGES.LOANS_NOT_FOUND };
    }

    return { message: MESSAGES.LOANS_RETRIEVED, data: loans };
  }

  @Get(':id')
  async getLoanById(@Param('id') id: string): Promise<GenericResponse> {
    const loan = await this.service.getLoanById(id);
    if (!loan) {
      return { message: MESSAGES.LOAN_NOT_FOUND };
    }

    return { message: MESSAGES.LOAN_RETRIEVED, data: loan };
  }

  @Post()
  async createLoan(@Body() body: CreateLoanDto): Promise<GenericResponse> {
    const loan = await this.service.createLoan(body.applicantName, body.requestedAmount);
    return { message: MESSAGES.LOAN_CREATED, data: loan };
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateLoan(@Param('id') id: string, @Body() body: UpdateLoanDto): Promise<GenericResponse> {
    if (!body.applicantName && !body.requestedAmount && !body.status) {
      throw new BadRequestException({ message: MESSAGES.INVALID_REQUEST_PAYLOAD });
    }

    const loan = await this.service.updateLoan(id, {
      applicantName: body.applicantName,
      requestedAmount: body.requestedAmount,
      status: body.status,
    });

    if (!loan) {
      throw new InternalServerErrorException({ message: MESSAGES.LOAN_NOT_UPDATED });
    }

    return { message: MESSAGES.LOAN_UPDATED, data: loan };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteLoan(@Param('id') id: string): Promise<GenericResponse> {
    const existingLoan = await this.service.getLoanById(id);
    if (!existingLoan) {
      throw new InternalServerErrorException({ message: MESSAGES.LOAN_NOT_FOUND });
    }

    const deleted = await this.service.deleteLoan(id);
    if (!deleted) {
      throw new InternalServerErrorException({ message: MESSAGES.LOAN_NOT_REMOVED });
    }

    return { message: MESSAGES.LOAN_REMOVED };
  }
}

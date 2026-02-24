import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 'Nata De Coco' })
  @IsString()
  @IsNotEmpty()
  applicantName!: string;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  requestedAmount!: number;
}

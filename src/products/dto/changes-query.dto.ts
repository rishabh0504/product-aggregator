import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangesQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  minutes?: number;
}

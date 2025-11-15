import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  page?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsString()
  providerId?: string;
}

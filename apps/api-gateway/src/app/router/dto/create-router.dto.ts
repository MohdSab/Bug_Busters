import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRouterDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(16000)
  port: number;

  @IsString()
  @IsOptional()
  prefix?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  logo?: object;

  @IsOptional()
  detail_image: object;

  @IsOptional()
  wind_spec_image: object;
  @IsOptional()
  detail_raw_wind_data: object;
  @IsOptional()
  detail_wind_summary: object;
  @IsOptional()
  detail_investment: object;

  @IsOptional()
  file: string;
}

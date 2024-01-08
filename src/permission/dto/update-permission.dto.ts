import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  readonly permission_name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  readonly permission_name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

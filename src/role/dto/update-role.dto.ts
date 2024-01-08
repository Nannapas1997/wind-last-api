import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  readonly role_name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

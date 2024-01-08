import { IsNumber, IsOptional } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsOptional()
  @IsNumber()
  readonly role_id: number;

  @IsOptional()
  @IsNumber()
  readonly permission_id: number;
}

import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsNumber()
  readonly user_id: number;

  @IsOptional()
  @IsNumber()
  readonly role_id: number;
}

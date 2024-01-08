import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsNumber()
  readonly user_id: number;

  @IsNotEmpty()
  @IsNumber()
  readonly role_id: number;
}

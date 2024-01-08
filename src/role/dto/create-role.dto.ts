import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly role_name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

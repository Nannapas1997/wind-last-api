import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateRolePermissionDto {
  // @IsNotEmpty()
  // @IsNumber()
  // readonly role_id: number;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly permission_id: number;

  @IsNotEmpty()
  @IsString()
  readonly role_name: string;

  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  readonly permissions: any[];
}

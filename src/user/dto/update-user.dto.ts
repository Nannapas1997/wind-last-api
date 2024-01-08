import { IsString, IsEmail, MinLength, IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ',
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  readonly etc?: string;

  @IsOptional()
  role_id?: number;
}

import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'รหัสผ่านต้องมากกว่า 8 ตัวอักษร' })
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
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly etc?: string;

  @IsOptional()
  role_id?: number;
}

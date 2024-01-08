import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string; // or email, depending on your requirements

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

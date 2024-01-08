import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() createAuthDto: LoginDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const ip = request.ip || request.connection.remoteAddress;
    const token = await this.authService.login(createAuthDto, ip);
    return res.json(token);
  }

  @UseGuards(AuthGuard)
  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    return await this.authService.validateToken(token);
  }

  @Post('check-token')
  async checkToken(
    @Body('token') token: string,
    @Body('projectName') projectName: string,
  ) {
    // console.log(token)
    return await this.authService.checkToken(token, projectName);
  }
}

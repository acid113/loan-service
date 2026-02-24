import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '#/auth/auth.service';
import { LoginDto } from '#/auth/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<{ token: string }> {
    try {
      return await this.service.login(body.username, body.password);
    } catch {
      throw new UnauthorizedException({ message: 'Invalid username or password' });
    }
  }
}

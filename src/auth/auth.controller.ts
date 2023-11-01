import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register.user.dto';
import { LoginUserDTO } from './dto/login.user.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  register(@Body() dataUserRegister: RegisterUserDTO): Promise<User> {
    return this.authService.register(dataUserRegister);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() dataLogin: LoginUserDTO): Promise<User> {
    return this.authService.login(dataLogin);
  }

  @Post('/refresh_token')
  refresh_token(@Body() dataRefreshToken: string) {
    return this.authService.refresh_token(dataRefreshToken);
  }
}

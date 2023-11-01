import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.user.dto';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hashPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(4);
    const passHash = await bcrypt.hash(pass, salt);

    return passHash;
  }

  async register(dataUserRegister: RegisterUserDTO): Promise<User> {
    const pass = await this.hashPassword(dataUserRegister.password);

    return await this.userRepository.save({
      ...dataUserRegister,
      password: pass,
      refresh_token: 'refresh_token',
    });
  }

  private async generateToken(payloadToken: { id: number; email: string }) {
    const access_Token = await this.jwtService.signAsync(payloadToken);
    const refresh_token = await this.jwtService.signAsync(payloadToken, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: '1d',
    });

    await this.userRepository.update(
      { email: payloadToken.email },
      { refresh_token: refresh_token },
    );

    return { access_Token, refresh_token };
  }

  async login(dataLogin: LoginUserDTO): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: dataLogin.email },
    });
    if (!user) {
      throw new HttpException('Email do not exit', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(dataLogin.password, user.password);
    if (!checkPass) {
      throw new HttpException('Password not match', HttpStatus.UNAUTHORIZED);
    }
    // generate access token and refresh token
    const payload = { id: user.id, email: user.email };
    this.generateToken(payload);
    return {
      user,
    };
  }

  async refresh_token(dataRefreshToken: string): Promise<any> {
    console.log('dataRefreshToken', dataRefreshToken);
    try {
      const verity = await this.jwtService.verifyAsync(
        dataRefreshToken['refresh_token'],
        {
          secret: this.configService.get<string>('SECRET'),
        },
      );
      console.log(verity);
      const checkExitToken = await this.userRepository.findOneBy({
        email: verity.email,
      });
      if (checkExitToken) {
        return this.generateToken({ id: verity.id, email: verity.email });
      }
    } catch (error) {
      throw new HttpException('Refresh Token fail', HttpStatus.BAD_REQUEST);
    }
  }
}

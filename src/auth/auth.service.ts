import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  register() {
    return 'REGISTER SUCCESS';
  }
  login() {
    return 'LOGIN SUCCESS ';
  }
}

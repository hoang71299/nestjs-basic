import { Body, Controller, Post, SerializeOptions, UseGuards } from '@nestjs/common'
import {
  LoginBodyDTO,
  LoginResDTO,
  logoutResDTO,
  refreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'

@Controller('auth')
@SerializeOptions({ type: RegisterResDTO })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    // return 'register'
    console.log('controler ...')
    const result = await this.authService.register(body)
    // return new RegisterResDTO(result);
    return result
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    const result = await this.authService.login(body)
    return new LoginResDTO(result)
  }
  @Post('refresh-token')
  async refreshToken(@Body() body: refreshTokenBodyDTO) {
    return this.authService.refreshToken(body.refreshToken)
  }

  @Post('logout')
  async logout(@Body() body: refreshTokenBodyDTO) {
    return new logoutResDTO(await this.authService.logout(body.refreshToken))
  }
}

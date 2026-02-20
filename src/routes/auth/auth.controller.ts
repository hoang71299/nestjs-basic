import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { RegisterBodyDTO, RegisterResDTO } from 'src/routes/auth/auth.dto';
import { AuthService } from 'src/routes/auth/auth.service';

@Controller('auth')
@SerializeOptions({ type: RegisterResDTO })
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    // return 'register'
    console.log('controler ...');
    const result = await this.authService.register(body);
    // return new RegisterResDTO(result);
    return result;
  }
}

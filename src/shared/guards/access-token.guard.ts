import { TokenService } from 'src/shared/services/token.service'
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constants'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    // Lấy access token từ header Authorization
    const authHeader = request.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    try {
      const decodeAccessToken = await this.tokenService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodeAccessToken
      return true
    } catch (error: any) {
      throw new UnauthorizedException()
    }
  }
}

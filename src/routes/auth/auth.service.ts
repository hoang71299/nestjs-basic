import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { LoginBodyDTO, RegisterBodyDTO } from 'src/routes/auth/auth.dto'
import { isNotFoundPrismaError, isUniqueConstraintError } from 'src/shared/helper'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) { }

  async register(body: RegisterBodyDTO) {
    try {
      const hashPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          name: body.name,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }
  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })
    if (!user) {
      throw new UnauthorizedException('Account not exits')
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])
    }
    const tokens = await this.generateToken({ userId: user.id })
    return tokens
  }

  async generateToken(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodeRefreshToken.exp * 1000),
      },
    })
    return { accessToken, refreshToken }
  }
  async refreshToken(refreshToken: string) {
    try {
      //kiem tra refresh token co hop le hay khong
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      // kiem tra xem refreshtoken co trong database ko
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })
      //xoa refresh token old
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })
      //tao access token va refresh token moi
      return this.generateToken({ userId })
    } catch (error) {
      // truong hop da refreshtoken roi hay thogn bao cho user biet
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is invoked')
      }
      throw new UnauthorizedException('Refresh token is invalid')
    }
  }

  async logout(refreshToken: string) {
    try {
      //kiem tra refresh token co hop le hay khong
      await this.tokenService.verifyRefreshToken(refreshToken)
      // kiem tra xem refreshtoken co trong database ko
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })
      return { message: 'Logout successfully' }
    } catch (error) {
      // truong hop da refreshtoken roi hay thogn bao cho user biet
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is invoked')
      }
      console.log("hhfhfh");
      throw new UnauthorizedException()
    }
  }
}

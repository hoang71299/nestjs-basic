import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { SuccessResponse } from 'src/shared/share.dto'

export class LoginBodyDTO {
  @IsString()
  email!: string

  @IsString()
  password!: string
}

export class LoginResDTO {
  accessToken!: string
  refreshToken!: string
  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}
export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name!: string

  @IsString()
  confirmPassword!: string
}

export class RegisterData {
  id!: number
  email!: string
  name!: string
  @Exclude() password!: string
  createdAt!: Date
  updatedAt!: Date
  constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial)
  }
}

export class RegisterResDTO extends SuccessResponse {
  @Type(() => RegisterData)
  declare data: RegisterData
  constructor(partial: Partial<RegisterResDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class refreshTokenBodyDTO {
  @IsString()
  refreshToken!: string
}

export class refreshTokenResDTO extends LoginBodyDTO {}

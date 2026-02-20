import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import 'dotenv/config'
import path from 'path'
//kiểm tra coi thử có file .env hay chưa
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('không tìm thấy file .env')
  process.exit(1)
}
class ConfigSchema {
  @IsString()
  DATABASE_URL!: string
  @IsString()
  ACCESS_TOKEN_SECRET!: string
  @IsString()
  REFRESH_TOKEN_SECRET!: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN!: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN!: string
  @IsString()
  SECRET_API_KEY!: string
}
const configServer = plainToInstance(ConfigSchema, process.env)
const e = validateSync(configServer)
if (e.length > 0) {
  console.log('các giá trị khai báo không hợp lệ')
  const errors = e.map((err) => {
    return {
      property: err.property,
      constraints: err.constraints,
      value: err.value,
    }
  })
  throw errors
}
const envConfig = configServer
export default envConfig

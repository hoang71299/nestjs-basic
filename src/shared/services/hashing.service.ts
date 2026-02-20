import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'
const saltOrRounds = 10
@Injectable()
export class HashingService {
  hash(value: string) {
    return hash(value, saltOrRounds)
  }
  compare(value: string, hashValue: string) {
    return compare(value, hashValue)
  }
}

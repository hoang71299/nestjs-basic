export class SuccessResponse {
  statusCode!: number
  data: any
  constructor(partial: Partial<SuccessResponse>) {
    Object.assign(this, partial)
  }
}

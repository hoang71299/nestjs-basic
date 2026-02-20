import { Type } from "class-transformer";
import { PostModel } from "src/shared/models/post.model";
import { UserModel } from "src/shared/models/user.model";

export class getPostItem extends PostModel {
  @Type(() => UserModel)
  author!: Omit<UserModel, 'password'>;
  constructor(partial: Partial<getPostItem>) {
    super(partial)
    Object.assign(this, partial)
  }
}
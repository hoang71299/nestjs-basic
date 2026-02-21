import { Type } from "class-transformer";
import { IsString } from "class-validator";
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

export class createPostBodyDTO {
  @IsString()
  title!: string
  @IsString()
  content!: string
}

export class updatePostBodyDTO extends createPostBodyDTO { }

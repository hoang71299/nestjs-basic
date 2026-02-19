import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getPosts() {
    return "all post 2"
  }
  createPost(body: any) {
    return body
  }
}

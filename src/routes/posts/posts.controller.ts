import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import type { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constants';
import { getPostItem } from 'src/routes/posts/post.dto';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) { }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getPosts(@Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].userId
    const posts = await this.postsService.getPosts(userId);
    return posts.map((post) => new getPostItem(post));
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createPost(@Body() body: any, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].userId
    return this.postsService.createPost(userId, body)
  }
}

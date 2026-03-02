import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import type { Request } from 'express';
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from 'src/shared/constants/auth.constants';
import { createPostBodyDTO, getPostItem, updatePostBodyDTO } from 'src/routes/posts/post.dto';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) { }

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  @Get()
  async getPosts(@ActiveUser('userId') userId: number) {

    const posts = await this.postsService.getPosts(userId);
    return posts.map((post) => new getPostItem(post));
  }
  @Auth([AuthType.Bearer])
  @Post()

  async createPost(@Body() body: createPostBodyDTO, @ActiveUser('userId') userId: number) {
    const result = await this.postsService.createPost(userId, body)
    return new getPostItem(result);
  }
  @Get(':id')
  async getPostItem(@Param('id') id: string) {
    const result = await this.postsService.getPostById(Number(id))
    return new getPostItem(result);
  }

  @Auth([AuthType.Bearer])
  @Put(':id')
  async updatePostItem(@Param('id') id: string, @Body() body: updatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return this.postsService.updatePost({
      postId: Number(id),
      userId,
      body
    })
  }
  @Auth([AuthType.Bearer])
  @Delete(':id')
  async deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.postsService.deletePost(Number(id), userId)
  }
}
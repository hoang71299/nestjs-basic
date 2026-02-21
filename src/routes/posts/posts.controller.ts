import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import type { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constants';
import { createPostBodyDTO, getPostItem, updatePostBodyDTO } from 'src/routes/posts/post.dto';
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
  async createPost(@Body() body: createPostBodyDTO, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].userId
    const result = await this.postsService.createPost(userId, body)
    return new getPostItem(result);
  }
  @Get(':id')
  async getPostItem(@Param('id') id: string) {
    const result = await this.postsService.getPostById(Number(id))
    return new getPostItem(result);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async updatePostItem(@Param('id') id: string, @Body() body: updatePostBodyDTO, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].userId
    return this.postsService.updatePost({
      postId: Number(id),
      userId,
      body
    })
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() request: Request) {
    const userId = request[REQUEST_USER_KEY].userId
    return this.postsService.deletePost(Number(id), userId)
  }
}
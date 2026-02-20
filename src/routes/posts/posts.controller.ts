import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }
  @Post()
  createPost(@Body() body: any) {
    return this.postsService.createPost(body)
  }
}

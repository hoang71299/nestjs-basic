/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common'
import { createPostBodyDTO, updatePostBodyDTO } from 'src/routes/posts/post.dto'
import { isNotFoundPrismaError } from 'src/shared/helper'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) { }
  getPosts(userId: number) {

    return this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          }
        }
      }
    }
    )
  }
  async createPost(userId: number, body: createPostBodyDTO) {
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          }
        }
      }
    })
  }
  async getPostById(postId: number) {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        include: {
          author: {
            omit: {
              password: true,
            }
          }
        }
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async updatePost({ postId, userId, body }: { postId: number, userId: number, body: updatePostBodyDTO }) {

    try {
      return await this.prismaService.post.update({
        where: {
          id: postId,
          authorId: userId
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: {
            omit: {
              password: true,
            }
          }
        }
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found or you are not the author of this post')
      }
      throw error
    }
  }

  async deletePost(postId: number, userId: number) {
    try {
      await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId
        },
        include: {
          author: {
            omit: {
              password: true,
            }
          }
        }
      })
      return true
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found or you are not the author of this post')
      }
      throw error
    }
  }
}
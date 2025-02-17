import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createArticle(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(createPostDto, file);
  }

  @Get()
  async fetchPosts() {
    return this.postService.fetchPosts();
  }

  @Get(':id')
  async fetchPostById(@Param('id') id: string) {
    return this.postService.fetchPostById(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.postService.updatePosts(+id, updatePostDto, image);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }
}

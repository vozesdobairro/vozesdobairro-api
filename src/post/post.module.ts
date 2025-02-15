import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PostController],
  providers: [PostService, ConfigService],
})
export class PostModule {}

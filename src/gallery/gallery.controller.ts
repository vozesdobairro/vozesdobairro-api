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
import { GalleryService } from './gallery.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addPhoto(
    @Body() createPostDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.addPhoto(createPostDto, file);
  }

  @Get()
  async fetchPhotos() {
    return this.galleryService.fetchPhotos();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePhoto(
    @Param('id') id: string,
    @Body() updatePostDto: UpdateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.updatePhotos(+id, updatePostDto, file);
  }

  @Delete(':id')
  async deletePhoto(@Param('id') id: string) {
    return this.galleryService.deletePhoto(+id);
  }
}

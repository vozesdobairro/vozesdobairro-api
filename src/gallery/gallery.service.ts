import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GalleryService {
  private supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
      {
        auth: { persistSession: false },
      },
    );
  }

  private BLOG_STORAGE_BUCKET = 'galeria';

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `public/${uuidv4()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(this.BLOG_STORAGE_BUCKET)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      throw new BadRequestException(
        `Erro ao fazer upload da imagem: ${error.message}`,
      );
    }

    return `${this.configService.get<string>('SUPABASE_URL')}/storage/v1/object/public/${this.BLOG_STORAGE_BUCKET}/${fileName}`;
  }

  async addPhoto(
    createGalleryDto: CreateGalleryDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = file ? await this.uploadImage(file) : null;
    const descricao = createGalleryDto.descricao;

    const { data, error } = await this.supabase
      .from('galeria')
      .insert([{ descricao, caminho_imagem: imageUrl }])
      .select();

    if (error) {
      throw new BadRequestException(`Erro ao criar galeria: ${error.message}`);
    }

    return data;
  }

  async fetchPhotos() {
    const { data, error } = await this.supabase
      .from('galeria')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Erro ao buscar artigos: ${error.message}`);
    }

    return data;
  }

  async updatePhotos(
    id: number,
    updateGalleryDto: UpdateGalleryDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = file ? await this.uploadImage(file) : null;
    const descricao = updateGalleryDto.descricao;

    const { data, error } = await this.supabase
      .from('galeria')
      .update([{ descricao, caminho_imagem: imageUrl }])
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(
        `Erro ao atualizar galeria: ${error.message}`,
      );
    }

    return data;
  }

  async deletePhoto(id: number) {
    const { data, error } = await this.supabase
      .from('galeria')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(
        `Erro ao excluir galeria: ${error.message}`,
      );
    }

    return data;
  }
}

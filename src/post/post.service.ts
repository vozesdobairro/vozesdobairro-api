import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
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

  private BLOG_STORAGE_BUCKET = 'artigos';

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

  async createPost(createPostDto: CreatePostDto, file: Express.Multer.File) {
    const imageUrl = file ? await this.uploadImage(file) : null;
    const titulo = createPostDto.titulo;
    const texto = createPostDto.texto;

    const { data, error } = await this.supabase
      .from('artigo')
      .insert([{ titulo, texto, caminho_imagem: imageUrl }])
      .select();

    if (error) {
      throw new BadRequestException(`Erro ao criar artigo: ${error.message}`);
    }

    return data;
  }

  async fetchPosts() {
    const { data, error } = await this.supabase
      .from('artigo')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Erro ao buscar artigos: ${error.message}`);
    }

    return data;
  }

  async updatePosts(
    id: number,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
  ) {
    const imageUrl = file ? await this.uploadImage(file) : null;
    const titulo = updatePostDto.titulo;
    const texto = updatePostDto.texto;

    const { data, error } = await this.supabase
      .from('artigo')
      .update([{ titulo, texto, caminho_imagem: imageUrl }])
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(
        `Erro ao atualizar artigo: ${error.message}`,
      );
    }

    return data;
  }

  async deletePost(id: number) {
    const { data, error } = await this.supabase
      .from('artigo')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(`Erro ao excluir artigo: ${error.message}`);
    }

    return data;
  }
}

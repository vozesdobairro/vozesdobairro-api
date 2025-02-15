import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaypalModule } from './paypal/paypal.module';
//import { AuthModule } from './auth/auth.module';
//import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { GalleryModule } from './gallery/gallery.module';
//import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { WiseModule } from './wise/wise.module';

@Module({
  imports: [
    PaypalModule,
    PostModule,
    GalleryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WiseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

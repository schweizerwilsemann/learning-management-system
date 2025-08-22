import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { MediaModule } from './media/media.module';
import { PaymentsModule } from './payments/payments.module';
import { CheckoutModule } from './payments/checkout.module';
import { TranscodeModule } from './transcode/transcode.module';
import { DatabaseModule } from './database/database.module';
import { ChaptersModule } from './chapters/chapters.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { CategoriesModule } from './categories/categories.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    MediaModule,
  PaymentsModule,
  CheckoutModule,
    TranscodeModule,
  ChaptersModule,
  AttachmentsModule,
  CategoriesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AppModule {}

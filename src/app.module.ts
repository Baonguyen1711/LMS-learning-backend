import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './lms/database.module';
import { LmsModule } from './lms/lms.module';

@Module({
  imports: [DatabaseModule, LmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigifyModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

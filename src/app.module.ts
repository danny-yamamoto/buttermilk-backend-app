import { Module } from '@nestjs/common';
import { HogeModule } from './hoge/hoge.module';

@Module({imports: [HogeModule]})
export class AppModule {}

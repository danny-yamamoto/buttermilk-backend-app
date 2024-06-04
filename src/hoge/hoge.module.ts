import { Module } from '@nestjs/common';
import { HogeService } from './hoge.service';
import { HogeController } from './hoge.controller';

@Module({
  controllers: [HogeController],
  providers: [HogeService],
})
export class HogeModule {}

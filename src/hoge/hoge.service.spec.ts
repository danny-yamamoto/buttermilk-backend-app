import { Test, TestingModule } from '@nestjs/testing';
import { HogeService } from './hoge.service';

describe('HogeService', () => {
  let service: HogeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HogeService],
    }).compile();

    service = module.get<HogeService>(HogeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

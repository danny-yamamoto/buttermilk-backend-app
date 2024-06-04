import { Test, TestingModule } from "@nestjs/testing";
import { HogeController } from "./hoge.controller";
import { HogeService } from "./hoge.service";

describe("HogeController", () => {
  let controller: HogeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HogeController],
      providers: [HogeService],
    }).compile();

    controller = module.get<HogeController>(HogeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

import { Controller, Get } from "@nestjs/common";
import { HogeService } from "./hoge.service";

@Controller("hoge")
export class HogeController {
  constructor(private readonly hogeService: HogeService) {}
  @Get()
  getHoge(): string {
    return "Hello from HogeController!";
  }
}

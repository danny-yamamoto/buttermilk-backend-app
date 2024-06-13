import { Module } from "@nestjs/common";
import { HogeModule } from "./hoge/hoge.module";
import { TodoModule } from "./todo/todo.module";

@Module({ imports: [HogeModule] })
export class AppModule {}

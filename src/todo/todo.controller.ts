import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { Todo as TodoModel } from "@prisma/client";

@Controller("todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() todoData: { content: string }): Promise<TodoModel> {
    const { content } = todoData;
    return this.todoService.create({ content });
  }

  @Get()
  findAll(): Promise<TodoModel[]> {
    return this.todoService.findAll({});
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<TodoModel | null> {
    return this.todoService.findOne({ id: Number(id) });
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() todoData: { content: string },
  ): Promise<TodoModel> {
    const { content } = todoData;
    return this.todoService.update({
      where: { id: Number(id) },
      data: { content: content },
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<TodoModel> {
    return this.todoService.remove({ id: Number(id) });
  }
}

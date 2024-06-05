import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, Todo } from "@prisma/client";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.TodoOrderByWithRelationInput;
  }): Promise<Todo[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.todo.findMany({ skip, take, cursor, where, orderBy });
  }

  async findOne(
    TodoWhereUniqueInput: Prisma.TodoWhereUniqueInput,
  ): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: TodoWhereUniqueInput });
  }

  async update(params: {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.TodoUpdateInput;
  }): Promise<Todo> {
    const { where, data } = params;
    return this.prisma.todo.update({ data, where });
  }

  async remove(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
    return this.prisma.todo.delete({ where });
  }
}

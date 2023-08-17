import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prismaService.category.create({
      data: createCategoryDto,
    });
    return category;
  }

  async findAll() {
    const categories = await this.prismaService.category.findMany({});
    return categories;
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.update({
      data: updateCategoryDto,
      where: {
        id,
      },
    });
    return category;
  }

  async remove(id: number) {
    const category = await this.prismaService.category.delete({
      where: {
        id,
      },
    });
    return category;
  }
}

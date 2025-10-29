import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./Dto/category.dto";
import { CategoryFilterDto } from "./Dto/findAllCategoryQueryDto";

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    async findAll(
        @Query() query: CategoryFilterDto
    ) {
        return this.categoryService.findAll(query);
    }

    @Post('new')
    async create(
        @Body() createServiceDto: CreateCategoryDto) {
        return this.categoryService.create(createServiceDto);
    }

}

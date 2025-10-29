import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCategoryDto } from "./Dto/category.dto";
import { db } from "src/config/db";
import { categories } from "src/schema";
import { CategoryFilterDto, columnMap } from "./Dto/findAllCategoryQueryDto";
import { and, sql } from "drizzle-orm";

@Injectable()
export class CategoryService {

    async create(dto: CreateCategoryDto){

        try {
            const dataToInsert = {
                name: dto.name,
                slug: dto.slug ?? dto.name.toLocaleLowerCase().replace(/\s+/g, '-'),
                description: dto.description
            }
            const [category] = await db.insert(categories).values(dataToInsert).returning();
            return {success: true, message: "Created Category Succussfully!"}

        } catch (error) {
            throw new InternalServerErrorException("Failed to create category");
        }
    }

    async findAll(filter: CategoryFilterDto){
        try {

            const {search, page = 1, limit = 10, slug, sortBy = 'createdAt', sortOrder= 'asc'} = filter;
            const whereConditions: any[] = [];
            if (search) {
                whereConditions.push(
                  sql `categories.name ILIKE ${'%' + search + '%'} OR categories.description ILIKE ${'%' + search + '%'}`
                );
            }

            if (slug) {
                whereConditions.push(sql`categories.slug = ${slug}`);
            }
            const offset = (page - 1) * limit;

            // total count for paginations
            const [{ count }] = await db
                .select({count: sql`count(*)`})
                .from(categories)
                .where(whereConditions.length ? and(...whereConditions) : undefined);

            const dbSortBy = columnMap[sortBy] || 'created_at';

            const data = await db
                .select()
                .from(categories)
                .where(whereConditions.length ? and(...whereConditions) : undefined)
                .orderBy(sql`${sql.raw(dbSortBy)} ${sql.raw(sortOrder)}`)
                .limit(limit)
                .offset(offset)

            return {
                success: true,
                message: "Find All Categories!",
                data: data || [],
                total: Number(count),
                page,
                limit
            };
        } catch (error) {
             console.error(error)
             throw new InternalServerErrorException("Failed to fetch categories");
        }
    }
}

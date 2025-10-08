// course/dto/create-course.dto.ts

import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  Min,IsNotEmpty,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString({ message: 'Course Name is required' })

  courseName: string;
  @IsNotEmpty()
  @IsString({ message: 'Course Title is required' })
  courseTitle: string;

  @IsNotEmpty()
  @IsString({ message: 'Course Thumbnail is required' })
  courseThumbnail: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  price?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount cannot be negative' })
  discount?: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}

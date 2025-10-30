// course/dto/create-course.dto.ts

import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  Min,
  MaxLength,
  IsArray,
} from 'class-validator';

export enum CourseStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Course Title is required' })
  @IsString()
  courseTitle: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @IsNotEmpty({ message: 'Course thumbnail is required' })
  @IsString()
  courseThumbnail: string;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'Invalid course status' })
  status?: CourseStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(CourseLevel, { message: 'Level must be beginner, intermediate, or advanced' })
  level?: CourseLevel;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  @IsArray()
  tags?: []; // can be comma-separated string (e.g., "ts,js,react")

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  price?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount cannot be negative' })
  discount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description is too long' })
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  whatYouWillLearn?: string;

  @IsOptional()
  @IsString()
  promoVideoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'Published date must be a valid ISO date string' })
  publishedAt?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Enrollment deadline must be a valid ISO date string' })
  enrollmentDeadline?: string;
}


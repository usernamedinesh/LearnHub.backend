import { Injectable } from "@nestjs/common";
import { Course } from "src/schema/type";
import { ICourses } from "./interfaces/course.interface";
import { CreateCourseDto } from "./dto/create-course.dto";
import { db } from "src/config/db";
import { course } from "src/schema";

@Injectable()
export class CourseService{
    private readonly courses: Course;

    // Create course
    // Get all course
    getAllCourse() {
        const course: ICourses = {
            id: 2,
            courseName: "Javascript mastery",
            courseTitle:"Beginer to mastery Javascript",
            courseThumbnail:"thumbnail_of_iamge",
            description:"You wil ear everyting about javascipt int his course",
            createdAt: null,
            discount:20,
            price: 200,
            tags:["javascript", "programming"],
            updatedAt: null,
        }
        return {
            success: true,
            message: "fetched all cours",
            course: course,
        }
    }
    //create course
    async create_course (createCourseDto: CreateCourseDto, userId: number) {
        console.log("createCourseDto==>>", createCourseDto);
        const saved_data = await db.transaction(async (tx) => {
            const [createdCourse] = await tx
            .insert(course)
            .values({
                ...createCourseDto,
                instructorId: userId,
            })
            .returning();
            return createdCourse;
        })
        return {
            success: true,
            message:"course created successfully!",
            data: saved_data,
        }
    }
    // Get single courses
    // Delete course
    // Update course
}

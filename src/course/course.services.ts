import { Injectable, NotFoundException } from "@nestjs/common";
import { Course } from "src/schema/type";
import { courseFilter, ICourses } from "./interfaces/course.interface";
import { CreateCourseDto } from "./dto/create-course.dto";
import { db } from "src/config/db";
import { course, instructorProfiles } from "src/schema";
import { eq, and, sql } from "drizzle-orm";
import slugify from "slugify";

@Injectable()
export class CourseService{
    // private readonly courses: Course;

    // Get all course
    async getAllCourse() {
        const course  = await db.query.course.findMany({
            with: {
                instructor: {
                    with: {
                        user: true,
                    },
                },
            }
        })

        const cleanedCourses = course.map((course) => ({
          id: course.id,
          courseTitle: course.courseTitle,
          courseThumbnail: course.courseThumbnail,
          isActive: course.isActive,
          tags: course.tags,
          price: course.price,
          discount: course.discount,
          description: course.description,
          instructor: {
            instructorId: course.instructor.id,
            fullName: course.instructor.userId,
            ChannleName: course.instructor.channelName,
            expertise: course.instructor.expertise,
            socialLinks: course.instructor.socialLinks,
          },
        }));

        if (!course || course.length === 0) {
            throw new NotFoundException("No Course Found");
        }
        return {
            success: true,
            message: "Fetched All Course",
            data: cleanedCourses,
        }
    }

    // get course by instructor
    async get_course_by_instructor (instructorId: number) {

        const validInstructorId = await db.query.instructorProfiles.findFirst({
            where: eq(instructorProfiles.id, instructorId),
        })

        console.log("INSTRUCTORJ",validInstructorId)

        if (!validInstructorId) {
            throw new NotFoundException("Invalid instructor ID")
        }

        const courses = await db.query.course.findMany({
            where: eq(course.instructorId, instructorId),
            with: {
                instructor: {
                    with: {
                      user: true,
                    }
                }
            }
        })

        console.log("COURSE: ", courses);

        if (!course) {
            throw new NotFoundException("No Course Found");
        }
        return {
            success: true,
            message: "Fetched Course by InstructorId",
            data: courses,
        }
    }

    //create course
    async create_course (createCourseDto: CreateCourseDto, instructorId: number) {

        // Check if the instructorId is valid or not
        const validInstructorId = await db.query.instructorProfiles.findFirst({
            where: eq(instructorProfiles.id, instructorId),
        })

        if (!validInstructorId) {
            throw new NotFoundException("Invalid instructor ID");
        }
          // ✅ Generate slug safely
          const slug = createCourseDto.slug
            ? slugify(createCourseDto.slug, { lower: true, strict: true })
            : slugify(createCourseDto.courseTitle, { lower: true, strict: true });

        const courseData = {
          instructorId,
          slug,
          ...createCourseDto,
          publishedAt: createCourseDto.publishedAt ? new Date(createCourseDto.publishedAt) : undefined,
          enrollmentDeadline: createCourseDto.enrollmentDeadline ? new Date(createCourseDto.enrollmentDeadline) : undefined,
        };

          // ✅ Save course in transaction
          const savedData = await db.transaction(async (tx) => {
            const [createdCourse] = await tx
              .insert(course)
              .values(courseData)
              .returning();
            return createdCourse;
          });

        return {
            success: true,
            message:"Course Created Successfully!",
            data: savedData,
        }
    }
    // Get single courses

    // Delete course
    async delete_course (courseId: string) {
        const validCourseId = await db.query.course.findFirst({
            where: eq(course.id, courseId),
        })

        if (!validCourseId) {
            throw new NotFoundException("Invalid Course ID");
        }

      await db.delete(course).where(eq(course.id, courseId));

       return {
          success: true,
          message: 'Course deleted successfully',
       };
    }
    // Update course

    //Search Course
    async searchCourses(searchText: string | null, filters: courseFilter) {
      const conditions = [eq(course.isActive, true)];

      if (searchText) {
        // conditions.push(
        //   sql`courses.search_text_vector @@ websearch_to_tsquery('english', ${searchText})`
        // );
         conditions.push(
              sql`courses.search_vector @@ websearch_to_tsquery('english', ${searchText})`
          );
      }

      if (filters.categoryId) {
        conditions.push(eq(course.categoryId, filters.categoryId));
      }

      if (filters.level && filters.level !== 'all') {
        conditions.push(eq(course.level, filters.level));
      }

      const searchResult = await db
        .select()
        .from(course)
        .where(and(...conditions))
        .limit(50);

      return {
        success: true,
        message: "Course Search Successfully!",
        data: searchResult,
      };
    }
}

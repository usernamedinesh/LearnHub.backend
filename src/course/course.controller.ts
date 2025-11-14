/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Post, Delete, Put, Body, UseGuards,Request } from "@nestjs/common";
import { CourseService } from "./course.services";
import { CreateCourseDto } from "./dto/create-course.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.decorator";
import { userRole } from "src/schema/type";
import type { RequestWithUser } from "src/common/interface/request_interface";
import { Admin } from "src/common/decorator/role.protected.decorator";
import { CreateCategoryDto } from "src/category/Dto/category.dto";
import { courseFilter } from "./interfaces/course.interface";

@Controller('course')
export class Course{
    constructor(private readonly courseService: CourseService){}
    // GET all Course
    @Get()
    async findAll() {
        return await this.courseService.getAllCourse();
    }

    // GET single course
    @Get(':id')
    async getSingleCourse (@Param('id') id: number){
        return `sigle course with id${id}`;
    }

    // GET All Course By Instructor
    @Get('instructor/:InstructorId')
    async getCourseByInstructor (@Param('InstructorId') id: number){
        console.log("InstructorID==>>>>>>>>", id)
        return await this.courseService.get_course_by_instructor(id);
    }

    //CREATE COURSE
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(userRole.Instructor)
    @Post('new')
    createCourse(@Request() req: RequestWithUser, @Body() createCourse: CreateCourseDto) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // const userId: number = (req.user as any).userId
        const userId = (req as any).user.userId;
        return this.courseService.create_course(createCourse, userId)
    }

    //DELETE post here
    @Admin()
    @Delete('del/:id')
    deleteCourse( @Param('id') id: string, @Request() req: RequestWithUser) {
        return this.courseService.delete_course(id)
    }

    @Put('update')
    updateCourse(){
        return "UPDATE COURSE HERE !"
    }

    @Get('search')
    searchCourse(){
        let filter: courseFilter
        return this.courseService.searchCourses("courses", filter);
    }
}

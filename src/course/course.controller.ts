/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, Post, Delete, Put, Body, UseGuards,Request } from "@nestjs/common";
import { CourseService } from "./course.services";
import { CreateCourseDto } from "./dto/create-course.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.decorator";
import { userRole } from "src/schema/type";
import type { RequestWithUser } from "src/common/interface/request_interface";

@Controller('course')
export class Course{
    constructor(private readonly courseService: CourseService){}
    // GET all Course
    @Get()
    findAll() {
        return this.courseService.getAllCourse();
    }

    // GET single course
    @Get(':id')
    getSingleCourse (@Param('id') id: number){
        return `sigle course with id${id}`;
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
    @Delete('del')
    deleteCourse() {
        return "DELETE POST HERE !"
    }

    @Put('update')
    updateCourse(){
        return "UPDATE COURSE HERE !"
    }
}

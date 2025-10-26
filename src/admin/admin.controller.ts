import { Controller, Get, Param, Patch, Request, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "src/common/decorator/role.protected.decorator";
import * as request_interface from 'src/common/interface/request_interface';
import { GetInstructorQueryDto } from "./dto/instructorQuery";

@Controller('admin')
@Admin()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('instructor-request')
    async getAllInstructorRequest() {
        return await this.adminService.getPendingInstructorReq();
    }

    @Admin()
    @Patch('approve-instructor/:instructorId')
    async approveInstructor(@Param('instructorId') instructorId: string, @Request() req: request_interface.RequestWithUser) {
        const adminId = req.user.userId
        return await this.adminService.approveInstructorRequest(Number(instructorId), adminId);
    }

    @Admin()
    @Get("instructor")
    async getApprovedInstructor(
        @Query() query: GetInstructorQueryDto,
        @Request() req: request_interface.RequestWithUser) {
        const adminId = req.user.userId;
        const {search, limit, page} = query;
        return await this.adminService.getApprovedInstructor(adminId, search, page, limit );
    }

}

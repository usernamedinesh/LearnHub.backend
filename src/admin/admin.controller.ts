import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminService } from "./admin.service";

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('instructor-request')
    async getAllInstructorRequest() {
        return await this.adminService.getPendingInstructorReq();
    }

    @Patch('approve-instructor/:userId')
    async approveInstructor(@Param('userId') userId: string) {
        return this.adminService.approveInstructorRequest(Number(userId));
    }

}
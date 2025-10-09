import { Controller, Get, Param, Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "src/common/decorator/role.protected.decorator";

@Controller('admin')
@Admin()
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

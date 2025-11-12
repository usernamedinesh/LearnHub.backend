import { Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { eq, and } from "drizzle-orm";
import { db } from "src/config/db";
import { instructorProfiles, users } from "src/schema";
import { userRole } from "src/schema/type";
import { success } from "zod";

@Injectable()
export class AdminService{
    //To GET all pening Instructor
    async getPendingInstructorReq(){
        const pending = await db.query.instructorProfiles.findMany({
            where: eq(instructorProfiles.approved, false),
        })

        return {
            success: true,
            data: pending,
        }
    }

    //To Approved the INSTRUCTOR
     async approveInstructorRequest(instructorId: number, adminId: number) {

     //Validate if the instructorId & adminId is Valid
     const instructor = await db.query.instructorProfiles.findFirst({
        where: and(
            eq(instructorProfiles.id, instructorId),
            eq(instructorProfiles.approved , false)
        )
     })

     const admin = await db.query.users.findFirst({
          where: and(
              eq(users.id, adminId),
              eq(users.role, userRole.Admin)
          )
      })

     if (!instructor) {
          throw new NotFoundException('Instructor not found or already approved');
      }

     if (!admin) {
          throw new UnauthorizedException('Only Admin can perform this ');
      }

    // 1. Approve instructor profile
    await db.update(instructorProfiles).set({
      approved: true,
      approvedAt: new Date(),
    }).where(eq(instructorProfiles.userId, instructorId));

    // 2. Update user role
    await db.update(users).set({
      role: userRole.Instructor,
    }).where(eq(users.id, instructorId));

     return {
        status: 'success',
        message: 'Instructor approved successfully.',
     };
   }

    async getApprovedInstructor(adminId: number) {

     const admin = await db.query.users.findFirst({
          where: and(
              eq(users.id, adminId),
              eq(users.role, userRole.Admin)
          )
      })

     if (!admin) {
          throw new UnauthorizedException('Only Admin can perform this ');
      }

        const ApprovedInstructor = await db.query.instructorProfiles.findMany({
            where:  eq(instructorProfiles.approved, true),
        })

        if (!ApprovedInstructor || ApprovedInstructor.length === 0) {
            throw new NotFoundException("No Instructor found!");
        }

        return {
            success: true,
            message:"Instructor fetched successfully",
            data: ApprovedInstructor,
        }
    }
}

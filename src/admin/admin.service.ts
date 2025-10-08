import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/config/db";
import { instructorProfiles, users } from "src/schema";
import { userRole } from "src/schema/type";

@Injectable()
export class AdminService{
    async getPendingInstructorReq(){
        const pending = await db.query.instructorProfiles.findMany({
            where: eq(instructorProfiles.approved, false),
        })

        return {
            success: true,
            data: pending,
        }
    }

     async approveInstructorRequest(userId: number) {
    // 1. Approve instructor profile
    await db.update(instructorProfiles).set({
      approved: true,
      approvedAt: new Date(),
    }).where(eq(instructorProfiles.userId, userId));

    // 2. Update user role
    await db.update(users).set({
      role: userRole.Instructor,
    }).where(eq(users.id, userId));

    return {
      status: 'success',
      message: 'Instructor approved successfully.',
    };
  }
}

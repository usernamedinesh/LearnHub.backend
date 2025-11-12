import { Injectable, OnModuleInit } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "src/config/db";
import { env } from "src/config/env.config";
import { users } from "src/schema";
import { CreateUserDto } from "src/users/user.dto";
import { UserService } from "src/users/user.service";

@Injectable()
export class AdminSeederService implements OnModuleInit {
    constructor (private readonly userSerivce: UserService) {};
    async onModuleInit() {
      const IsAdmin = await db.query.users.findFirst({
            where: eq(users.email , "borod9200@gmail.com")
        })

        if (IsAdmin) {
            console.log("xxxxxxxxxxxxxxx Admin Already Existxxxxxxxxxxxxxxx");
            return;

          // DELETING
            await db
            .delete(users)
            .where(eq(users.email, env.EMAIL))
            .returning();
        }

     const createUserDto: CreateUserDto =  {
               fullName:env.FULL_NAME,
               email: env.EMAIL,
               password: env.PASSWORD,
               phoneNumber:env.PHONENUMBER,
               role: env.ROLE,
               state: "Assam",
               profilePicture: env.PIC,
               dateOfBirth: env.DOB
        }

        await this.userSerivce.create(createUserDto)
        console.log("************* ADMIN CREATED SUCCESSFULLY! *************");
    }
}


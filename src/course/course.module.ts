import { Module} from "@nestjs/common";
import { Course as CourseControler} from "./course.controller";
import { CourseService } from "./course.services";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[AuthModule],
    controllers: [CourseControler],
    providers: [CourseService],
})

export class CourseModule {};
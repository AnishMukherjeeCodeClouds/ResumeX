import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { DbModule } from "src/db/db.module";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";

@Module({
  imports: [AuthModule, DbModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}

import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ResumeController } from "./resume.controller";

@Module({
  imports: [AuthModule],
  controllers: [ResumeController],
})
export class ResumeModule {}

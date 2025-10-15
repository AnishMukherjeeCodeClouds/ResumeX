import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller("resume")
@UseGuards(JwtGuard)
export class ResumeController {
  @Get()
  getResume() {
    return { message: "This is the resume endpoint." };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { type Request } from "express";
import { ZodResponse } from "nestjs-zod";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import {
  CreateResumeReqDto,
  CreateResumeResDto,
} from "./dtos/create-resume.dto";
import { GetAllResumesResDto } from "./dtos/get-all-resumes.dto";
import { ResumeService } from "./resume.service";

@ApiBearerAuth()
@Controller("resume")
@UseGuards(JwtGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get("all")
  @ZodResponse({
    type: GetAllResumesResDto,
    description: "Get all resumes for the current user",
    status: HttpStatus.OK,
  })
  async getAllResumes(@Req() req: Request) {
    const allResumes = await this.resumeService.fetchAllResumes(req.user!.id);
    return {
      message: "Fetched all resumes for the current user successfully",
      resumes: allResumes,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(":id")
  getResume(@Param("id") resumeId: string) {
    this.resumeService.fetchResume(resumeId);

    return {
      hello: "world",
    };
  }

  @Post("create")
  @ZodResponse({
    type: CreateResumeResDto,
    description: "Create a resume",
    status: HttpStatus.CREATED,
  })
  async createResume(
    @Req() req: Request,
    @Body() createResumeReqDto: CreateResumeReqDto,
  ) {
    await this.resumeService.createResume(req.user!.id, createResumeReqDto);
    return {
      message: "Created resume successfully",
      statusCode: HttpStatus.CREATED,
    };
  }

  updateResume() {}

  deleteResume() {}
}

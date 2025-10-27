import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { type Request } from "express";
import { ZodResponse, ZodValidationPipe } from "nestjs-zod";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import {
  CreateResumeReqDto,
  CreateResumeResDto,
} from "./dtos/create-resume.dto";
import { IdRequestDtoSchema } from "./dtos/id-request.dto";
import { UpdateResumeReqDto } from "./dtos/update-resume.dto";
import { ResumeService } from "./resume.service";

@ApiBearerAuth()
@Controller("resume")
@UseGuards(JwtGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get("/all")
  @HttpCode(HttpStatus.OK)
  async getAllResumeInitialData(@Req() req: Request) {
    const resumeData = await this.resumeService.fetchAllResumeInitialData(
      req.user!.id,
    );

    return {
      message: "Fetched Initial Data For All Resume Successfully",
      resumes: resumeData,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getResume(
    @Req() req: Request,
    @Param("id", new ZodValidationPipe(IdRequestDtoSchema))
    resumeId: string,
  ) {
    const resumeData = await this.resumeService.fetchResume(
      req.user!.id,
      resumeId,
    );

    return {
      message: "Fetched resume successfully",
      resumeData,
      statusCode: HttpStatus.OK,
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

  @Patch("edit/:id")
  @HttpCode(HttpStatus.OK)
  async editResume(
    @Req() req: Request,
    @Param("id", new ZodValidationPipe(IdRequestDtoSchema)) resumeId: string,
    @Body() updateResumeReqDto: UpdateResumeReqDto,
  ) {
    await this.resumeService.editResume(
      req.user!.id,
      resumeId,
      updateResumeReqDto,
    );

    return {
      message: "Updated resume successfully",
      statusCode: HttpStatus.OK,
    };
  }

  @Delete("delete/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResume(
    @Req() req: Request,
    @Param("id", new ZodValidationPipe(IdRequestDtoSchema)) resumeId: string,
  ) {
    await this.resumeService.deleteResume(req.user!.id, resumeId);
  }
}

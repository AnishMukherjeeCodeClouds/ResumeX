import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Resume } from "src/db/schemas/resume.schema";
import { CreateResumeReqDto } from "./dtos/create-resume.dto";

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async fetchAllResumes(userId: string) {
    try {
      return await this.resumeModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  fetchResume(resumeId: string) {
    console.log(resumeId);
  }

  async createResume(userId: string, createResumeReqDto: CreateResumeReqDto) {
    try {
      await this.resumeModel.create({
        userId,
        ...createResumeReqDto,
      });
    } catch (error) {
      throw new BadRequestException(
        (error as Error).name,
        (error as Error).message,
      );
    }
  }
}

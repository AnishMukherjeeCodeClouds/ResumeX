import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resume } from "src/db/schemas/resume.schema";
import { CreateResumeReqDto } from "./dtos/create-resume.dto";
import { UpdateResumeReqDto } from "./dtos/update-resume.dto";

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async fetchAllResumes(userId: string) {
    try {
      return await this.resumeModel.find({
        userId,
      });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async fetchResume(userId: string, resumeId: string) {
    try {
      const targetResume = await this.resumeModel.findOne({
        userId,
        _id: resumeId,
      });

      if (targetResume == null) throw new NotFoundException("Resume not found");

      return targetResume;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException((error as Error).message);
    }
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

  async editResume(
    userId: string,
    resumeId: string,
    editDetails: UpdateResumeReqDto,
  ) {
    function flatten<T>(obj: T, prefix = ""): Record<string, any> {
      const result: Record<string, unknown> = {};
      for (const key in obj) {
        if (
          obj[key] &&
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(result, flatten(obj[key], `${prefix}${key}.`));
        } else {
          result[`${prefix}${key}`] = obj[key];
        }
      }
      return result;
    }
    try {
      const updateResult = await this.resumeModel.updateOne(
        { userId, _id: resumeId },
        { $set: flatten(editDetails) },
      );

      if (updateResult.matchedCount === 0)
        throw new NotFoundException("Resume not found");
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException((error as Error).message);
    }
  }

  async deleteResume(userId: string, resumeId: string) {
    try {
      const deletionResult = await this.resumeModel.deleteOne({
        userId,
        _id: resumeId,
      });

      if (deletionResult.deletedCount === 0)
        throw new NotFoundException("Resume not found");
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException((error as Error).message);
    }
  }
}

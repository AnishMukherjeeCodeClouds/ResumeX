import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resume } from "src/db/schemas/resume.schema";
import { CreateResumeReqDto } from "./dtos/create-resume.dto";
import { GetResumeResDataSchema } from "./dtos/get-one-resume.dto";
import { UpdateResumeReqDto } from "./dtos/update-resume.dto";

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async fetchAllResumeInitialData(userId: string) {
    try {
      return (
        await this.resumeModel.find(
          {
            userId,
          },
          { _id: true, title: true, template: true, createdAt: true },
        )
      ).map(({ _id, title, template, createdAt }) => ({
        id: _id.toString(),
        title,
        template,
        createdAt,
      }));
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

      return GetResumeResDataSchema.parse(targetResume.toObject());
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
    try {
      console.log(editDetails);
      const updateResult = await this.resumeModel.findOneAndUpdate(
        { userId, _id: resumeId },
        editDetails,
        { new: true },
      );

      if (!updateResult) throw new NotFoundException("Resume not found");
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

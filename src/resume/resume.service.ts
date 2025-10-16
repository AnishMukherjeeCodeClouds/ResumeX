import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Resume} from 'src/db/schemas/resume.schema';

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {
  }

  async whatever() {
    await this.resumeModel.create({
      personalDetails: {},
    });
  }
}





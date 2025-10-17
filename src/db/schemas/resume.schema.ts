import { BadRequestException } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({ _id: false })
class PersonalDetails {
  @Prop({ required: true })
  fullName: string;
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;
  @Prop()
  phone?: string;
  @Prop()
  address?: string;
}

@Schema({ _id: false })
class Socials {
  @Prop()
  linkedIn?: string;
  @Prop()
  twitter?: string;
  @Prop()
  github?: string;
  @Prop()
  portfolio?: string;
}

@Schema({ _id: false })
class Experience {
  @Prop({ required: true })
  organization: string;
  @Prop({ required: true })
  position: string;
  @Prop({ type: Date, required: true })
  startDate: Date;
  @Prop({ type: Date })
  endDate?: Date;
  @Prop()
  description?: string;
}

@Schema({ _id: false })
class Education {
  @Prop({ required: true })
  institution: string;
  @Prop({ type: Date, required: true })
  startDate: Date;
  @Prop({ type: Date })
  endDate?: Date;
  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
class Skill {
  @Prop({ required: true })
  name: string;
  @Prop({ type: [String], required: true })
  keywords?: string[];
}

@Schema({ _id: false })
class Project {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [String], required: true })
  technologies: string[];
  @Prop()
  liveLink?: string;
  @Prop()
  githubLink?: string;
  @Prop({ type: Date, required: true })
  startDate: Date;
  @Prop({ type: Date })
  endDate?: Date;
}

@Schema({ _id: false })
class Certification {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  issuer: string;
  @Prop({ type: Date, required: true })
  date: Date;
  @Prop({ required: true })
  url: string;
}

const PersonalDetailsSchema = SchemaFactory.createForClass(PersonalDetails);
const SocialsSchema = SchemaFactory.createForClass(Socials);
const ExperienceSchema = SchemaFactory.createForClass(Experience);
const EducationSchema = SchemaFactory.createForClass(Education);
const SkillSchema = SchemaFactory.createForClass(Skill);
const ProjectSchema = SchemaFactory.createForClass(Project);
const CertificationSchema = SchemaFactory.createForClass(Certification);

ExperienceSchema.pre("validate", function (next) {
  const doc = this as HydratedDocument<Experience>;
  if (doc.endDate && doc.startDate > doc.endDate)
    return next(
      new BadRequestException("Start date should be earlier than end date"),
    );

  next();
});

EducationSchema.pre("validate", function (next) {
  const doc = this as HydratedDocument<Education>;
  if (doc.endDate && doc.startDate > doc.endDate) {
    return next(
      new BadRequestException("Start date should be earlier than end date"),
    );
  }
  next();
});

ProjectSchema.pre("validate", function (next) {
  const doc = this as HydratedDocument<Project>;
  if (doc.endDate && doc.startDate > doc.endDate) {
    return next(
      new BadRequestException("Start date should be earlier than end date"),
    );
  }
  next();
});

CertificationSchema.pre("validate", function (next) {
  const doc = this as HydratedDocument<Certification>;
  if (doc.date > new Date())
    return next(new BadRequestException("Invalid certification date"));
  next();
});

@Schema({ timestamps: true })
export class Resume {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true, minLength: 2, maxlength: 255 })
  title: string;

  @Prop({ trim: true, maxlength: 1000, default: "" })
  summary?: string;

  @Prop({ type: PersonalDetailsSchema, required: true })
  personalDetails: PersonalDetails;

  @Prop({ type: SocialsSchema, default: {} })
  socials?: Socials;

  @Prop({ type: [ExperienceSchema], default: [] })
  experiences?: Experience[];

  @Prop({ type: [EducationSchema], default: [] })
  educations?: Education[];

  @Prop({ type: [SkillSchema], default: [] })
  skills: Skill[];

  @Prop({ type: [ProjectSchema], default: [] })
  projects?: Project[];

  @Prop({ type: [CertificationSchema], default: [] })
  certifications?: Certification[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
ResumeSchema.index({
  userId: 1,
});

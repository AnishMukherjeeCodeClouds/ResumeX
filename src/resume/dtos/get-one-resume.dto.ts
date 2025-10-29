import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";
import {
  CertificationSchema,
  CreateResumeReqDtoSchema,
  EducationSchema,
  ExperienceSchema,
  ProjectSchema,
} from "./create-resume.dto";

function toDateString(d: Date): string;
function toDateString(d: Date | null | undefined): string | undefined;
function toDateString(d: Date | null | undefined): string | undefined {
  return d ? d.toISOString().split("T")[0] : undefined;
}

export const ExperienceResSchema = z
  .object({
    ...ExperienceSchema.shape,
    startDate: z.date(),
    endDate: z.date().nullish(),
  })
  .transform((exp) => ({
    ...exp,
    startDate: toDateString(exp.startDate),
    endDate: toDateString(exp.endDate),
  }));

const EducationResSchema = z
  .object({
    ...EducationSchema.shape,
    startDate: z.date(),
    endDate: z.date().nullish(),
  })
  .transform((edu) => ({
    ...edu,
    startDate: toDateString(edu.startDate),
    endDate: toDateString(edu.endDate),
  }));

const ProjectResSchema = z
  .object({
    ...ProjectSchema.shape,
    startDate: z.date(),
    endDate: z.date().nullish(),
  })
  .transform((proj) => ({
    ...proj,
    startDate: toDateString(proj.startDate),
    endDate: toDateString(proj.endDate),
  }));

const CertificationResSchema = z
  .object({
    ...CertificationSchema.shape,
    date: z.date(),
  })
  .transform((cert) => ({
    ...cert,
    date: toDateString(cert.date),
  }));

export const GetResumeResDataSchema = CreateResumeReqDtoSchema.extend({
  id: z.string().optional(),
  experiences: z.array(ExperienceResSchema),
  educations: z.array(EducationResSchema),
  projects: z.array(ProjectResSchema),
  certifications: z.array(CertificationResSchema),
});

export const GetResumeResDtoSchema = z.object({
  message: z.string(),
  resumeData: GetResumeResDataSchema,
  statusCode: z.enum(HttpStatus),
});

export class GetResumeResDto extends createZodDto(GetResumeResDtoSchema) {}

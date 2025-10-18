import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

function dateRefine<T extends { startDate: Date; endDate?: Date }>(data: T) {
  const today = new Date();
  if (data.startDate > today) return false;

  if (data.endDate) {
    return data.startDate <= data.endDate && data.endDate <= new Date();
  }
  return true;
}

const DateSchema = (error?: string) => z.iso.date(error).pipe(z.coerce.date());

const PersonalDetailsSchema = z.object(
  {
    fullName: z.string("Full name is required"),
    email: z.email("Email is required").trim().toLowerCase(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .optional(),
    address: z.string().optional(),
  },
  "Personal details are required",
);

const SocialsSchema = z.object({
  linkedIn: z
    .url("Invalid LinkedIn URL")
    .regex(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
      "Invalid LinkedIn profile URL",
    )
    .optional(),

  X: z
    .url("Invalid X (Twitter) URL")
    .regex(
      /^https:\/\/(www\.)?(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/,
      "Invalid X (Twitter) profile URL",
    )
    .optional(),

  github: z
    .url("Invalid GitHub URL")
    .regex(
      /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
      "Invalid GitHub profile URL",
    )
    .optional(),

  portfolio: z.url("Invalid portfolio URL").optional(),
});

const ExperienceSchema = z
  .object({
    organization: z.string("Organization name is required"),
    position: z.string("Experience position is required"),
    startDate: DateSchema("Experience start date is required"),
    // startDate: z.iso
    //   .date("Experience start date is required")
    //   .pipe(z.coerce.date()),
    // endDate: z.iso.date().pipe(z.coerce.date()).optional(),
    endDate: DateSchema().optional(),
    description: z.string().optional(),
  })
  .refine(dateRefine, "Invalid experience dates");

const EducationSchema = z
  .object({
    institution: z.string("Institution is required"),
    description: z.string("Education description is required"),
    startDate: DateSchema("Education start date is required"),
    // startDate: z.iso
    //   .date("Education start date is required")
    //   .pipe(z.coerce.date()),
    // endDate: z.iso.date().pipe(z.coerce.date()).optional(),
    endDate: DateSchema().optional(),
  })
  .refine(dateRefine, "Invalid education dates");

const SkillSchema = z.object({
  name: z.string("Skill name is required"),
  keywords: z
    .array(z.string(), "Keywords for skills are required")
    .nonempty("At least one skill keyword is required"),
});

const ProjectSchema = z
  .object({
    name: z.string("Project name is required"),
    description: z.string("Project description is required"),
    technologies: z
      .array(z.string(), "Project technologies are required")
      .nonempty("At least one project technology is required"),
    liveLink: z.url().optional(),
    githubLink: z.url().regex(new RegExp("https://github.com/*")).optional(),
    startDate: DateSchema("Project start date is required"),
    // startDate: z.iso
    //   .date("Project start date is required")
    //   .pipe(z.coerce.date()),
    // endDate: z.iso.date().pipe(z.coerce.date()).optional(),
    endDate: DateSchema().optional(),
  })
  .refine(dateRefine, "Invalid project dates");

const CertificationSchema = z
  .object({
    title: z.string("Certification title is required"),
    issuer: z.string("Certification issuer is required"),
    date: DateSchema("Certification date is required"),
    // date: z.iso.date("Certification date is required").pipe(z.coerce.date()),
    url: z.url("Certification url is required"),
  })
  .refine((data) => data.date <= new Date(), "Invalid certification date");

export const CreateResumeReqDtoSchema = z.object({
  title: z
    .string("Resume title is required")
    .min(2, "Title should be at least 2 characters")
    .max(255, "Title should be at most 255 characters"),
  summary: z
    .string()
    .max(1000, "Summary should be at most 1000 characters")
    .optional(),
  personalDetails: PersonalDetailsSchema,
  socials: SocialsSchema.optional(),
  experiences: z.array(ExperienceSchema).optional(),
  educations: z.array(EducationSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
});

export class CreateResumeReqDto extends createZodDto(
  CreateResumeReqDtoSchema,
) {}

const CreateResumeResDtoSchema = z.object({
  message: z.string(),
  statusCode: z.enum(HttpStatus),
});

export class CreateResumeResDto extends createZodDto(
  CreateResumeResDtoSchema,
) {}

import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

export const MAX_EXPERIENCES = 3;
export const MAX_PROJECTS = 2;
export const MAX_PROJECT_TECHNOLOGIES = 5;
export const MAX_EDUCATIONS = 2;
export const MAX_SKILLS = 8;
export const MAX_CERTIFICATIONS = 2;
export const MAX_LANGUAGES = 5;

function dateRefine<T extends { startDate: string; endDate?: string }>(
  data: T,
) {
  try {
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : undefined;

    const today = new Date();
    if (startDate > today) return false;

    if (endDate) {
      return startDate <= endDate && endDate <= new Date();
    }
    return true;
  } catch {
    return false;
  }
}

const DateSchema = (error?: string) => z.string(error);

export const PersonalDetailsSchema = z.object(
  {
    fullName: z
      .string("Full name is required")
      .min(1, "Full name should be at least 1 character"),
    designation: z
      .string("Designation is required")
      .min(1, "Designation should be at least 1 character"),
    email: z.email("Email is required").trim().toLowerCase(),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .optional(),
    location: z.string().optional(),
  },
  "Personal details are required",
);

export const SocialsSchema = z.object({
  linkedIn: z
    .url("Invalid LinkedIn URL")
    .regex(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
      "Invalid LinkedIn profile URL",
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

export const ExperienceSchema = z
  .object({
    organization: z
      .string("Organization name is required")
      .min(1, "Organization name should be at least 1 character"),
    position: z
      .string("Experience position is required")
      .min(1, "Position should be at least 1 character"),
    startDate: DateSchema("Experience start date is required"),
    endDate: DateSchema().optional(),
    description: z
      .string()
      .min(1, "Description should be at least 1 character"),
  })
  .refine(dateRefine, "Invalid experience dates");

export const EducationSchema = z
  .object({
    institution: z
      .string("Institution is required")
      .min(1, "Institution name should be at least 1 character"),
    degree: z
      .string("Degree is required")
      .min(1, "Degree name should be at least 1 character"),
    field: z.string().optional(),
    startDate: DateSchema("Education start date is required"),
    endDate: DateSchema().optional(),
    grade: z.string().optional(),
  })
  .refine(dateRefine, "Invalid education dates");

export const ProjectSchema = z
  .object({
    name: z
      .string("Project name is required")
      .min(1, "Project name should be at least 1 character"),
    description: z
      .string("Project description is required")
      .min(1, "Description should be at least 1 character"),
    technologies: z
      .array(z.string(), "Project technologies are required")
      .nonempty("At least one project technology is required")
      .max(MAX_PROJECT_TECHNOLOGIES),
    liveLink: z.url().optional(),
    githubLink: z
      .url()
      .regex(
        /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+(\/.*)?$/,
        "Invalid GitHub repository URL",
      )
      .optional(),
    startDate: DateSchema("Project start date is required"),
    endDate: DateSchema().optional(),
  })
  .refine(dateRefine, "Invalid project dates");

export const CertificationSchema = z
  .object({
    title: z
      .string("Certification title is required")
      .min(1, "Certification name should be at least 1 character"),
    issuer: z
      .string("Certification issuer is required")
      .min(1, "Issuer name should be at least 1 character"),
    date: DateSchema("Certification date is required"),
    url: z.url("Certification url is required"),
  })
  .refine((data) => {
    try {
      return new Date(data.date) <= new Date();
    } catch {
      return false;
    }
  }, "Invalid certification date");

export const CreateResumeReqDtoSchema = z.object({
  title: z
    .string("Resume title is required")
    .min(2, "Title should be at least 2 characters")
    .max(255, "Title should be at most 255 characters")
    .optional(),
  summary: z
    .string()
    .max(250, "Summary should be at most 1000 characters")
    .optional(),
  personalDetails: PersonalDetailsSchema,
  socials: SocialsSchema.optional(),
  experiences: z.array(ExperienceSchema).max(MAX_EXPERIENCES),
  educations: z.array(EducationSchema).max(MAX_EDUCATIONS),
  skills: z.array(z.string()).max(MAX_SKILLS),
  projects: z.array(ProjectSchema).max(MAX_PROJECTS),
  certifications: z.array(CertificationSchema).max(MAX_CERTIFICATIONS),
  languages: z.array(z.string()).max(MAX_LANGUAGES),
  accentColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color code"),
  template: z.enum(["Classic", "Modern", "Elegant", "Hybrid"]).optional(),
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

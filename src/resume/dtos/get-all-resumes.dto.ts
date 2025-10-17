import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

const GetAllResumesResDtoSchema = z.object({
  message: z.string(),
  resumes: z.array(
    z.any(),
    // z.object({
    //   _id: z.string(),
    //   userId: z.string(),
    //   ...CreateResumeReqDtoSchema.shape,
    // }),
  ),
  statusCode: z.enum(HttpStatus),
});

export class GetAllResumesResDto extends createZodDto(
  GetAllResumesResDtoSchema,
) {}

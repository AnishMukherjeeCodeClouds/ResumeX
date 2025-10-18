import { createZodDto } from "nestjs-zod";
import z from "zod";
import { CreateResumeReqDtoSchema } from "./create-resume.dto";

function deepPartial<T extends z.ZodType>(schema: T): z.ZodType {
  if (schema instanceof z.ZodArray) {
    return z.array(deepPartial(schema.element as T));
  }
  if (schema instanceof z.ZodObject) {
    const shape: Record<string, z.ZodType> = {};
    for (const key in schema.shape) {
      shape[key] = deepPartial(schema.shape[key]);
    }
    return z.object(shape).partial();
  }
  return schema.optional();
  // if (schema instanceof z.ZodObject) {
  //   const shape: any = {};
  //   for (let key in schema.shape) {
  //     shape[key] = deepPartial(schema.shape[key]);
  //   }
  //   return z.object(shape).partial();
  // } else if (schema instanceof z.ZodArray) {
  //   return z.array(deepPartial(schema.element));
  // }
  // return schema.optional();
}

const UpdateResumeReqDtoSchema = deepPartial(
  CreateResumeReqDtoSchema,
) as z.ZodObject;

export class UpdateResumeReqDto extends createZodDto(
  UpdateResumeReqDtoSchema,
) {}

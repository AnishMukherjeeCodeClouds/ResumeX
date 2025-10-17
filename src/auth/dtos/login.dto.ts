import { createZodDto } from "nestjs-zod";
import { SignupReqDtoSchema, SignupResDtoSchema } from "./signup.dto";

const LoginReqDtoSchema = SignupReqDtoSchema.pick({
  username: true,
  email: true,
  password: true,
}).refine(
  (data) => {
    const hasEmail = data.email != undefined;
    const hasUsername = data.username != undefined;
    return hasEmail || hasUsername;
  },
  {
    message: "You must provide either an email or a username",
    path: ["email", "username"],
  },
);
export class LoginReqDto extends createZodDto(LoginReqDtoSchema) {}

export const LoginResDtoSchema = SignupResDtoSchema;

export class LoginResDto extends createZodDto(LoginResDtoSchema) {}

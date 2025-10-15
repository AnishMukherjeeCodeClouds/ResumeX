import { createZodDto } from "nestjs-zod";
import { SignupReqDtoSchema, SignupResDtoSchema } from "./SignupDto";

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

export const LoginResDtoSchema = SignupResDtoSchema.pick({
  accessToken: true,
  statusCode: true,
});

export class LoginResDto extends createZodDto(LoginResDtoSchema) {}

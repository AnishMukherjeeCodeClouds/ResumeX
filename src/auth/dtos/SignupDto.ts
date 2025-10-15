import { HttpStatus } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SignupReqDtoSchema = z
  .object({
    name: z
      .string("Name is required")
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name must be at most 255 characters long"),
    username: z
      .string("Username is required")
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      )
      .toLowerCase()
      .optional(),
    email: z
      .email("Email is required")
      .max(254, "Email must be at most 254 characters long")
      .trim()
      .toLowerCase()
      .optional(),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must be at most 128 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string("Confirm password is required"),
  })
  .refine(
    (data) => {
      const hasEmail = data.email != undefined;
      const hasUsername = data.username != undefined;
      return hasEmail || hasUsername;
    },
    {
      message: "You must provide either an email or a username",
      path: ["email", "username"],
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export class SignupReqDto extends createZodDto(SignupReqDtoSchema) {}

export const SignupResDtoSchema = z.object({
  message: z.string(),
  accessToken: z.jwt(),
  statusCode: z.enum(HttpStatus),
});

export class SignupResDto extends createZodDto(SignupResDtoSchema) {}

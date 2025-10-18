import mongoose from "mongoose";
import z from "zod";

export const IdRequestDtoSchema = z
  .string()
  .refine((v) => mongoose.Types.ObjectId.isValid(v), "Invalid Id");

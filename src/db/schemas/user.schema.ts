import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ unique: true })
  username: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("validate", function (next) {
  const user = this as UserDocument;

  const hasEmail = Boolean(user.email);
  const hasUsername = Boolean(user.username);

  if (!hasEmail && !hasUsername) {
    return next(new Error("You must provide either an email or a username"));
  }

  next();
});

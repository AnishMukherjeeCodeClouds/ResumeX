import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
class PersonalDetails {
  @Prop()
  fullname: string;
  @Prop()
  email: string;
  @Prop()
  phone: string;
}

const PersonalDetailsSchema = SchemaFactory.createForClass(PersonalDetails);

@Schema()
export class Resume {
  @Prop(PersonalDetailsSchema)
  personalDetails: PersonalDetails;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

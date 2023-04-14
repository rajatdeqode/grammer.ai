import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ enum: { values: ['school', 'work', 'other'] }, type: String })
  writingFor: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

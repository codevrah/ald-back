import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import {Transform} from "class-transformer";

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  userId: string;

  @Prop()
  displayName: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

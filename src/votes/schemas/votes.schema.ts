import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, ObjectId} from 'mongoose';
import { User, UserSchema } from './user.schema';
import * as mongoose from 'mongoose';
import { Question } from './question.schema';
import {Transform, Type} from 'class-transformer';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {
  // @Prop({ type: UserSchema })
  // @Type(() => User)
  // user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Question.name })
  question: Question;

  @Prop()
  type: string;

  @Prop({ default: false })
  published?: boolean;

  @Prop({ default: Date.now })
  publishedDate?: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

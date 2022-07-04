import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop()
  published: boolean;

  @Prop()
  question: string;

  @Prop({ default: Date.now })
  publishedDate: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

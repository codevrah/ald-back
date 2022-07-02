import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { User, UserSchema } from "./user.schema";
import * as mongoose from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;

    @Prop()
    question: string;

    @Prop()
    answer: string;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
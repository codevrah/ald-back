import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schemas/votes.schema';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { User, UserSchema } from './schemas/user.schema';
import { VotesRepository } from './repository/votes.repository';
import { Question, QuestionSchema } from './schemas/question.schema';
import {FacebookStrategy} from "../facebook.strategy";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema },
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [VotesController],
  providers: [FacebookStrategy, VotesService, VotesRepository],
})
export class VotesModule {}

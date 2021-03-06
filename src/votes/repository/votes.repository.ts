import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vote, VoteDocument } from '../schemas/votes.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';
import { VoteDto } from '../dto/vote.dto';
import { Question, QuestionDocument } from '../schemas/question.schema';
import * as _ from 'lodash';

@Injectable()
export class VotesRepository {
  constructor(
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findUser(userId: string): Promise<User> {
    return this.userModel.findOne({ userId: userId }).exec();
  }

  async getVotesWithUser(question: string): Promise<any[]> {
    return this.voteModel.find({ question: question }).populate('user').exec();
  }

  async createUser(userDto: UserDto): Promise<User> {
    const createdUser = await new this.userModel(userDto);
    await createdUser.save();
    return createdUser;
  }

  async createVote(voteDto: VoteDto): Promise<Vote> {
    const createdVote = await new this.voteModel(voteDto);
    await createdVote.save();
    return createdVote;
  }

  async findVoteByUser(userId: string, questionId: string): Promise<Vote> {
    return this.voteModel.findOne({ user: userId, question: questionId }).exec();
  }

  async getVotes(): Promise<Vote[]> {
    return this.voteModel.find().exec();
  }

  async updateVotes(unpublishedVotes: any[]): Promise<any> {
    return this.voteModel
      .updateMany(
        { id: { $in: _.map(unpublishedVotes, 'id') } },
        { published: true },
      )
      .exec();
  }

  async deleteAll() {
    await this.voteModel.deleteMany();
    await this.userModel.deleteMany();
  }

  async findQuestions(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }
}

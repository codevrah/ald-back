import { Injectable } from '@nestjs/common';
import { Vote } from './schemas/votes.schema';
import { VoteDto } from './dto/vote.dto';
import { VotesRepository } from './repository/votes.repository';
import { Question } from './schemas/question.schema';
import * as _ from 'lodash';
import {User} from "./schemas/user.schema";
import {UserDto} from "./dto/user.dto";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository, private readonly httpService: HttpService) {}

  async createUser(userDto: UserDto): Promise<User> {
    const user = await this.votesRepository.findUser(userDto.userId);
    if (user) {
      return user;
    }
    return this.votesRepository.createUser(userDto);
  }
  async create(voteDto: VoteDto): Promise<Vote> {
    return await this.votesRepository.createVote(voteDto);
  }

  async findQuestions(): Promise<Question[]> {
    return this.votesRepository.findQuestions();
  }

  async getVotes(): Promise<any> {
    const votes: Vote[] = await this.votesRepository.getVotes();
    const votesTypes: any[] = _.partition(votes, { type: 'inFavor' });
    const unpublishedVotesInFavor: Vote[] = _.filter(votesTypes[0], {
      published: false,
    });
    const unpublishedVotesAgainst: Vote[] = _.filter(votesTypes[1], {
      published: false,
    });
    const ratio = Math.abs(
      unpublishedVotesInFavor.length - unpublishedVotesAgainst.length,
    );
    if (ratio > 5) {
      await this.votesRepository.updateVotes(
        _.concat(unpublishedVotesInFavor, unpublishedVotesAgainst),
      );
    }
    const inFavor =
      ratio > 5
        ? votesTypes[0].length
        : votesTypes[0].length - unpublishedVotesInFavor.length;
    const against =
      ratio > 5
        ? votesTypes[1].length
        : votesTypes[1].length - unpublishedVotesAgainst.length;
    const total = inFavor + against;
    const inFavorPercent = (inFavor * 100) / total;
    const againstPercent = (against * 100) / total;
    const votesLeft =
      ratio > 5
        ? 0
        : unpublishedVotesInFavor.length + unpublishedVotesAgainst.length;
    return {
      inFavor,
      against,
      total,
      inFavorPercent,
      againstPercent,
      votesLeft,
    };
  }

  async getUsers(question: string): Promise<any> {
    const votes = await this.votesRepository.getVotesWithUser(question);
    return _.flatMap(votes, (vote) => {
      return {
        user: {
          name: vote.user.displayName,
          avatar: vote.user.avatar,
        },
      };
    });
  }

  //
  // async findAll(): Promise<Vote[]> {
  //     return this.voteModel.find().populate('user').exec();
  // }
  //
  async deleteAll() {
    await this.votesRepository.deleteAll();
  }

  //
  // async findUsers(): Promise<User[]> {
  //     return this.userModel.find().exec();
  // }

  async hasVoted(userId: string, questionId: string): Promise<boolean> {
    const user: any = await this.votesRepository.findUser(userId);
    if (!user) return false;
    const vote = await this.votesRepository.findVoteByUser(user.id, questionId);
    return vote != null;
  }

  async getFacebookIdUserByAccessToken(token: string): Promise<string>{
    const result =  await firstValueFrom(this.httpService.get(`https://graph.facebook.com/me?fields=id&access_token=${token}`));
     return result.data.id
  }
}

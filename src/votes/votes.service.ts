import {Injectable} from '@nestjs/common';
import {Vote, VoteDocument} from "./schemas/votes.schema";
import {VoteDto} from "./dto/vote.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {VotesRepository} from "./repository/votes.repository";
import {Question} from "./schemas/question.schema";
import * as _ from "lodash";

@Injectable()
export class VotesService {
    constructor(private readonly votesRepository: VotesRepository) {
    }

    async create(voteDto: VoteDto): Promise<Vote> {
        const createdVote = await this.votesRepository.createVote(voteDto);
        return createdVote;
    }

    async findQuestions(): Promise<Question[]> {
        return this.votesRepository.findQuestions();
    }

    async getVotes(): Promise<any> {
        let votes: Vote[] = await this.votesRepository.getVotes();
        let votesTypes: any[] = _.partition(votes, {'type': 'inFavor'});
        let unpublishedVotesInFavor: Vote[] = _.filter(votesTypes[0], {'published': false});
        let unpublishedVotesAgainst: Vote[] = _.filter(votesTypes[1], {'published': false});
        const ratio = Math.abs(unpublishedVotesInFavor.length - unpublishedVotesAgainst.length);
        if (ratio > 5) {
            await this.votesRepository.updateVotes(_.concat(unpublishedVotesInFavor, unpublishedVotesAgainst));
        }
        const inFavor = (ratio > 5) ? votesTypes[0].length : votesTypes[0].length - unpublishedVotesInFavor.length;
        const against = (ratio > 5) ? votesTypes[1].length : votesTypes[1].length - unpublishedVotesAgainst.length;
        const total = inFavor + against;
        const inFavorPercent = inFavor * 100 / total;
        const againstPercent = against * 100 / total;
        const votesLeft = (ratio > 5) ? 0: unpublishedVotesInFavor.length + unpublishedVotesAgainst.length;
        return {
            inFavor,
            against,
            total,
            inFavorPercent,
            againstPercent,
            votesLeft
        }
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

    async hasVoted(userId: string): Promise<boolean> {
        const user = await this.votesRepository.findUser(userId);
        if (user == null) {
            return false;
        }
        return true;
    }
}

import {Injectable} from '@nestjs/common';
import {Vote, VoteDocument} from "./schemas/votes.schema";
import {VoteDto} from "./dto/vote.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {VotesRepository} from "./repository/votes.repository";
import {Question} from "./schemas/question.schema";

@Injectable()
export class VotesService {
    constructor(private readonly votesRepository: VotesRepository) {
    }

    async create(voteDto: VoteDto): Promise<Vote> {
        const createdVote = await this.votesRepository.createVote(voteDto);
        return createdVote;
    }

    async findQuestions(): Promise<Question[]>{
        return this.votesRepository.findQuestions();
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

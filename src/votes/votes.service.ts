import {Injectable} from '@nestjs/common';
import {Vote, VoteDocument} from "./schemas/votes.schema";
import {CreateVoteDto} from "./dto/create-vote.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./schemas/user.schema";

@Injectable()
export class VotesService {
    constructor(@InjectModel(Vote.name) private voteModel: Model<VoteDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async create(createVoteDto: CreateVoteDto): Promise<Vote> {
        const createdUser = await new this.userModel(createVoteDto.user);
        await createdUser.save();
        const createdVote = await new this.voteModel({
            user: createdUser,
            question: createVoteDto.question,
            answer: createVoteDto.answer,
        });
        return createdVote.save();
    }

    async findAll(): Promise<Vote[]> {
        return this.voteModel.find().populate('user').exec();
    }

    async deleteAll() {
        this.voteModel.deleteMany().exec();
        this.userModel.deleteMany().exec();
    }

    async findUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async hasVoted(userId: string): Promise<boolean> {
        const user = await this.userModel.findOne({userId: userId}).exec();
        if (user == null) {
            return false;
        }
        return true;
    }
}

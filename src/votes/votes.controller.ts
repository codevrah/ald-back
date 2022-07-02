import {Controller, Get, UseGuards, HttpStatus, Req, Param, Query} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {VotesService} from "./votes.service";
import {CreateVoteDto} from "./dto/create-vote.dto";
import {Vote} from "./schemas/votes.schema";
import {User} from "./schemas/user.schema";

@Controller()
export class VotesController {
    constructor(private readonly votesService: VotesService) {}

    @UseGuards(AuthGuard('facebook-token'))
    @Get('addVote')
    async addVote(@Req() req, @Query('question') question: string, @Query('answer') answer: string): Promise<any>{
        const hasVoted = await this.votesService.hasVoted(req.user.id);
        if(hasVoted){
            return {
                "error": "User has voted"
            }
        }
        const createVoteDto = new CreateVoteDto(req.user, question, answer);
        return this.votesService.create(createVoteDto);

    }

    @Get('getVotes')
    async getVotes(): Promise<Vote[]> {
        const votes = this.votesService.findAll();
        return votes;
    }

    @Get('delete')
    deleteAll(): string {
        this.votesService.deleteAll();
        return "ELIMINADO"
    }

    @Get('findUsers')
    async findUsers(): Promise<User[]> {
        const users = this.votesService.findUsers();
        return users;
    }
}

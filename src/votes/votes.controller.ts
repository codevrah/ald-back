import {Controller, Get, UseGuards, HttpStatus, Req, Param, Query, Post, Body} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {VotesService} from "./votes.service";
import {VoteDto} from "./dto/vote.dto";
import {Vote} from "./schemas/votes.schema";
import {User} from "./schemas/user.schema";
import { UserDto } from "./dto/user.dto";
import {QuestionDto} from "./dto/question.dto";
import mongoose from "mongoose";
import {Question} from "./schemas/question.schema";

@Controller('api')
export class VotesController {
    constructor(private readonly votesService: VotesService) {}

    @UseGuards(AuthGuard('facebook-token'))
    @Post('votes')
    async addVote(@Req() req, @Body() voteDto: VoteDto): Promise<any>{
        const hasVoted = await this.votesService.hasVoted(req.user.id);
        if(hasVoted){
            return {
                "error": "User has voted"
            }
        }
        const userDto: UserDto = {
            userId: req.user.id,
            displayName: req.user.displayName,
            email: req.user.emails[0].value,
        };
        voteDto.user = userDto;
        return this.votesService.create(voteDto);
    }

    @Get('delete')
    deleteAll(): string {
        this.votesService.deleteAll();
        return "ELIMINADO"
    }

    @Get('questions')
    async findQuestions(): Promise<Question[]>{
        return this.votesService.findQuestions();
    }
}

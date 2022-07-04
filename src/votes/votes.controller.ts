import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Param, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { UserDto } from './dto/user.dto';
import { Question } from './schemas/question.schema';
import {User} from "./schemas/user.schema";

@Controller('api')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard('facebook-token'))
  // @UseGuards(CubaOnlyGuard, AuthGuard('facebook-token'))
  @Post('votes')
  async addVote(@Req() req, @Body() voteDto: VoteDto): Promise<any> {
    const hasVoted = await this.votesService.hasVoted(req.user.id);
    if (hasVoted) {
      return {
        error: 'User has voted',
      };
    }
    const userDto: UserDto = {
      userId: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails[0].value,
      avatar: req.user.photos[0].value,
    };
    const user: User = await this.votesService.createUser(userDto);
    voteDto.user = user;
    return this.votesService.create(voteDto);
  }

  @Get('votes')
  async getVotes(): Promise<any[]> {
    return this.votesService.getVotes();
  }

  @Get('users')
  async getUsers(@Query('question') question: string): Promise<any> {
    return this.votesService.getUsers(question);
  }

  @Get('delete')
  deleteAll(): string {
    this.votesService.deleteAll();
    return 'ELIMINADO';
  }

  @Get('questions')
  async findQuestions(): Promise<Question[]> {
    return this.votesService.findQuestions();
  }
}

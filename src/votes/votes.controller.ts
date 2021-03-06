import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {VotesService} from './votes.service';
import {VoteDto} from './dto/vote.dto';
import {UserDto} from './dto/user.dto';
import {Question} from './schemas/question.schema';
import {ParseObjectIdPipe} from "./pipes/objectid-validation.pipe";

@Controller('api')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard('facebook-token'))
  // @UseGuards(CubaOnlyGuard, AuthGuard('facebook-token'))
  @Post('votes')
  async addVote(@Req() req, @Body() voteDto: VoteDto): Promise<any> {
    const hasVoted = await this.votesService.hasVoted(req.user.id, voteDto.question);
    if (hasVoted) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: "The user has voted already"
      }, HttpStatus.CONFLICT);
    }
    const userData = await this.votesService.getFacebookUserDataByAccessToken(req.headers['access_token']);
    const userDto: UserDto = {
      userId: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails.length > 1 ? req.user.emails[0].value: null,
      avatar: userData.picture.data.url
    };
    voteDto.user = await this.votesService.createUser(userDto);
    return this.votesService.create(voteDto);
  }

  @Get('votes')
  async getVotes(): Promise<any[]> {
    return this.votesService.getVotes();
  }

  @Get('users')
  async getUsers(@Query('question', ParseObjectIdPipe) question: string): Promise<any> {
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

  @Get('user-voted')
  async userHasVoted(@Req() req, @Query('question', ParseObjectIdPipe) question: string): Promise<any> {
    const token = req.headers['access_token'];
    const userData = await this.votesService.getFacebookUserDataByAccessToken(token);
    const hasVoted = await this.votesService.hasVoted(userData.id, question);
    return {
      vote: hasVoted
    }
  }
}

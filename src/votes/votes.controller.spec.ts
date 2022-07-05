import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { VotesRepository } from './repository/votes.repository';
import { Vote, VoteSchema } from './schemas/votes.schema';
import spyOn = jest.spyOn;
import * as UserStubs from '../../test/stubs/user.dto.stub';
import {
  Vote1DTOStub, Vote2DTOStub,
  votesUnpublishedDTOStub,
} from '../../test/stubs/vote.dto.stub';
import { Question, QuestionSchema } from './schemas/question.schema';
import {HttpModule, HttpService} from "@nestjs/axios";

describe('Votes Controller', () => {
  let votesController: VotesController;
  let votesService: VotesService;
  let votesRepository: VotesRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [VotesController],
      providers: [
        VotesService,
        {
          provide: VotesRepository,
          useValue: {
            createUser: jest.fn(),
            createVote: jest.fn(),
            deleteAll: jest.fn(),
            findQuestions: jest.fn(),
            getVotesWithUser: jest
              .fn()
              .mockResolvedValue([
                Vote1DTOStub(),
                Vote2DTOStub(),
              ]),
            findUser: jest.fn(),
            findVoteByUser: jest.fn(),
            getFacebookUserDataByAccessToken: jest.fn(),
            getVotes: jest.fn().mockResolvedValue(votesUnpublishedDTOStub()),
            updateVotes: jest.fn().mockResolvedValue(true),
          },
        },
        { provide: getModelToken(User.name), useValue: UserSchema },
        { provide: getModelToken(Vote.name), useValue: VoteSchema },
        { provide: getModelToken(Question.name), useValue: QuestionSchema },
      ],
    }).compile();
    votesController = app.get<VotesController>(VotesController);
    votesService = app.get<VotesService>(VotesService);
    votesRepository = app.get<VotesRepository>(VotesRepository);
  });

  describe('addVotes()', () => {
    it('User has voted', async () => {
      spyOn(votesRepository, 'findUser').mockResolvedValue(
        UserStubs.User1DTOStub(),
      );
      spyOn(votesRepository, 'findVoteByUser').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(Vote1DTOStub()),
      } as any);
      const response = await votesController.addVote(
        {
          user: {
            id: Vote1DTOStub().user.userId,
            displayName: Vote1DTOStub().user.displayName,
            emails: [
              {
                value: Vote1DTOStub().user.email,
              },
            ],
            photos: [{value: Vote1DTOStub().user.avatar}],
          },
        },
        Vote1DTOStub(),
      );
      expect(response).toEqual({
        error: 'User has voted',
      });
    });
    it('User has not voted', async () => {
      spyOn(votesRepository, 'findUser').mockResolvedValue(null);
      spyOn(votesService, 'create').mockResolvedValue(null);
      spyOn(votesService, 'getFacebookUserDataByAccessToken').mockResolvedValueOnce({
        id: Vote1DTOStub().user.userId,
        picture: {
          data: {
            url: Vote1DTOStub().user.avatar
          }
        }
      })
      await votesController.addVote(
        {
          user: {
            id: Vote1DTOStub().user.userId,
            displayName: Vote1DTOStub().user.displayName,
            emails: [
              {
                value: Vote1DTOStub().user.email,
              },
            ],
            photos: [{value: Vote1DTOStub().user.avatar}],
          },
          headers: {
            access_token: "a63hha3"
          }
        },
        Vote1DTOStub(),
      );
      expect(spyOn(votesService, 'create')).toHaveBeenCalled();
    });
  });

  describe('getVotes()', () => {
    it('Get votes', async () => {
      const votes = await votesController.getVotes();
      expect(spyOn(votesRepository, 'updateVotes')).toHaveBeenCalled();
      expect(votes).toEqual({
        inFavor: 10,
        against: 90,
        total: 100,
        inFavorPercent: 10,
        againstPercent: 90,
        votesLeft: 0,
      });
    });
  });

  describe('getUsers()', () => {
    it('Get users', async () => {
      const question = 'ab1234';
      const users = await votesController.getUsers(question);
      expect(users).toEqual([
        {
          user: {
            name: UserStubs.User1DTOStub().displayName,
            avatar: UserStubs.User1DTOStub().avatar,
          },
        },
        {
          user: {
            name: UserStubs.User2DTOStub().displayName,
            avatar: UserStubs.User2DTOStub().avatar,
          },
        },
      ]);
    });
  });
});

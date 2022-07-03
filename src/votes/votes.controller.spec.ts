import {Test, TestingModule} from '@nestjs/testing';
import {VotesController} from './votes.controller';
import {VotesService} from './votes.service';
import {getModelToken} from '@nestjs/mongoose';
import {User, UserSchema} from "./schemas/user.schema"
import {VotesRepository} from "./repository/votes.repository";
import {Vote, VoteSchema} from "./schemas/votes.schema";
import spyOn = jest.spyOn;
import * as UserStubs from "../../test/stubs/user.dto.stub";
import {Vote1DTOStub, votesUnpublishedDTOStub} from "../../test/stubs/vote.dto.stub";
import {Question, QuestionSchema} from "./schemas/question.schema";

describe('Votes Controller', () => {
    let votesController: VotesController;
    let votesService: VotesService;
    let votesRepository: VotesRepository;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [],
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
                        findUser: jest.fn(),
                        getVotes: jest.fn().mockResolvedValue(votesUnpublishedDTOStub()),
                        updateVotes: jest.fn().mockResolvedValue(true)
                    }
                },
                {provide: getModelToken(User.name), useValue: UserSchema},
                {provide: getModelToken(Vote.name), useValue: VoteSchema},
                {provide: getModelToken(Question.name), useValue: QuestionSchema},
            ],
        }).compile();
        votesController = app.get<VotesController>(VotesController);
        votesService = app.get<VotesService>(VotesService);
        votesRepository = app.get<VotesRepository>(VotesRepository);
    });

    describe("addVotes()", () => {
        it("User has voted", async () => {
            spyOn(votesRepository, 'findUser').mockResolvedValue(UserStubs.User1DTOStub());
            const response = await votesController.addVote({user: {id: Vote1DTOStub().user.userId}}, Vote1DTOStub());
            expect(response).toEqual({
                "error": "User has voted"
            });
        });
        it("User has not voted", async () => {
            spyOn(votesRepository, 'findUser').mockResolvedValue(null);
            spyOn(votesService, 'create').mockResolvedValue(null);
            await votesController.addVote({
                user: {
                    id: Vote1DTOStub().user.userId,
                    displayName: Vote1DTOStub().user.displayName,
                    emails: [
                        {
                            "value": Vote1DTOStub().user.email
                        }
                    ]
                }
            }, Vote1DTOStub());
            expect(spyOn(votesService, 'create')).toHaveBeenCalled();
        });
    });

    describe("getVotes()", () => {
        it("Get votes", async () => {
            const votes = await votesController.getVotes();
            expect(spyOn(votesRepository, 'updateVotes')).toHaveBeenCalled();
            expect(votes).toEqual({
                "inFavor": 10,
                "against": 90,
                "total": 100,
                "inFavorPercent": 10,
                "againstPercent": 90,
                "votesLeft": 0
            });
        });
    });
});

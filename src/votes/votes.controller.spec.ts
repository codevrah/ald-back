import {Test, TestingModule} from '@nestjs/testing';
import {VotesController} from './votes.controller';
import {VoteDto} from './dto/vote.dto';
import {VotesService} from './votes.service';
import {UserDto} from './dto/user.dto';
import {QuestionDto} from './dto/question.dto';
import {getModelToken} from '@nestjs/mongoose';
import {User, UserDocument, UserSchema} from "./schemas/user.schema"
import {VotesRepository} from "./repository/votes.repository";
import {Connection, connect, Model} from "mongoose";
import {Vote, VoteSchema} from "./schemas/votes.schema";
import spyOn = jest.spyOn;
import * as UserStubs from "../../test/stubs/user.dto.stub";
import {Vote1DTOStub} from "../../test/stubs/vote.dto.stub";
import {Question, QuestionSchema} from "./schemas/question.schema";

describe('Votes Controller', () => {
    let votesController: VotesController;
    let userModel: Model<User>;
    let votesService: VotesService;
    let votesRepository: VotesRepository;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [VotesController],
            providers: [
                VotesService,
                VotesRepository,
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
        
    });
});

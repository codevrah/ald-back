import {VoteDto} from "../../src/votes/dto/vote.dto";
import {User1DTOStub, User2DTOStub} from "./user.dto.stub";
import {Question1DTOStub} from "./question.dto.stub";

export const Vote1DTOStub = (): VoteDto => {
    return {
        user: User1DTOStub(),
        question: "43",
        type: "inFavor",
    };
};

export const Vote2DTOStub = (): VoteDto => {
    return {
        user: User2DTOStub(),
        question: "54",
        type: "against",
    };
};

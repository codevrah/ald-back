import {VoteDto} from "../../src/votes/dto/vote.dto";
import {User1DTOStub, User2DTOStub} from "./user.dto.stub";
import {Question1DTOStub} from "./question.dto.stub";
import {UserDto} from "../../src/votes/dto/user.dto";

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
        question: "43",
        type: "against",
    };
};

export const votesUnpublishedDTOStub = (): Array<VoteDto> => {
    let votesDto: Array<VoteDto> = [];
    for(let i = 0; i < 90; i++){
        const userDto: UserDto = {
            userId: i.toString(),
            displayName: "MyUser" + i.toString(),
            email: "myuser"+ i.toString()+"@fakegmail.com"
        };
        const voteDto: VoteDto = {
            user: userDto,
            question: "43",
            type: "against",
            published: false
        }
        votesDto.push(voteDto);
    }
    for(let i = 90; i < 100; i++){
        const userDto: UserDto = {
            userId: i.toString(),
            displayName: "MyUser" + i.toString(),
            email: "myuser"+ i.toString()+"@fakegmail.com"
        };
        const voteDto: VoteDto = {
            user: userDto,
            question: "43",
            type: "inFavor",
            published: false
        }
        votesDto.push(voteDto);
    }
    return votesDto;

}

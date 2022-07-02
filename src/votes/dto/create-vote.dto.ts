
import {CreateUserDto} from "./create-user.dto";

export class CreateVoteDto {
    constructor(user: any, question: string, answer: string){
        this.user = new CreateUserDto(user.id, user.displayName, user.emails[0].value);
        this.question = question;
        this.answer = answer;
    }
    user: CreateUserDto;
    question: string;
    answer: string;
}

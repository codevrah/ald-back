
import { QuestionDto } from "./question.dto";
import {UserDto} from "./user.dto";

export class VoteDto {
    user?: UserDto;
    question: string;
    type: string;
}

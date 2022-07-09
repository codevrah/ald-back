import { UserDto } from './user.dto';
import {User} from "../schemas/user.schema";
import {IsIn, IsString} from "class-validator";
import {Exclude} from "class-transformer";

export class VoteDto {
  user: User;

  @IsString()
  question: string;

  @IsString()
  @IsIn(['inFavor', 'against'])
  type: string;

  @Exclude()
  published?: boolean;

  @Exclude()
  publishedDate?: Date;
}

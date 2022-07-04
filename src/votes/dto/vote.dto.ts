import { UserDto } from './user.dto';
import {User} from "../schemas/user.schema";

export class VoteDto {
  user: User;
  question: string;
  type: string;
  published?: boolean;
  publishedDate?: Date;
}

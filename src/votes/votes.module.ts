import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Vote, VoteSchema} from "./schemas/votes.schema";
import {VotesService} from "./votes.service";
import {VotesController} from "./votes.controller";
import {User, UserSchema} from "./schemas/user.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: "Vote", schema: VoteSchema}, {name: "User", schema: UserSchema}])],
    controllers: [VotesController],
    providers: [VotesService]
})
export class VotesModule {

}

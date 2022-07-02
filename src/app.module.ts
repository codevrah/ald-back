import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {FacebookStrategy} from "./facebook.strategy";
import {VotesModule} from './votes/votes.module';
import {MongooseModule} from "@nestjs/mongoose";
import {VotesService} from "./votes/votes.service";

import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`), VotesModule],
  controllers: [AppController],
  providers: [AppService, FacebookStrategy],
})
export class AppModule {
}

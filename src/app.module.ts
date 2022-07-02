import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacebookStrategy } from "./facebook.strategy";
import { VotesModule } from './votes/votes.module';
import {MongooseModule} from "@nestjs/mongoose";
import {VotesService} from "./votes/votes.service";

@Module({
  imports: [MongooseModule.forRoot('mongodb://admin:admin@127.0.0.1:27017/ald_db'), VotesModule],
  controllers: [AppController],
  providers: [AppService, FacebookStrategy],
})
export class AppModule {}

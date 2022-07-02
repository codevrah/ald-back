import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import * as FacebookTokenStrategy from 'passport-facebook-token'


@Injectable()
export class FacebookStrategy extends PassportStrategy(FacebookTokenStrategy, 'facebook-token') {
    constructor() {
        super({
            clientID: process.env.APP_ID,
            clientSecret: process.env.APP_SECRET,
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: FacebookTokenStrategy.Profile,
        done: (err: any, profile: any, info?: any) => void,
    ): Promise<any> {
        try {
            return done(null, profile) // whatever should get to your controller
        } catch (e) {
            return done('error', null)
        }
    }
}

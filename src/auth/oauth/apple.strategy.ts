import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID || '',
      teamID: process.env.APPLE_TEAM_ID || '',
      keyID: process.env.APPLE_KEY_ID || '',
      privateKeyString: process.env.APPLE_PRIVATE_KEY || '',
      callbackURL: process.env.APPLE_CALLBACK_URL || '',
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<any> {
    const user = {
      provider: 'apple',
      providerId: profile.id,
      email: profile.email,
      name: profile.name?.firstName + ' ' + profile.name?.lastName,
    };
    done(null, user);
  }
}

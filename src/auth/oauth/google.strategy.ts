// src/auth/oauth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class  GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prisma: PrismaService) {
    const clientID = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || '';

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth environment variables');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user = await this.prisma.user.upsert({
      where: { email: profile.emails[0].value },
      update: {
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: 'google',
      },
      create: {
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: 'google',
        providerId: profile.id,
      },
    });

    done(null, user);
  }
}

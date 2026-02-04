import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import { EmailService } from './email.service';


@Injectable()
export class AuthService {
  refreshTokens(sub: any, refreshToken: any) {
      throw new Error('Method not implemented.');
  }

  decodeAppleJwt(idToken: string): { email: string; sub: string } {
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}


  async register(dto: RegisterDto) {
    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
  
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
  
    // Hash the password
    const hashed = await bcrypt.hash(dto.password, 10);
  
    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
      },
    });
  
    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email);
  
    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);
  
    return { userId: user.id, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.password) throw new ForbiddenException('Invalid credentials');

    const pwMatch = await bcrypt.compare(dto.password, user.password);
    if (!pwMatch) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return { userId: user.id, ...tokens };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
this.jwt.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRATION },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.REFRESH_SECRET_EXPIRATION },
      ),
    ]);
    return { accessToken, refreshToken };
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async storeRefreshToken(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async handleOAuthLogin(oauthUser: {
    provider: string;
    providerId: string;
    email: string;
    name?: string;
    avatar?: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: oauthUser.email },
    });
  
    if (existingUser) {
      const tokens = await this.issueTokens(existingUser.id);
      this.updateRefreshToken(existingUser.id, tokens.refreshToken);
      return tokens;
    }
  
    const newUser = await this.prisma.user.create({
      data: {
        email: oauthUser.email,
        name: oauthUser.name ?? 'Anonymous',
        avatar: oauthUser.avatar,
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
      },
    });
  
    const tokens = await this.issueTokens(newUser.id);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }
    // Removed duplicate updateRefreshToken method
    async issueTokens(userId: string) {
        const [accessToken, refreshToken] = await Promise.all([
this.jwt.signAsync(
                { sub: userId },
                { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRATION },
            ),
            this.jwt.signAsync(
                { sub: userId },
                { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.REFRESH_SECRET_EXPIRATION },
            ),
        ]);
        return { accessToken, refreshToken };
    }

 

async validateGoogleToken(token: string) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid token payload');
  }
  const email = payload.email;
  const providerId = payload.sub;
  const name = payload.name;
  const avatar = payload.picture;

  // Check if user exists
  let user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email: email ?? (() => { throw new Error('Email is undefined'); })(),
        name: name ?? 'Anonymous',
        avatar,
        provider: 'google',
        providerId,
      },
    });
  }

  const tokens = await this.getTokens(user.id, user.email);
  await this.updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
}

async validateAppleToken(idToken: string, name: string) {
  const decoded = this.decodeAppleJwt(idToken); // you can use a helper to decode JWT

  const email = decoded.email;
  const providerId = decoded.sub;

  let user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        name,
        provider: 'apple',
        providerId,
      },
    });
  }

  const tokens = await this.getTokens(user.id, user.email);
  await this.updateRefreshToken(user.id, tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
}

async sendResetCode(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time 15 minutes from now
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    // Save code and expiration to user record
    await this.prisma.user.update({
      where: { email },
      data: {
        resetCode: code,
        resetCodeExpiration: expiration,
      },
    });

    // Send code via email
    await this.emailService.sendResetCode(email, code);

    return { message: 'Reset code sent to email' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetCode || !user.resetCodeExpiration) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Check if code matches and is not expired
    if (user.resetCode !== code || user.resetCodeExpiration < new Date()) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code fields
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        resetCode: null,
        resetCodeExpiration: null,
      },
    });

    return { message: 'Password reset successful' };
  }
  
}


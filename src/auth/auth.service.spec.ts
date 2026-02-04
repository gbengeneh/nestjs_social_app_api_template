import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendResetCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        username: null,
        password: 'hashedpassword',
        refreshToken: null,
        provider: null,
        providerId: null,
        avatar: null,
        bio: null,
        resetCode: null,
        resetCodeExpiration: null,
        banner_image: null,
        facebookLink: null,
        instagramLink: null,
        twitterLink: null,
        gender: null,
        dob: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await expect(service.register({ name: 'Test', email: 'test@example.com', password: 'password' })).rejects.toThrow('Email already exists');
    });

    it('should create user and return tokens', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        username: null,
        password: 'hashedpassword',
        refreshToken: null,
        provider: null,
        providerId: null,
        avatar: null,
        bio: null,
        resetCode: null,
        resetCodeExpiration: null,
        banner_image: null,
        facebookLink: null,
        instagramLink: null,
        twitterLink: null,
        gender: null,
        dob: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' });
      jest.spyOn(service, 'storeRefreshToken').mockResolvedValue();

      const result = await service.register({ name: 'Test', email: 'test@example.com', password: 'password' });
      expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh', userId: '1' });
    });
  });

  describe('getTokens', () => {
    it('should call jwt.signAsync with correct parameters', async () => {
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');
      const tokens = await service.getTokens('1', 'test@example.com');
      expect(tokens).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('login', () => {
    it('should throw ForbiddenException if user not found or password missing', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      await expect(service.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Invalid credentials');
    });

    it('should throw ForbiddenException if password does not match', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        username: null,
        password: 'hashed',
        refreshToken: null,
        provider: null,
        providerId: null,
        avatar: null,
        bio: null,
        resetCode: null,
        resetCodeExpiration: null,
        banner_image: null,
        facebookLink: null,
        instagramLink: null,
        twitterLink: null,
        gender: null,
        dob: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Invalid credentials');
    });

    it('should return tokens if login successful', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        username: null,
        password: 'hashed',
        refreshToken: null,
        provider: null,
        providerId: null,
        avatar: null,
        bio: null,
        resetCode: null,
        resetCodeExpiration: null,
        banner_image: null,
        facebookLink: null,
        instagramLink: null,
        twitterLink: null,
        gender: null,
        dob: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' });
      jest.spyOn(service, 'storeRefreshToken').mockResolvedValue();

      const result = await service.login({ email: 'test@example.com', password: 'password' });
      expect(result).toEqual({ accessToken: 'access', refreshToken: 'refresh', userId: '1' });
    });
  });
});

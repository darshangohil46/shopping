import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'priya@example.com',
      });

      await expect(
        authService.signup({
          name: 'Priya',
          email: 'priya@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new user and return an access token valid for 1h', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const mockCreatedAt = new Date('2026-01-01');
      const mockUpdatedAt = new Date('2026-01-01');
      (usersService.create as jest.Mock).mockImplementation((data) =>
        Promise.resolve({
          id: 'user-uuid-1',
          name: data.name,
          email: data.email,
          password: data.passwordHash,
          createdAt: mockCreatedAt,
          updatedAt: mockUpdatedAt,
        }),
      );

      const result = await authService.signup({
        name: 'Priya',
        email: 'priya@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken', 'mocked-jwt-token');
      expect(result).toHaveProperty('expiresIn', '1h');
      expect(result.user).toEqual({
        id: 'user-uuid-1',
        name: 'Priya',
        email: 'priya@example.com',
        createdAt: mockCreatedAt,
        updatedAt: mockUpdatedAt,
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'Priya',
        email: 'priya@example.com',
        password: hashedPassword,
      });

      await expect(
        authService.login({
          email: 'priya@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully login and return access token with 1h expiry', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 'user-1',
        name: 'Priya',
        email: 'priya@example.com',
        password: hashedPassword,
      });

      const result = await authService.login({
        email: 'priya@example.com',
        password: 'correctPassword',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.expiresIn).toBe('1h');
      expect(result.user.email).toBe('priya@example.com');
    });
  });
});

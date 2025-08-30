import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        credentials: true,
      },
    });

    if (user?.credentials && (await bcrypt.compare(password, user.credentials.passwordHash))) {
      const { credentials, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        role: 'STUDENT',
        credentials: {
          create: {
            passwordHash: hashedPassword,
          },
        },
      },
      include: {
        credentials: true,
      },
    });

    const { credentials, ...result } = user;
    return this.login(result);
  }

  async googleLogin(profile: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.emails[0].value,
          name: profile.displayName,
          role: 'STUDENT',
          accounts: {
            create: {
              type: 'oauth',
              provider: 'google',
              providerAccountId: profile.id,
            },
          },
        },
      });
    }

    return this.login(user);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService,
     private jwt: JwtService,
     private config :ConfigService) {}

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          createdAt: true,
          email: true,
        },
      });
      // return the saved user
      return this.signToken(user.id,user.email);
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    //get user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //check if user exists
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // check if password matches
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');

    //return user
    return this.signToken(user.id,user.email);
  }

   async signToken(userId: number, email: string) : Promise<{
    access_token : string
  }> {
    const payload = {
      sub : userId,
      email
    }
    let token  = await this.jwt.signAsync(payload, 
      {
        expiresIn : '15m',
        secret : this.config.get('JWT_SECRET')
      })
    return {
      access_token :token
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/editUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

 async editUser(userId: number, EditBody: EditUserDto) {
    let updateUser =  await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...EditBody,
      },
    });
    return updateUser;
  }
}

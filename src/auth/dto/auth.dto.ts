import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description :'user email',
    example : 'blow@gmail.com'
 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description :'password',
    example : 'any data type is valid'
 })
  @IsString()
  @IsNotEmpty()
  password: string;
}

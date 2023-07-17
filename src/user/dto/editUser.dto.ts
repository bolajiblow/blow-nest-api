import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  
 @ApiProperty({
    description :'user email',
    example : 'blow@gmail.com'
 })
  @IsEmail()
  @IsOptional()
  email?: string;


  @ApiProperty({
    description :'user lastname',
    example : 'blow'
 })
  @IsString()
  @IsOptional()
  lastName?: string;


  @ApiProperty({
    description :'user firstname',
    example : 'big'
 })
  @IsString()
  @IsOptional()
  firstName?: string;
 
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'bookmark title lastname',
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'bookmark description, can be optional',
    example: 'link description',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'link url',
    example: 'link',
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}

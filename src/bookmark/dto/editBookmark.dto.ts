import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDto {
  @ApiProperty({
    description: 'bookmark title lastname',
    example: 'string',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'bookmark description, can be optional',
    example: 'link description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'link url',
    example: 'link',
  })
  @IsString()
  @IsOptional()
  link?: string;
}

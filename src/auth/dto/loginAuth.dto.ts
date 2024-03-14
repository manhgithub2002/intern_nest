import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  password: string;
}

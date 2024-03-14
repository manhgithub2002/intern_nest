import { ApiProperty } from '@nestjs/swagger';

export class FireBaseLoginResponse {
  @ApiProperty()
  idToken: string;

  @ApiProperty()
  refreshToken: string;
}

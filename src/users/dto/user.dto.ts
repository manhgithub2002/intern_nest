import { IsNotEmpty, Length } from "class-validator";
import { BaseDto } from "../../common/base.dto";
import { Expose } from "class-transformer";

export class UserDto extends BaseDto{
    @IsNotEmpty()
    @Expose()
    fullname: string;

    @IsNotEmpty()
    @Expose()
    username: string;

    @IsNotEmpty()
    @Expose()
    password: string;

}
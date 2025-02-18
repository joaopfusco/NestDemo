import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponse {
    @IsString()
    @ApiProperty()
    token: string;

    @ApiProperty()
    user: User;
}
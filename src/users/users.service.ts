import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginPayload } from './dto/login-payload';
import { LoginResponse } from './dto/login-response';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') || '10', 10);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
    const user = this.repository.create({ ...createUserDto, password: hashedPassword });
    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) { 
      return null; 
    }
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
    
    this.repository.merge(user, updateUserDto);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) { return null; }
    return this.repository.remove(user);
  }

  async login(loginPayload: LoginPayload) {
    const user = await this.repository.findOneBy({
      username: loginPayload.username,
    });

    if (!user || !(await bcrypt.compare(loginPayload.password, user.password))) {
      return null;
    }
    
    const payload = { userId: user.id, username: user.username };
    const token = this.jwtService.sign(payload)
    const response: LoginResponse = { token: token, user: user };
    return response;
  }
}

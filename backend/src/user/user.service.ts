import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('A user with such email exists.');
    }

    const createUser = this.userRepository.create({
      ...createUserDto,
      password_hash: createUserDto.password,
    });

    const savedUser = await this.userRepository.save(createUser);

    return savedUser;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

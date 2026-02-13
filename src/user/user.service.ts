import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update.user.dto';
import argon2 from 'argon2';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAllUsers() {
        return this.userRepository.find()
    }


    async updateProfile(user: User, dto: UpdateUserDto){
        const existingUser = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });
        if(existingUser && existingUser.id !== user.id){
            throw new ConflictException('Email already exists');
        }
        user.email = dto.email || user.email;
        if (dto.password) {
            user.password = await argon2.hash(dto.password);
        }
        user.firstName = dto.firstName || user.firstName;
        user.lastName = dto.lastName || user.lastName;

        await this.userRepository.save(user);
        delete (user as any).password;

        return user;
    }
}

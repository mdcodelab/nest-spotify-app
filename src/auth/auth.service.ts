import { Injectable } from '@nestjs/common';
import { AuthDto } from '../dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async register(dto: AuthDto){
        let existing = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        })
        
        if(existing){
            throw new Error('Email already exists');
        }

        const hash = await argon2.hash(dto.password);
        const newUser = this.userRepository.create({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
        })
        await this.userRepository.save(newUser);


        return { msg: 'You have registered', newUser };
    } 

    login(dto: AuthDto){
        return { msg: 'I have logged in', dto };
    }
}

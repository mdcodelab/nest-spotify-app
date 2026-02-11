import { Injectable, ConflictException, 
    UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ){}

    async register(dto: AuthDto){
        let existing = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        })
        
        if(existing){
            throw new ConflictException('Email already exists');
        }

        const hash = await argon2.hash(dto.password);
        const newUser = this.userRepository.create({
            email: dto.email,
            password: hash,
            firstName: dto.firstName,
            lastName: dto.lastName,
        })

        await this.userRepository.save(newUser);
        delete (newUser as any).password;

        return newUser;
    } 

    async login(dto: AuthDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await argon2.verify(user.password, dto.password);
        
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            sub: user.id, 
            email: user.email 
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };
    }
}

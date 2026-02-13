import { Injectable, ConflictException, 
    UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { Role } from 'src/user/user.entity';

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
            role: (dto.role as Role) || Role.USER,
        })

        await this.userRepository.save(newUser);
        delete (newUser as any).password;

        return newUser;
    } 

    async login(dto: AuthDto, res: Response ) {
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
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload);

        // ⚡ Setăm cookie-ul direct în service
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 zi
    });
        return {
            access_token: token,
        };
    }
}
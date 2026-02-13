import { Controller, Post, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import type { Response as ExpressResponse } from 'express';


@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: AuthDto){
        return this.authService.register(dto)
    }

    @Post('login')
    login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: ExpressResponse){
        return this.authService.login(dto, res)
    }




}

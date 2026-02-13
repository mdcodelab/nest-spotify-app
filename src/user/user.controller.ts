import {Controller, Req, Get, Patch, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard} from '../auth/guards/auth.guards';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './user.entity';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('profile')
  getMe(@Req() req: any) {
    return req.user;
  }

  @Roles(Role.ADMIN)
  @Get("admin")
  getAllUsers(@Req() req: any) {
    return this.userService.findAllUsers();
  }

}


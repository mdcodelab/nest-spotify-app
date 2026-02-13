import {Controller, Req, Get, Patch, Body, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard} from '../auth/guards/auth.guards';
import { UserService } from './user.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './user.entity';
import { UpdateUserDto } from './dto/update.user.dto';


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

  @Patch("profile")
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto){
    return this.userService.updateProfile(req.user, dto);
  }

}


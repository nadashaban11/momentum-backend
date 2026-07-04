import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateUserDto } from "./dtos";

@Controller('users')
export class UserController{
    constructor(private readonly userService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyProfile(@Req() req: any) {
        const user = await this.userService.findById(req.user.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateMyProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(req.user.id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('me')
    async deleteMyAccount(@Req() req: any) {
        await this.userService.remove(req.user.id);
        return { message: 'Account deleted successfully' };
    }

    @UseGuards(JwtAuthGuard) 
    @Get(':id')
    async getUserProfile(@Param('id') id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UserController{
    constructor(private readonly userService: UsersService) {}

    
}
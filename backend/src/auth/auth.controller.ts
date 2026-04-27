import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(
        // @Body() input: { email: string, password: string }
        @Request() request: any
    ) {
        // return this.authService.authenticate(input);
        return this.authService.signIn(request.user);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request: any) {
        return request.user;
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

type AuthInput = { email: string, password: string };
type SignInData = { userId: string, email: string };
type AuthResult = { accessToken: string, userData: SignInData };

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    // async authenticate(input: AuthInput): Promise<AuthResult> {
    //     const user = await this.validateUser(input);

    //     if (!user) {
    //         throw new UnauthorizedException();
    //     }

    //     return this.signIn(user);
    // }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findUserByEmail(input.email);

        if (user && user.password_hash === input.password) {
            return { userId: user.id, email: user.email };
        }

        return null;
    }

    async signIn(userData: SignInData): Promise<AuthResult> {
        const tokenPayload = {
            sub: userData.userId,
            email: userData.email
        };

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return { accessToken, userData };
    }
}

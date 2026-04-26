import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

type AuthInput = { email: string, password: string };
type SignInData = { userId: string, email: string };
type AuthResult = { accessToken: string, userData: SignInData };

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            accessToken: 'mocked-jwt-token',
            userData: user,
        }
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findUserByEmail(input.email);

        if (user && user.password_hash === input.password) {
            return { userId: user.id, email: user.email };
        }

        return null;
    }
}

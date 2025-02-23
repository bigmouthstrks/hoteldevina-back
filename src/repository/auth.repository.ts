import { User, PrismaClient } from '@prisma/client';
import { AuthMessages } from '../constants/auth-messages';
import { UserData } from '../models/user';
import { APIError } from '../api-error';
import prisma from '../utils/prisma-client-wrapper';

class AuthRepository {
    async register(userData: UserData): Promise<User> {
        const user = await prisma.user
            .create({
                data: userData,
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(AuthMessages.REGISTER_ERROR, 500);
            });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    async getUser(email: string): Promise<User | null> {
        const user = await prisma.user
            .findUnique({
                where: { email },
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(AuthMessages.USER_NOT_FOUND, 500);
            });
        return user;
    }

    async resetPassword(email: string, newPassword: string): Promise<User | null> {
        const user = await prisma.user
            .update({
                where: { email },
                data: { password: newPassword },
            })
            .catch((error) => {
                console.error(error);
                throw new APIError(AuthMessages.UNABLE_TO_UPDATE_USER, 500);
            });
        return user;
    }
}

export default new AuthRepository();

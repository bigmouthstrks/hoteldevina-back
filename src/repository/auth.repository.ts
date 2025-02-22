import { User, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthMessages } from '../constants/auth-messages';
import { UserData } from '../models/user';
import { APIError } from '../api-error';

const prisma = new PrismaClient();

class AuthRepository {
    async register(userData: UserData): Promise<User> {
        const user = await prisma.user
            .create({
                data: userData,
            })
            .catch((error) => {
                throw new APIError(AuthMessages.REGISTER_ERROR, error.code);
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
                throw new APIError(AuthMessages.USER_NOT_FOUND, error.code);
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
                throw new APIError(AuthMessages.UNABLE_TO_UPDATE_USER, error.code);
            });
        return user;
    }
}

export default new AuthRepository();

import { Request, Response } from 'express';
import { AuthMessages } from '../constants/auth-messages';
import { BaseResponse } from '../base-response';
import authRepository from '../repository/auth.repository';
import { APIError } from '../api-error';
import { generateToken } from '../utils/jwt-helper';
import { UserData } from '../models/user';
import hashUtils from '../utils/hash-utils';

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const userData: UserData = req.body;
            const hashedPassword = await hashUtils.hash(userData.password);
            const userWithoutPassword = {
                ...userData,
                password: hashedPassword,
            };
            const newUser = await authRepository.register(userWithoutPassword);
            res.status(200).send(new BaseResponse(AuthMessages.REGISTER_SUCCESS, newUser));
        } catch (error) {
            res.status(500).send(
                new BaseResponse(AuthMessages.REGISTER_ERROR, undefined, error as APIError)
            );
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await authRepository.getUser(email);

            if (user) {
                const passwordsMatch = await hashUtils.passwordsMatch(user.password, password);
                if (passwordsMatch) {
                    const token = generateToken(user);
                    res.status(200).send(new BaseResponse(AuthMessages.LOGIN_SUCCESS, { token }));
                    return;
                } else {
                    res.status(500).send(
                        new BaseResponse(
                            AuthMessages.INVALID_CREDENTIALS,
                            undefined,
                            new APIError(AuthMessages.INVALID_CREDENTIALS, 401)
                        )
                    );
                    return;
                }
            }
            res.status(404).send(
                new BaseResponse(
                    AuthMessages.USER_NOT_FOUND,
                    undefined,
                    new APIError(AuthMessages.USER_NOT_FOUND, 404)
                )
            );
            return;
        } catch (error) {
            res.status(500).send(
                new BaseResponse(AuthMessages.LOGIN_ERROR, undefined, error as APIError)
            );
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body;
            await authRepository.resetPassword(email, newPassword);

            res.status(200).send(new BaseResponse(AuthMessages.RESET_PASSWORD_SUCCESS));
        } catch (error) {
            res.status(500).send(
                new BaseResponse(AuthMessages.RESET_PASSWORD_ERROR, undefined, error as APIError)
            );
        }
    }
}

export default new AuthController();

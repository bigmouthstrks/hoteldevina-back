import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRATION = '7d';

export function generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign({ id: user.userId, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

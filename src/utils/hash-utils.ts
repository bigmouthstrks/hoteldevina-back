import * as bcrypt from 'bcrypt';

class HashUtils {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async passwordsMatch(storedPassword: string, rawPassword: string): Promise<boolean> {
        return await bcrypt.compare(rawPassword, storedPassword);
    }
}

export default new HashUtils();

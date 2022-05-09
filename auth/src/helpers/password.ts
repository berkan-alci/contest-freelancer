import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordHashAndCompare {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`;
    };

    static async compare(hashedPassword: string, unhashedPassword: string) {
        const [hash, salt] = hashedPassword.split('.');
        const buffer = (await scryptAsync(unhashedPassword, salt, 64)) as Buffer;

        return buffer.toString('hex') === hash; 

    };
};
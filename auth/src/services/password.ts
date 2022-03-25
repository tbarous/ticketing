import {scrypt, randomBytes} from "crypto";
import {promisify} from "util";

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = Password.getSalt();

        const buf = (await Password.getBuffer(password, salt) as Buffer);

        return `${buf.toString("hex")}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");

        const buf = (await Password.getBuffer(suppliedPassword, salt) as Buffer);

        return buf.toString("hex") === hashedPassword;
    }

    static getBuffer(password: string, salt: string) {
        return scryptAsync(password, salt, 64);
    }

    static getSalt() {
        return randomBytes(8).toString("hex");
    }
}
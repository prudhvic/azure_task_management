import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
export async function hashPassword(password: string, salt = 10) {
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword

    } catch (error) {
        console.log("Unable to pefrorm  password hash operation")
        throw new Error("unable to perform password hash")
    }
}

export async function verifyPassword(originalPassword: string, hashedPassword: string) {
    try {
        const isValid = await bcrypt.compare(originalPassword, hashedPassword)
        return isValid
    } catch (error) {
        console.log("Unable to compare password");
        throw new Error("unable to compare password")
    }

}

export function signJwtToken(payload: object) {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" })
        return token;
    } catch (error) {
        console.log("Unable to sign JWT token");
        throw new Error("unable to sign JWT token")
    }
}

export function verifyJwtToken(token: string) {

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) 
        return decoded;
    } catch (error) {
        console.log("Unable to verify JWT token");
        throw new Error("unable to verify JWT token")
    }

}

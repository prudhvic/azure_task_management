import jwt from 'jsonwebtoken';
export declare function hashPassword(password: string, salt?: number): Promise<string>;
export declare function verifyPassword(originalPassword: string, hashedPassword: string): Promise<boolean>;
export declare function signJwtToken(payload: object): string;
export declare function verifyJwtToken(token: string): string | jwt.JwtPayload;
//# sourceMappingURL=auth.d.ts.map
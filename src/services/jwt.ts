import { User } from "@prisma/client";
import JWT from 'jsonwebtoken'
import { JWTUser } from "../interfaces";

const JWT_SECRET = '$uper@1234.';

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email
        };
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }

    public static decodeToken(token: string) {
        try {
            console.log("tried")
            return JWT.verify(token, JWT_SECRET) as JWTUser;
        }
        catch (error) {
            console.log("Returning NULL")
            console.log(error);  // log the error
            return null;
        }
    }
}

export default JWTService
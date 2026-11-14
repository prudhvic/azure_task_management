import { verifyJwtToken } from "../utils/auth.js";
export function authorizeToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = verifyJwtToken(token);
        req.user = {
            id: decodedToken.id,
            email: decodedToken.email,
            name: decodedToken.name
        };
        next();
    }
    catch (error) {
        console.log("Unable to authorize user", error);
        res.status(500).json({ message: "Unable to authorize user" });
    }
}
//# sourceMappingURL=auth.js.map
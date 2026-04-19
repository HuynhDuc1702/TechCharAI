import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";


export const authToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];



    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" })
    }



    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        return res.status(404).json({ message: "Jwt_Secret is missing" })
    }
    try {

        const decoded = jwt.verify(accessToken, jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

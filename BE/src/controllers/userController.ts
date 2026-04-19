import { Request, Response } from "express";
import * as userService from "../services/authService"
import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, generateTokenRefresh } from "../utils/generateToken";
import { redis } from "../lib/redis";


export const register = async (req: Request, res: Response) => {
    try {
        const user = await userService.registerService(req.body);

        return res.status(201).json({

            message: "Resgister succeeded"
        });
    } catch (error) {
        console.error("Error when get register user", error);
        return res.status(500).json({ message: "System Error" });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const user = await userService.loginService(req.body);

        res.cookie("refreshToken", user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        return res.status(201).json({

            message: "Login succeeded",
            accessToken: user.accessToken,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

    }
}
export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        // await redis.set(
        //     `blacklist:${token}`,
        //     "1",
        //     {
        //         EX: 7 * 24 * 60 * 60,
        //     }
        // );
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "Logout success",
        });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed" });
    }
}
export const verifyRefreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token found" });
    }
    try {
        const jwt_secret = process.env.JWT_REFRESH_SECRET;
        if (!jwt_secret) {
            return res.status(401).json({ message: "No jwt_secret" });
        }
        const decoded = jwt.verify(token, jwt_secret) as JwtPayload;

        const newAccessToken = generateToken({
            id: decoded.id,
        })

        return res.status(200).json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
}